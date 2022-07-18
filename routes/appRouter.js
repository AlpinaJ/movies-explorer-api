const appRoutes = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { login } = require("../controllers/signIn");
const { signup } = require("../controllers/signUp");
const { logout } = require("../controllers/signOut");

console.log("we are routers");

appRoutes.post("/signin",
  celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}),
  login);

appRoutes.post("/signup",
  celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}),
  signup);

appRoutes.post("/signout", logout);

module.exports = appRoutes;
