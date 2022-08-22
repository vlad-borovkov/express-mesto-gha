const express = require("express");
const mongoose = require("mongoose");
//const router = require("./router.js"); // импортируем роутер
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {});

//app.use("/", router); // запускаем

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
