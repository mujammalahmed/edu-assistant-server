const autheService = require("../../services/auth/authService");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  user_body = {
    username,
    email,
    password,
  };

  const { message, statusCode } = await autheService.signup(user_body);

  res.status(statusCode).json({
    message,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = {
    email,
    password,
  };

  const { message, token, statusCode } = await autheService.signin(user);

  // const cookieOptions = {
  //   expires: new Date(Date.now() + 60000 * 60 * 60),
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production" ? true : false,
  //   sameSite: "strict",
  // };

  // res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({
    token,
    message,
  });
};

module.exports = {
  signup,
  signin,
};
