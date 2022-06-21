const Movie = require("../models/movieModel");

const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ForbiddenError } = require("../errors/ForbiddenError");

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  }).then((card) => {
    res.send({
      country: card.country,
      director: card.director,
      duration: card.duration,
      year: card.year,
      description: card.description,
      image: card.image,
      trailerLink: card.trailerLink,
      thumbnail: card.thumbnail,
      movieId: card.movieId,
      nameRU: card.nameRU,
      nameEN: card.nameEN,
      owner: req.user._id,
    });
  }).catch((err) => {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Передвны некорректные данные"));
    } else {
      next(err);
    }
  });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({}).then((movies) => {
    res.send({ data: movies });
  }).catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.query._id)
    .orFail(() => {
      next(new NotFoundError("Фильм с указанным _id не найдена"));
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError("Вы не можете удалить чужой фильм"));
      }
      return Movie.findByIdAndDelete(req.query._id).then(() => res.send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        owner: req.user._id,
      }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные удаления карточки"));
      } else {
        next(err);
      }
    });
};
