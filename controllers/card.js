const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthError = require("../errors/unauth-error");
const ForbiddenError = require("../errors/forbidden-error");
const card = require("../models/card");

const ERR = {
  IntServ: 500,
  NotFound: 404,
  BadRequest: 400,
};

const OK = {
  OK: 200,
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate("owner")
    .populate("likes")
    .then((cards) => {
      if (!cards) {
        throw new BadRequestError("Некорректный запрос");
      }
      res.status(OK.OK).send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((cards) => {
      if (!cards) {
        throw new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        );
      }

      res.send({ data: cards });
    })

    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const currentUser = req.user._id;

  //удаляет только сам user:мэтч хозяина карточки и пльзователя в req.user._id
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет карточки с таким id");
      } else {
        const cardOwner = card.owner._id;

        if (currentUser == cardOwner) {
          Card.findByIdAndRemove({ _id: req.params.cardId })
            .then((card) => {
              if (!card) {
                throw new BadRequestError(
                  "Переданы некорректные данные при удалении карточки"
                );
              } else res.status(OK.OK).send({ data: `Карточка удалена!` });
            })
            .catch(next);
        } else
          throw new ForbiddenError("Возможно удаление только своих карточек");
      }
    })
    .catch(next);
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
