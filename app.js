const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require("body-parser");
const { celebrate, Joi, errors } = require("celebrate");
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
      ), //1
      about: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

///вратА аутентификации\\\
app.use(auth);
///вратА аутентификации\\\
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/card"));

app.use((req, res, next) => {
  res.status(404).send({
    message:
      "Вы попали на сервер Mesto. Воспользуйтесь эндпоинтами для операций с данными.",
  });

  next();
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
