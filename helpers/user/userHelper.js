const User = require("../../models/user");
const { v4: uuidv4 } = require("uuid");
const e = require("express");

class userHelper {
  constructor() {}

  async createNewUser(username, email, hashedPassword) {
    try {
      let user = new User({
        username: username,
        email: email,
        isAccountActive: false,
        isEmailVerified: false,
        password: hashedPassword,
      });

      let ack = await user.save();
      return ack && ack._id;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async isUserAlreadyExists(email) {
    let response = await User.findOne({ email: email });
    return response != null;
  }

  async deleteUserByEmail(email) {
    await User.deleteOne({ email: email });
  }

  async verifyUser(userId) {
    const filter = { _id: userId };
    const update = { isAccountActive: true, isEmailVerified: true };
    await User.updateOne(filter, update);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email: email });
  }

  async getUserDetailsById(userId) {
    let user = await User.findOne({ _id: userId });
    if (!user) return null;
    return {
      Salutation: user.salutation,
      FirstName: user.firstName,
      LastName: user.lastName,
      Email: user.email,
      UserId: user._id,
      Roles: user.roles,
      loggedIn: true,
      PhoneNumber: user.phoneNumber,
      UserName: user.userName,
    };
  }
}

module.exports = userHelper;
