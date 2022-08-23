const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.use((req, res, next) => {
  req.user = {
    _id: "63048c9b8976910f72ec0b6d", //хардкодим аутентификацию
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/card"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
