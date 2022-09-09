/* eslint-disable comma-dangle */
/* eslint-disable quotes */
// eslint-disable-next-line quotes
const router = require("express").Router();
// eslint-disable-next-line quotes
const { celebrate, Joi } = require("celebrate");

const {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/card");

// eslint-disable-next-line quotes
router.get("/", getAllCards);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
        ),
    }),
  }),
  createCard
);

router.delete(
  "/:cardId",
  celebrate({
    // валидируем параметры
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCardById
);

router.put(
  "/:cardId/likes",
  celebrate({
    // валидируем параметры
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  likeCard
);

router.delete(
  "/:cardId/likes",
  celebrate({
    // валидируем параметры
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
