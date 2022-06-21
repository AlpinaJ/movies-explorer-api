const express = require("express");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const { celebrate, Joi, errors } = require("celebrate");

const cors = require("cors");

const { auth } = require("./middlewares/auth");

const { login, logout, signup } = require("./controllers/userControllers");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { NotFoundError } = require("./errors/NotFoundError");

const userRoutes = require("./routes/userRouter");
const movieRoutes = require("./routes/movieRouter");

const { PORT = 3000 } = process.env;
// mongoose.connect("mongodb://localhost:27017/bitfilmsdb");
mongoose.connect("mongodb://localhost:27017/bitfilmsdb/?authSource=admin").then(()=>{
  console.log(`successfully connected`);
}).catch((e)=>{
  console.log(`not connected`, e);
})

const app = express();

require("dotenv").config();

app.use(express.json());
const corsOptions = {
  origin: ["https://AlpinaJ-diplom.nomoredomains.xyz", "http://AlpinaJ-diplom.nomoredomains.xyz", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(requestLogger);

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), signup);

app.post("/signout", logout);

app.use(auth);
app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

app.use((req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

console.log("listen on port", PORT);
app.listen(PORT);
