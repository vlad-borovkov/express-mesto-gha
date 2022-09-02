const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isemail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак Ив Кусто",
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
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "There is not your email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
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
