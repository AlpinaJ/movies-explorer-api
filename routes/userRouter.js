const userRoutes = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getUser, updateUser } = require("../controllers/userControllers");

userRoutes.get("/me", getUser);
userRoutes.patch("/me", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = userRoutes;
