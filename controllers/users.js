const User = require("../models/user");

const ERR = {
  IntServ: 500,
  NotFound: 404,
  BadRequest: 400,
};

const OK = {
  OK: 200,
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(OK.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные при создании пользователя`,
        });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
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
