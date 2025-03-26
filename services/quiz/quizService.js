const Quiz = require("../../models/quiz");
const User = require("../../models/user");

const getQuiz = async (id) => {
  const quiz = await Quiz.findById(id)
    .populate("author", "name")
    .select("-questions.correctAnswer");

  if (!quiz) {
    return {
      message: "Quiz not found",
      quiz: null,
      statusCode: 404,
    };
  }

  return {
    message: "Quiz successfully fetched",
    quiz,
    statusCode: 200,
  };
};

const getQuizs = async (query_quiz_title, page, page_size) => {
  let obj = {};
  if (query_quiz_title) {
    obj = {
      topic: {
        $regex: ".*" + query_quiz_title + ".*",
        $options: "i",
      },
    };
  }

  const quizzes = await Quiz.find(obj)
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * page_size)
    .limit(page_size);

  const searched_quizzes = await Quiz.find(obj);

  const totalQuizzes = query_quiz_title
    ? searched_quizzes.length
    : await Quiz.countDocuments();
  const totalPages = Math.ceil(totalQuizzes / (page_size || 6));

  return {
    message: "Successfully Fetched",
    quizzes,
    statusCode: 200,
    totalQuizzes,
    totalPages,
  };
};

const createQuiz = async (quiz_data) => {
  const quiz = new Quiz({
    ...quiz_data,
    author: quiz_data.author_name,
  });

  await quiz.save();

  const user = await User.findOneAndUpdate(
    { _id: quiz_data.author_name },
    { $push: { quizzes: quiz._id } },
    { new: true }
  );

  if (!user) {
    return {
      message: "User not found",
      statusCode: 404,
    };
  }

  return {
    message: "Quiz created successfully",
    statusCode: 200,
  };
};

const submitQuiz = async (quizId, answers) => {
  const quiz = await Quiz.findById(quizId).select("questions");

  if (!quiz) {
    return { message: "Quiz not found", statusCode: 404 };
  }

  let correctAnswersCount = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswersCount++;
    }
  });

  return {
    message: "Quiz submitted successfully",
    correctAnswersCount,
    statusCode: 200,
  };
};

module.exports = { createQuiz, getQuizs, getQuiz, submitQuiz };
