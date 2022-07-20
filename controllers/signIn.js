const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

const JWT_KEY = "jwt";
const JWT_OPTIONS = {
  maxAge: 604800000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
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

            console.log("token", token);
            res.cookie(JWT_KEY, token, JWT_OPTIONS);
            res.status(200).send({ message: "success" });
            console.log(res, res.cookie);
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
