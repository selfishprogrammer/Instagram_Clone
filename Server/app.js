const express = require("express");
const port = (process.env.PORT = 8000);
const app = express();
require("./db/db");
const User = require("./model/UserShema");
const Posts = require("./model/InstaPostShema");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/posts"));

app.listen(port, () => {
    console.log(`Server Started at ${port}`);
});