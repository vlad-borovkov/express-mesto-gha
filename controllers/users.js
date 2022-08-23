const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .populate("user")
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id) //методом поиска обращаемся к бд
    .populate("user")
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

// module.exports.createFilm = (req, res) => {
//   const { title, genre, directorId } = req.body;

//   Film.create({ title, genre, director: directorId })
//     .then((film) => res.send({ data: film }))
//     .catch((err) => res.status(500).send({ message: err.message }));
// };
