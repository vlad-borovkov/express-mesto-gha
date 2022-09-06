const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    required: false,
    validate: {
      validator: (url) => validator.isURL(url),
      message: "There is not your email",
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: "There is not your email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // необходимо добавить поле select,Так по умолчанию хеш пароля пользователя не будет возвращаться из базы
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model(
  "user",
  userSchema.index({ email: 1 }, { unique: true })
);
