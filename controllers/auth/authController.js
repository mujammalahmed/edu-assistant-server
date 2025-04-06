const autheService = require("../../services/auth/authService");
const { ApiError } = require("../../utils/apiError");

const signup = async (req, res) => {
  const { role, email, password } = req.body;

  user_body = {
    role,
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

const emailVerification = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ApiError("Please provide email and code", 400);
  }

  const { message, statusCode } = await autheService.emailVerification(
    email,
    code
  );

  res.status(statusCode).json({
    message,
  });
};

module.exports = {
  signup,
  signin,
  emailVerification,
};
