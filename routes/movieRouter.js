const routes = require("express").Router();
const {createMovie, getMovies, deleteMovie} = require("../controllers/movieControllers");

routes.post("/", createMovie);
routes.get("/", getMovies);
routes.delete("/", deleteMovie);

module.exports = routes;