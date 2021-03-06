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
    res.send(card)
    }
  )
    .catch((err) => {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Передвны некорректные данные"));
    } else {
      next(err);
    }
  });
};

module.exports.getMovies = (req, res, next) => {
  console.log("try to return movies");
  Movie.find({}).then((movies) => {
    console.log("movies in back");
    res.send({ data: movies });
  }).catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      next(new NotFoundError("Фильм с указанным _id не найдена"));
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.findByIdAndDelete(req.params.id).then(() => res.send(movie));
      }
     return next(new ForbiddenError("Вы не можете удалить чужой фильм"));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные удаления карточки"));
      } else {
        next(err);
      }
    });
};
