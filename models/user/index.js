const { model, Schema, mongoose } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // prettier-ignore
    // eslint-disable-next-line security/detect-unsafe-regex
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  mobile: {
    type: String,
    required: false,
  },
  user_image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  designation: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  isAccountActive: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = model("User", userSchema);
