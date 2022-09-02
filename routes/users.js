const router = require("express").Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/:userId", getUserById);

router.patch("/me", updateUser); // обновляет профиль
router.patch("/me/avatar", updateUserAvatar); // обновляет аватар

module.exports = router;
