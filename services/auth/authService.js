const userHelper = require("../../helpers/user/userHelper");
const utils = require("../../utils");
const verification = require("../../verification");
const VerificationService = verification.Services.VerificationService;
const tokenHelper = require("../../helpers/user/token-service");
const User = require("../../models/user");
const config = require("../../config/index.js");
const mailService = require("../../helpers/mailer/mailer");
const bcrypt = require("bcrypt");

const signup = async (userBody) => {
  const { role, email, password } = userBody;

  if (role && email && password) {
    // Hash password
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

    // Check if the user exists
    let exists = await userService.isUserAlreadyExists(email);
    if (exists) {
      return {
        message: `User already exists with the email address ${email}`,
        statusCode: 401,
      };
    }

    // Create user
    let createdUserId;
    try {
      createdUserId = await userService.createNewUser(
        role,
        email,
        hashedPassword
      );
    } catch (error) {
      return {
        message: "User ID creation failed, Please Try Again",
        statusCode: 500,
      };
    }

    // Check if user is created
    if (createdUserId) {
      // Generate verification token
      const verificationService = new VerificationService();
      const token = await verificationService.generateVerificationToken(
        createdUserId
      );

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      let hashedVerificationCode;
      try {
        hashedVerificationCode = await bcrypt.hash(verificationCode, 10);
      } catch (error) {
        return {
          message: "Error hashing verification code",
          statusCode: 500,
        };
      }

      const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

      try {
        const subject = "Registration Successful";

        // Email body with verification code
        const body = `<p>Hi ${role},</p>
                      <br>Welcome aboard! Your user creation in our application is successful.<br>
                      <p>Your verification code is: <strong>${verificationCode}</strong></p>
                      <p>This code is valid for 10 minutes.</p>
                      <br>Cheers,<br>`;

        // Send email
        await mailService.sendMail(email, subject, body);

        // Update user with verification code
        await User.findOneAndUpdate(
          { email },
          {
            verificationCode: hashedVerificationCode,
            verificationCodeExpires: expiryTime,
          },
          { new: true }
        );

        return {
          message:
            "User created successfully. Check your email for the verification code.",
          statusCode: 200,
        };
      } catch (e) {
        await userService.deleteUserByEmail(email);
        return {
          message: "User creation failed due to mail server issue",
          statusCode: 500,
        };
      }
    } else {
      return {
        message: "User creation failed",
        statusCode: 400,
      };
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
  if (!existing_user.isAccountActive || !existing_user.isEmailVerified) {
    return {
      message: "User not active, please verify",
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

const emailVerification = async (email, code) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        message: "User not found",
        statusCode: 400,
      };
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return {
        message: "No verification code found",
        statusCode: 400,
      };
    }

    // Check if verification code is expired
    if (new Date() > user.verificationCodeExpires) {
      return {
        message: "Verification code expired",
        statusCode: 400,
      };
    }

    // Compare user input with the hashed verification code
    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) {
      return {
        message: "Invalid verification code",
        statusCode: 400,
      };
    }

    // Update user status
    user.isEmailVerified = true;
    user.isAccountActive = true;
    user.verificationCode = undefined; // Clear verification code after successful verification
    user.verificationCodeExpires = undefined;

    await user.save();

    return {
      message: "Account verified successfully!",
      statusCode: 200,
    };
  } catch (error) {
    return {
      message: "Server error, try again",
      statusCode: 500,
    };
  }
};
module.exports = {
  signup,
  signin,
  emailVerification,
};
