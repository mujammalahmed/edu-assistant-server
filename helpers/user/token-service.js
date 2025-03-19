const jwt = require("jsonwebtoken");

class TokenService {
  constructor() {}

  getPayLoadFromUser(user) {
    return {
      _id: user._id,
    };
  }

  getLoggedInUserToken(user) {
    let payload = this.getPayLoadFromUser(user);

    if (!process.env.JWT_SECRET_TOKEN) {
      return null;
    }

    return jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      audience: "*",
      algorithm: "HS256",
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_TOKEN, {
        audience: "*",
        algorithm: "HS256",
      });
    } catch (e) {
      console.error("Token verification failed:", e.message);
      return null;
    }
  }
}

module.exports = TokenService;
