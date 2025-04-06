const blogService = require("../../services/blog/blogService");
const blogDataValidation = require("../../validation/blog");
const PhotoService = require("../../helpers/image/image-service");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../../utils/apiError");
const { asyncHandler } = require("../../utils/asyncHandler ");
const { ApiResponse } = require("../../utils/apiResponse");

const getBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const fetchedBy = "blog_slug";
  const { message, blog, statusCode } = await blogService.getBlog(
    fetchedBy,
    slug
  );

  new ApiResponse(res, statusCode, message, blog);
});

const recommendationBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError("Please give slug", 400);
  }

  const { message, blog, statusCode } = await blogService.recommendationBlogs(
    slug
  );

  new ApiResponse(res, statusCode, message, blog);
});

const getBlogs = async (req, res) => {
  const query_blog_title = req.query.blog_title;
  const page = parseInt(req.query.page) || 0;
  const page_size = parseInt(req.query.pageSize) || 0;

  const { message, blogs, statusCode, totalBlogs, totalPages } =
    await blogService.getBlogs(query_blog_title, page, page_size);

  new ApiResponse(res, statusCode, message, {
    blogs,
    totalBlogs,
    totalPages,
    currentPage: page || 1,
  });
};

const addBlog = async (req, res) => {
  const { blog_title, author, blog_description, category } = req.body;

  //blog validation
  // const { error: blogDataError } = blogDataValidation.blogSchema.validate({
  //   blog_title,
  //   blog_description,
  // });
  // if (
  //   blogDataError &&
  //   blogDataError.details &&
  //   blogDataError.details.length > 0
  // ) {
  //   return res.status(400).json({ error: "Validation Failed" });
  // }

  const photoService = new PhotoService(req.file);
  let profilePhotoLink;

  await photoService
    .upload()
    .then((link) => {
      profilePhotoLink = link;
    })
    .catch((error) => {
      console.error("Error uploading photo:", error);
    });

  const blog_data = {
    blog_title,
    author,
    total_views: 0,
    blog_likes: 0,
    blog_description,
    category,
    featured_image: profilePhotoLink,
  };

  const { message, statusCode } = await blogService.addBlog(blog_data);

  res.status(statusCode).json({
    message,
  });
};

const trendingBlogs = async (req, res) => {
  const { message, trending_blogs, statusCode } =
    await blogService.trendingBlogs();

  res.status(statusCode).json({
    message,
    trending_blogs,
  });
};

const likeBlog = async (req, res) => {
  const { user_id, blog_id } = req.body;

  if (!user_id) {
    res.status(400).json({
      message: "User not found",
    });
  }

  const { message, blog, statusCode } = await blogService.likeBlog(
    blog_id,
    user_id
  );

  res.status(statusCode).json({
    message,
    blog,
  });
};

const unlikeBlog = async (req, res) => {
  const { user_id, blog_id } = req.body;

  if (!user_id) {
    res.status(400).json({
      message: "User not found",
    });
  }

  const { message, blog, statusCode } = await blogService.unlikeBlog(
    blog_id,
    user_id
  );

  res.status(statusCode).json({
    message,
    blog,
  });
};

const addComment = async (req, res) => {
  const { user_id, blog_id, comment_body } = req.body;

  if (!comment_body) {
    res.status(400).json({
      message: "Please enter the comment",
    });
  }

  const { message, blog, statusCode } = await blogService.addComment(
    user_id,
    blog_id,
    comment_body
  );

  res.status(statusCode).json({
    message,
    blog,
  });
};

module.exports = {
  getBlog,
  getBlogs,
  addBlog,
  likeBlog,
  unlikeBlog,
  addComment,
  trendingBlogs,
  recommendationBlogs,
};
