/* eslint-disable quotes */
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauth-error");

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть иои начинается с Bearer
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Необходима авторизация"));
  } else {
    // верефицируем токен
    const token = authorization.replace("Bearer ", "");
    let payload;

    payload = jwt.verify(token, "some-secret-key");

    req.user = payload; // записываем пейлоуд в объект запроса
  }
  next(); // пропускаем запрос дальше
};
