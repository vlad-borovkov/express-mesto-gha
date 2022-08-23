const router = require("express").Router();
const {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
} = require("../controllers/card");

router.get("/", getAllCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCardById);
router.put("/:cardId/likes", likeCard);

module.exports = router;
