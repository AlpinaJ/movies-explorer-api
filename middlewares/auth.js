const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === "production" ? process.env.JWT_SECRET
      : "some-secret-key");
  } catch (err) {
    console.log(err);
    next(new UnauthorizedError("Необходима авторизация"));
  }
  req.user = payload;

  return next();
};
