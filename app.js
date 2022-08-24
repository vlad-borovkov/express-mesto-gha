const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.use((req, res, next) => {
  req.user = {
    _id: "63048c9b8976910f72ec0b6d", //хардкодим аутентификацию
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/card"));

app.use((req, res, next) => {
  res
    .status(404)
    .send({ message: "Страница по указанному маршруту не найдена" });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
