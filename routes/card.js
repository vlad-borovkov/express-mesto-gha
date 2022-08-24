const router = require("express").Router();
const {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/card");

router.get("/", getAllCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCardById);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
