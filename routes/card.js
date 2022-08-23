const router = require("express").Router();
const {
  getAllCards,
  createCard,
  deleteCardById,
} = require("../controllers/card");

router.get("/", getAllCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCardById);

module.exports = router;
