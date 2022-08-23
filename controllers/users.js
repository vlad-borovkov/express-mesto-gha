const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    // .populate("user") нужен в карточках
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId) //методом поиска обращаемся к бд
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name })
    .then((user) => res.send(`Имя пользователя ${user.name} обновлено успешно`))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then((user) =>
      res.send(`Аватар пользователя ${user.name} обновлён успешно`)
    )
    .catch((err) => res.status(500).send({ message: err.message }));
};
