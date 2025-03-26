const { model, Schema } = require("mongoose");

const quizSchema = new Schema({
  topic: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
  duration: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Quiz = model("Quiz", quizSchema);

module.exports = Quiz;
