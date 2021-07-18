const jwt = require("jsonwebtoken");
const { SKEY } = require("../secretkeys");
const mongooose = require("mongoose");
const User = mongooose.model("USER");
const Authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.json({ ErrorMessage: "Please Login First" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, SKEY, (err, payload) => {
    if (err) {
      res.json({ ErrorMessage: "Login Required" });
    }

    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;

      next();
    });
  });
};

module.exports = Authenticate;
