const Card = require("../models/card");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при создании карточки`,
        });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .then((card) => res.status(200).send({ data: `карточка удалена` }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: `Карточка с указанным _id не найдена`,
        });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.name}` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  console.log(req.params.cardId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .populate("likes")
    .then((likeOnCard) => res.status(200).send({ data: likeOnCard }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные для постановки/снятии лайка`,
        });
      } else if (error.statusCode === 404) {
        res
          .status(404)
          .send({ message: `Передан несуществующий _id карточки` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((deleteLike) => res.status(200).send(`лайк на карточке удалён`))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении профиля`,
        });
      } else if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: `Пользователь с указанным _id не найден` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};
