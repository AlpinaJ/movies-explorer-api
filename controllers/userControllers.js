const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
/* Errors */
const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { ConflictError } = require("../errors/ConflictError");

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
        res.send({ email: user.email, name: user.name });
      } else {
        next(new NotFoundError("Пользователь не найден"));
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при обновлении профиля"));
      } else if (err.name === "CastError") {
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError("Неправильные почта или пароль"));
      } else {
        bcrypt.compare(password, user.password).then((result) => {
          if (result) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.NODE_ENV === "production" ? process.env.JWT_SECRET
                : "some-secret-key",
              { expiresIn: "7d" },
            );

            res.cookie(JWT_KEY, token, JWT_OPTIONS);
            res.status(200).send({ message: "success" });
          } else {
            next(new UnauthorizedError("Неправильные почта или пароль"));
          }
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie(JWT_KEY, JWT_OPTIONS);
  res.end();
};

module.exports.signup = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

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
  }).catch(next);
};
