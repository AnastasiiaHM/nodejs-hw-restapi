const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { HttpErrors } = require("../helpers");
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpErrors(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    console.log(user);
    console.log(user.token);
    console.log(token);
    if (!user || !user.token || user.token != token) {
      next(HttpErrors(401));
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(HttpErrors(401));
  }
};
module.exports = authenticate;
