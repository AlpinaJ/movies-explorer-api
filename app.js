const express = require("express");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const { errors } = require("celebrate");

const cors = require("cors");

const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const routes = require("./routes/index");

const { PORT = 3000 } = process.env;
mongoose.connect(process.env.NODE_ENV === "production" ? process.env.DATA_BASE : "mongodb://127.0.0.1:27017/moviesdb");

const app = express();

require("dotenv").config();

app.use(express.json());
const corsOptions = {
  origin: ["https://alpinaj-diplom.nomoredomains.sbs", "http://alpinaj-diplom.nomoredomains.sbs",
    "http://localhost:3000", "http://localhost:3001", "https://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
