const bcrypt = require("bcrypt");

const hashPassword = async (plainPassword) => {
  let salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
  return await bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash);
};

module.exports = {
  hashPassword: hashPassword,
  comparePassword: comparePassword,
};
