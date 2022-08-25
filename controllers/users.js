const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId) //методом поиска обращаемся к бд
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: `Переданы некорректные данные`,
        });
      } else if (err.statusCode === 404) {
        res.status(404).send({
          message: `Пользователь по указанному _id не найден`,
        });
      } else {
        res.send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при создании пользователя`,
        });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.message}` });
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
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении профиля`,
        });
      } else if (error.statusCode === 404) {
        res
          .status(404)
          .send({ message: `Пользователь с указанным _id не найден` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении аватара`,
        });
      } else if (error.statusCode === 404) {
        res
          .status(404)
          .send({ message: `Пользователь с указанным _id не найден` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};
