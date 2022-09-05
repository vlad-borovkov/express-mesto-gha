const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //достаём авторизационный заголовок
  const { authorization } = req.headers;

  //убеждаемся, что он есть иои начинается с Bearer

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  //верефицируем токен
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    console.log(token);
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
