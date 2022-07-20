const movieRoutes = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { createMovie, getMovies, deleteMovie } = require("../controllers/movieControllers");

movieRoutes.post("/", celebrate({
  body: Joi.object().keys({
    // country: Joi.string().required(),
    // director: Joi.string().required(),
    // duration: Joi.number().required(),
    // year: Joi.number().required(),
    // description: Joi.string().required(),
    // image: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    // trailerLink: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    // movieId: Joi.number().required(),
    // nameRU: Joi.string().required(),
    // nameEN: Joi.string().required(),
    // thumbnail: Joi.string().required(),
  }),
}), createMovie);
movieRoutes.get("/", getMovies);
movieRoutes.delete("/:id", celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24),
  }),
}), deleteMovie);

module.exports = movieRoutes;
