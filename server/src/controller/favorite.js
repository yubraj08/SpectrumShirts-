const response = require("../handler/response.js")
const favModel = require("../model/fav.js")

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) return response.ok(res, isFavorite);

    const favorite = new favModel({
      ...req.body,
      user: req.user.id
    });

    await favorite.save();

    response.created(res, favorite);
  } catch {
    response.error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });

    if (!favorite) return response.notfound(res);

    await favorite.remove();

    response.ok(res);
  } catch {
    response.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favModel.find({ user: req.user.id }).sort("-createdAt");

    response.ok(res, favorite);
  } catch {
    response.error(res);
  }
};

module.exports =  { addFavorite, removeFavorite, getFavoritesOfUser };