const express = require("express");

const mongoose = require("mongoose");

const userRoutes = require("./routes/userRouter");
const movieRoutes = require("./routes/movieRouter");

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://localhost:27017/bitfilmsdb");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62a9895ebc767e98bc76fe7d' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/users", userRoutes);

app.use("/movies", movieRoutes);

console.log("Listen on port", PORT);
app.listen(PORT);