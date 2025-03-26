const quizService = require("../../services/quiz/quizService");
const { ApiError } = require("../../utils/apiError");
const { asyncHandler } = require("../../utils/asyncHandler ");
const { ApiResponse } = require("../../utils/apiResponse");

const getQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError("There so no quiz", 400);
  }

  const { message, quiz, statusCode } = await quizService.getQuiz(id);

  new ApiResponse(res, statusCode, message, quiz);
});

const getQuizs = async (req, res) => {
  const query_quiz_title = req.query.quiz_title;
  const page = parseInt(req.query.page) || 0;
  const page_size = parseInt(req.query.pageSize) || 0;

  const { message, quizzes, statusCode, totalQuizzes, totalPages } =
    await quizService.getQuizs(query_quiz_title, page, page_size);

  new ApiResponse(res, statusCode, message, {
    quizzes,
    totalQuizzes,
    totalPages,
    currentPage: page || 1,
  });
};

const createQuiz = async (req, res) => {
  const { topic, questions, duration } = req.body;

  const { message, statusCode } = await quizService.createQuiz(req.body);

  res.status(statusCode).json({
    message,
  });
};

const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const { id } = req.params;

  if (!id || !Array.isArray(answers)) {
    return res.status(400).json({
      message: "Invalid input. Quiz ID and answers array are required.",
    });
  }

  const { message, statusCode, correctAnswersCount } =
    await quizService.submitQuiz(id, answers);

  res.status(statusCode).json({
    message,
    correctAnswersCount,
  });
};

module.exports = { createQuiz, getQuizs, getQuiz, submitQuiz };
