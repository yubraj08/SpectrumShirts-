const express = require("express");
const { body } = require("express-validator");
const user = require("../controller/user.js");
const request = require("../handler/request.js");
const userModel = require("../model/user.js");
const token = require("../middleware/token.js")
const fav = require("../controller/favorite.js")


const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("username minimum 3 characters")
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 3 })
    .withMessage("password minimum 3 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 3 })
    .withMessage("confirmPassword minimum 3 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    }),
  body("displayName")
    .exists()
    .withMessage("displayName is required")
    .isLength({ min: 3 })
    .withMessage("displayName minimum 3 characters"),
  request.validate,
  user.signup
);

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("username minimum 3 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 3 })
    .withMessage("password minimum 3 characters"),
  request.validate,
  user.signin
);

router.put(
  "/update-password",
  token.auth,
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 3 }).withMessage("password minimum 3 characters"),
  body("newPassword")
    .exists().withMessage("newPassword is required")
    .isLength({ min: 3 }).withMessage("newPassword minimum 3 characters"),
  body("confirmNewPassword")
    .exists().withMessage("confirmNewPassword is required")
    .isLength({ min: 3 }).withMessage("confirmNewPassword minimum 3 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("confirmNewPassword not match");
      return true;
    }),
  request.validate,
  user.updatePassword
);

router.get(
  "/info",
  token.auth,
  user.getInfo
);

router.get(
  "/favorites",
  token.auth,
  fav.getFavoritesOfUser
);

router.post(
  "/favorites",
  token.auth,
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  body("mediaRate")
    .exists().withMessage("mediaRate is required"),
  request.validate,
  fav.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  token.auth,
  fav.removeFavorite
);

module.exports = router;
