const routes = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {getUser, updateUser} = require("../controllers/userControllers");

routes.get("/me", getUser);
routes.patch("/me", updateUser);

module.exports = routes;
