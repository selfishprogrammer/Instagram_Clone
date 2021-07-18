const mongoose = require("mongoose");
const DB =
    "mongodb+srv://insta:insta@cluster0.82rjk.mongodb.net/instagrram?retryWrites=true&w=majority";
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });