const Verification = require("../../models/verification");
const { v4: uuidv4 } = require("uuid");
const utils = require("../../utils");

class VerificationService {
  constructor() {}

  async generateVerificationToken(userId) {
    let verification = new Verification({
      _id: uuidv4(),
      UserId: userId,
      VerificationToken: utils.randomString(42),
      IsExpired: false,
    });
    let ack = await verification.save();
    return ack && ack.VerificationToken;
  }

  async validateAndUpdateToken(token) {
    let verification = await Verification.findOne({
      VerificationToken: token,
      IsExpired: false,
    });
    if (!verification) {
      return null;
    } else {
      let userId = verification.UserId;

      await Verification.updateOne(
        { VerificationToken: token },
        { IsExpired: true }
      );

      return userId;
    }
  }
}

module.exports = VerificationService;
