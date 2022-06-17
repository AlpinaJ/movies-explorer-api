const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
/* Errors */
const {NotFoundError} = require("../errors/NotFoundError");
const {BadRequestError} = require("../errors/BadRequestError");

const JWT_KEY = "jwt";
const JWT_OPTIONS = {
  maxAge: 604800000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({email: user.email, name: user.name});
      } else {
        next(new NotFoundError("Пользователь не найден"));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const {email, name} = req.body;
  User.findByIdAndUpdate(req.user._id,
    {email, name},
    {new: true, runValidators: true},)
    .then((user) => res.status(200).send({email: user.email, name: user.name}))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при обновлении профиля"));
      } else if (err.name === "CastError") {
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      } else {
        next(err);
      }
    });
}