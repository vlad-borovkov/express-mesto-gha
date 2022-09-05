const Card = require("../models/card");

const ERR = {
  IntServ: 500,
  NotFound: 404,
  BadRequest: 400,
};

const OK = {
  OK: 200,
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .populate("likes")
    .then((cards) => res.status(OK.OK).send({ data: cards }))
    .catch((err) => res.status(ERR.IntServ).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные при создании карточки`,
        });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const currentUser = req.user._id;

  //мэтч хозяина карточки и пльзователя в req.user._id
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(card);
      const cardOwner = card.owner._id;
      if (currentUser == cardOwner) {
        Card.findByIdAndRemove({ _id: req.params.cardId })
          .orFail(() => {
            const error = new Error();
            error.statusCode = ERR.NotFound;
            throw error;
          })
          .then((card) => res.status(OK.OK).send({ data: `Карточка удалена!` }))
          .catch((err) => {
            if (err.name === "CastError") {
              res.status(ERR.BadRequest).send({
                message: `Переданы некорректные данные для удаления карточки`,
              });
            } else if (err.statusCode === ERR.NotFound) {
              res
                .status(ERR.NotFound)
                .send({ message: `Карточка с указанным _id не найдена.` });
            } else {
              res
                .status(ERR.IntServ)
                .send({ message: `Ошибка на сервере ${err.message}` });
            }
          });
      } else
        res
          .status(401)
          .send({ message: "Возможно удаление только своих карточек" });
    })
    .catch((err) =>
      res
        .status(ERR.IntServ)
        .send({ message: `Ошибка на сервере ${err.message}` })
    );
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERR.NotFound;
      throw error;
    })
    .populate("likes")
    .then((likeOnCard) => res.status(OK.OK).send({ data: likeOnCard }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные для постановки/снятии лайка`,
        });
      } else if (err.statusCode === ERR.NotFound) {
        res
          .status(ERR.NotFound)
          .send({ message: `Передан несуществующий _id карточки` });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERR.NotFound;
      throw error;
    })
    .then((deleteLike) =>
      res.status(OK.OK).send({ data: `Лайк на карточке удалён` })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERR.BadRequest).send({
          message: `Переданы некорректные данные для постановки/снятии лайка`,
        });
      } else if (err.statusCode === ERR.NotFound) {
        res
          .status(ERR.NotFound)
          .send({ message: `Передан несуществующий _id карточки` });
      } else {
        res
          .status(ERR.IntServ)
          .send({ message: `Ошибка на сервере ${err.message}` });
      }
    });
};
