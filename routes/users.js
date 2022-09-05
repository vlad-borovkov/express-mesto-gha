const router = require("express").Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.get("/me", getCurrentUser); //возвращает инфо о текущем пользователе при получении токена
router.get("/", getAllUsers);
router.get("/:userId", getUserById);

router.patch("/me", updateUser); // обновляет профиль
router.patch("/me/avatar", updateUserAvatar); // обновляет аватар

module.exports = router;
