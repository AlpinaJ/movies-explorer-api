const router = require("express").Router();
const userRoutes = require("./userRouter");
const movieRoutes = require("./movieRouter");
const appRoutes = require("./appRouter");
const { auth } = require("../middlewares/auth");
const { NotFoundError } = require("../errors/NotFoundError");

router.use("/", appRoutes);

// router.use(auth);
router.use("/users", userRoutes);
router.use("/movies", movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

module.exports = router;
