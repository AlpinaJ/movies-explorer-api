const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/userModel");
/* Errors */
const { BadRequestError } = require("../errors/BadRequestError");
const { ConflictError } = require("../errors/ConflictError");

module.exports.signup = (req, res, next) => {
  console.log("signup", req);
  const {
    name, email, password,
  } = req.body;

  console.log(name);
  if (!validator.isEmail(email)) {
    next(new BadRequestError("Переданы некорректные данные"));
  }

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, email, password: hash,
    }).then((user) => {
      res.send({
        data: {
          email: user.email,
          name: user.name,
        },
      });
    })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError("Пользователь с таким EMAIL уже зарегистрирован"));
        } else if (err.name === "ValidationError") {
          next(new BadRequestError("Переданы некорректные данные при создании пользователя"));
        } else {
          next(err);
        }
      });
  }).catch((err) => {
    next(err);
  });
};
