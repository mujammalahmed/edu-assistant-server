const userHelper = require("../../helpers/user/userHelper");
const utils = require("../../utils");
const verification = require("../../verification");
const VerificationService = verification.Services.VerificationService;
const tokenHelper = require("../../helpers/user/token-service");
const User = require("../../models/user");
const config = require("../../config/index.js");
const mailService = require("../../helpers/mailer/mailer");

const signup = async (userBody) => {
  const { username, email, password } = userBody;

  if (username && email && password) {
    //haspassword

    let hashedPassword;
    try {
      hashedPassword = await utils.encryption.hashPassword(password);
    } catch (error) {
      return {
        message: "Password hashing failed",
        statusCode: 500,
      };
    }

    const userService = new userHelper();
    //check if the user exists or not

    let exists = await userService.isUserAlreadyExists(email);
    if (exists) {
      return {
        message: `User already exists with the email address${email}`,
        statusCode: 401,
      };
    } else {
      //create the user
      let createdUserId;

      try {
        createdUserId = await userService.createNewUser(
          username,
          email,
          hashedPassword
        );
      } catch (error) {
        return {
          message: "User creation failed",
          statusCode: 500,
        };
      }

      //check whether the user is created or ot
      if (createdUserId) {
        //create token for the user

        const verificationService = new VerificationService();
        const token = await verificationService.generateVerificationToken(
          createdUserId
        );

        try {
          const subject = "Registration Successful";
          const body = `<p>Hi ${username}</p>
                                  <br>Welcome abord! Your user creation our application is successful<br>
                                  <a href="http://localhost:5173/${token}">Verify Email</a><br>
                                  <br>Cheers<br>`;

          await mailService.sendMail(email, subject, body);
        } catch (e) {
          response.message = "user creation failed, mail server issue";
          response.Success = false;
          await userService.deleteUserByEmail(email);
        }

        return {
          message: "Use created successfully, Please verify your email",
          statusCode: 200,
        };
      } else {
        return {
          message: "User creation failed",
          statusCode: 400,
        };
      }
    }
  } else {
    return {
      message: "Missing required field",
      statusCode: 400,
    };
  }
};

const signin = async (user) => {
  const { email, password } = user;

  if (!email || !password) {
    return {
      message: "Email and Password is required",
      statusCode: config.statusCodes.CLIENT_ERROR.UNAUTHORIZED,
    };
  }

  const existing_user = await User.findOne({ email }).lean();

  if (!existing_user) {
    return {
      message: "User not found",
      statusCode: config.statusCodes.CLIENT_ERROR.UNAUTHORIZED,
    };
  }

  const tokenService = new tokenHelper();

  let passwordMatched = await utils.encryption.comparePassword(
    password,
    existing_user.password
  );

  if (!passwordMatched) {
    return {
      message: "Password did not match, please check again",
      statusCode: config.statusCodes.CLIENT_ERROR.UNAUTHORIZED,
    };
  }

  let token = tokenService.getLoggedInUserToken(existing_user);

  if (!token) {
    return {
      message: "Token generation failed while login",
      statusCode: config.statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    };
  }

  return {
    message: "Welcome Back",
    token: token,
    statusCode: config.statusCodes.SUCCESSFUL.SUCCESS,
  };
};

module.exports = {
  signup,
  signin,
};
