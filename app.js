const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.use((req, res, next) => {
  req.user = {
    _id: "63048c9b8976910f72ec0b6d", //хардкодим аутентификацию
  };

  next();
});

app.post("/signin", login);
app.post("/signup", createUser);

//to do 6. Создайте контроллер и роут для получения информации о пользователе

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/card"));

app.use((req, res, next) => {
  res.status(404).send({
    message:
      "Вы попали на сервер Mesto. Воспользуйтесь эндпоинтами для операций с данными.",
  });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
