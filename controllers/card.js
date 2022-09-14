/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");

const OK = {
  OK: 200,
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate("owner")
    .populate("likes")
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((cards) => cards.populate("owner"))
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Карточка с указанным _id не найдена"));
      } else if (card.owner.toString() === req.user._id) {
        Card.deleteOne({ _id: card._id }).then(
          res.status(200).send({ message: "Карточка удалена" })
        );
      } else {
        next(
          new ForbiddenError("Запрещено удалять карточки чужих пользователей")
        );
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан невалидный id"));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Передан несуществующий _id карточки");
    })
    .populate("likes")
    .populate("owner")
    .then((likeOnCard) => res.status(OK.OK).send({ likes: likeOnCard }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Передан несуществующий _id карточки");
    })
    .populate("likes")
    .populate("owner")
    .then((deleteLike) => res.status(OK.OK).send({ likes: deleteLike }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};
