const userModel = require("../model/user.js")
const jwt = require("jsonwebtoken")
const responseHandler = require("../handler/response.js")

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser) return responseHandler.badrequest(res, "username already used");

    const user = new userModel();

    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);

    await user.save();

    const token = jwt.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    const {salt,createdAt,updatedAt,...others} = user._doc

    responseHandler.created(res, {
      token,
      others
    });

  } catch(err) {
    responseHandler.error(res);
  }
};

// const signin = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await userModel.findOne({ username }).select("username password salt id displayName");

//     if (!user) return responseHandler.badrequest(res, "User not exist");

//     if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

//     const token = jwt.sign(
//       { data: user.id },
//       process.env.TOKEN_SECRET,
//       { expiresIn: "24h" }
//     );

//     user.password = undefined;
//     user.salt = undefined;

//     responseHandler.created(res, {
//       token,
//       ...user._doc,
//       id: user.id
//     });
//   } catch {
//     responseHandler.error(res);
//   }
// };

// const updatePassword = async (req, res) => {
//   try {
//     const { password, newPassword } = req.body;

//     const user = await userModel.findById(req.user.id).select("password id salt");

//     if (!user) return responseHandler.unauthorize(res);

//     if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

//     user.setPassword(newPassword);

//     await user.save();

//     responseHandler.ok(res);
//   } catch {
//     responseHandler.error(res);
//   }
// };

// const getInfo = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.user.id);

//     if (!user) return responseHandler.notfound(res);

//     responseHandler.ok(res, user);
//   } catch {
//     responseHandler.error(res);
//   }
// };

module.exports = {
    signup
}