const express = require("express");
const router = express.Router();
const path = require("path");
const blogController = require("../../controllers/blog/blogController");

const multer = require("multer");
const checkAuth = require("../../middlewares/common/check-auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", blogController.getBlogs);
router.get("/recommendation/:slug", blogController.recommendationBlogs);
router.get("/trending-blogs", blogController.trendingBlogs);
router.post("/:blog_id/like", checkAuth, blogController.likeBlog);
router.post("/:blog_id/unlike", checkAuth, blogController.unlikeBlog);
router.get("/:slug", blogController.getBlog);
router.post("/", upload.single("featured_image"), blogController.addBlog);

router.post("/:blog_id/comment", blogController.addComment);

module.exports = router;
