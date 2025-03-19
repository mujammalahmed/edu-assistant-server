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
      process.env.JWT_SECRET_TOKEN //secret key
    );

    const currenthUser = await User.findById(tokenObj?._id);

    if (!currenthUser) {
      return res.status(402).json({
        message: "User does not exist.",
      });
    }

    next();
  } catch (err) {
    next(
      res.status(500).json({
        err,
        message: "Authentication Failed",
      })
    );
  }
};
