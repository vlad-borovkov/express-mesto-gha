const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ERR = {
  IntServ: 500,
  NotFound: 404,
  BadRequest: 400,
};

const OK = {
  OK: 200,
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id) //методом поиска обращаемся к бд
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERR.NotFound;
      throw error;
    })
    .then((user) => res.status(OK.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные`,
        });
      } else if (err.statusCode === ERR.NotFound) {
        res.status(ERR.NotFound).send({
          message: `Пользователь по указанному _id не найден`,
        });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK.OK).send({ data: users }))
    .catch((err) => res.status(ERR.IntServ).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId) //методом поиска обращаемся к бд
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERR.NotFound;
      throw error;
    })
    .then(
      (user) => res.status(OK.OK).send({ message: "пользоватлеь добавлен" }) //data: user.deletePasswordFromUser()
    )
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные`,
        });
      } else if (err.statusCode === ERR.NotFound) {
        res.status(ERR.NotFound).send({
          message: `Пользователь по указанному _id не найден`,
        });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ email, password: hash, name, about, avatar })
      .then((user) => res.status(OK.OK).send({ data: user.name }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(ERR.BadRequest).send({
            message: `Переданы некорректные данные при создании пользователя`,
          });
        } else if (err.code === 11000) {
          res
            .status(409)
            .send({ message: "Такой пользователь уже существует" });
        } else {
          res
            .status(ERR.IntServ)
            .send({ message: `Ошибка на сервере ${err.message}` });
        }
      })
  );
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERR.NotFound;
      throw error;
    })
    .then((user) => res.status(OK.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные при обновлении профиля`,
        });
      } else if (err.statusCode === ERR.NotFound) {
        res
          .status(ERR.NotFound)
          .send({ message: `Пользователь с указанным _id не найден` });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERR.NotFound;
      throw error;
    })
    .then((user) => res.status(OK.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные при обновлении аватара`,
        });
      } else if (err.statusCode === ERR.NotFound) {
        res
          .status(ERR.NotFound)
          .send({ message: `Пользователь с указанным _id не найден` });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};
