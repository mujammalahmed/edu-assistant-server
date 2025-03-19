const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../../models//user");

module.exports = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(500).json({
        message: "You are not logged in! Please login to process!",
      });
    }

    const tokenObj = await promisify(jwt.verify)(
      token,
      "asdsadasdasdasd21321asd"
    );

    const freshUser = await User.findOne({ email: tokenObj?.email });

    if (!freshUser) {
      return res.status(402).json({
        message: "User does not exist.",
      });
    }

    const userRole = freshUser.roles;

    if (userRole.includes("admin")) {
      next();
    } else {
      return res.status(402).json({
        message: "You are not permitted",
      });
    }
  } catch (err) {
    next(
      res.status(500).json({
        err,
        message: "Authentication Failed",
      })
    );
  }
};
