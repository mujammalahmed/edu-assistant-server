const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/quiz/quizController");

router.get("/", quizController.getQuizs);
router.get("/:id", quizController.getQuiz);
// router.get("/recommendation/:slug", quizController.recommendationBlogs);
// router.get("/trending-blogs", quizController.trendingBlogs);
// router.post("/:blog_id/like", checkAuth, quizController.likeBlog);
// router.post("/:blog_id/unlike", checkAuth, quizController.unlikeBlog);
// router.get("/:slug", quizController.getBlog);
router.post("/", quizController.createQuiz);
router.post("/submit-quiz/:id", quizController.submitQuiz);

module.exports = router;
