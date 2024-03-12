const jwt = require("jsonwebtoken")
const response = require("../handler/response.js")
const userModel = require("../model/user.js")

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jwt.verify(
        token,
        process.env.TOKEN_SECRET
      );
    }

    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) return response.unauthorize(res);

  const user = await userModel.findById(tokenDecoded.data);

  if (!user) return response.unauthorize(res);

  req.user = user;

  next();
};

module.exports = {
    auth,
    tokenDecode
}