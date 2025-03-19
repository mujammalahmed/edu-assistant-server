const encryption = require("./encryption");
const randomString = require("./random");

module.exports = {
  encryption: {
    hashPassword: encryption.hashPassword,
    comparePassword: encryption.comparePassword,
  },
  randomString: randomString,
};
