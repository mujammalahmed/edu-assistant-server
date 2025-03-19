const Blog = require("../../models/blog");
const User = require("../../models/user");
const Comment = require("../../models/blog/comments");
const axios = require("axios");
const { convert } = require("html-to-text");

const getBlog = async (fetchedBy, value) => {
  const blog = await Blog.findOneAndUpdate(
    { [fetchedBy]: value },
    { $inc: { total_views: 1 } }
  )
    .populate("author", { name: 1, user_image: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "commenter",
        select: "name user_image",
      },
      options: {
        sort: { createdAt: -1 },
      },
    });

  if (!blog) {
    return {
      message: "Blog not found",
      blog: null,
      statusCode: 404,
    };
  }

  return {
    message: "Blog successfully Fetched",
    blog,
    statusCode: 200,
  };
};

const extractTextFromHtml = (html) => {
  return convert(html, {
    wordwrap: false, // Prevents text from being wrapped
    selectors: [
      { selector: "a", format: "inline" }, // Keeps anchor text but removes links
      { selector: "img", format: "skip" }, // Skips images
    ],
  });
};

const recommendationBlogs = async (slug) => {
  try {
    const blog = await Blog.findOne({ blog_slug: slug });

    if (!blog) {
      return {
        message: "Blog not found",
        blog: null,
        statusCode: 404,
      };
    }

    const text = extractTextFromHtml(blog.blog_description);

    const requestData = {
      blog_slug: blog.blog_slug,
      blog_title: blog.blog_title,
      blog_description: text,
    };

    // Sending blog data to FastAPI server
    const fastApiResponse = await axios.post(
      "http://localhost:6000/script/recommendation",
      requestData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return {
      message: "Blog successfully processed",
      recommendations: fastApiResponse.data, // FastAPI response
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error calling FastAPI:", error.message);
    return {
      message: "Failed to fetch recommendations",
      error: error.message,
      statusCode: 500,
    };
  }
};

const getBlogs = async (query_blog_title, page, page_size) => {
  let obj = {};
  if (query_blog_title) {
    obj = {
      blog_title: {
        $regex: ".*" + query_blog_title + ".*",
        $options: "i",
      },
    };
  }

  const blogs = await Blog.find(obj)
    .populate("author", {
      name: 1,
      username: 1,
      user_image: 1,
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * page_size)
    .limit(page_size);

  const searched_blogs = await Blog.find(obj);

  const totalBlogs = query_blog_title
    ? searched_blogs.length
    : await Blog.countDocuments();
  const totalPages = Math.ceil(totalBlogs / (page_size || 6));

  return {
    message: "Successfully Fetched",
    blogs,
    statusCode: 200,
    totalBlogs,
    totalPages,
  };
};

const addBlog = async (blog_data) => {
  const {
    blog_title,
    author,
    total_views,
    blog_likes,
    blog_description,
    featured_image,
    category,
  } = blog_data;

  const new_blog_data = {
    blog_title,
    author,
    total_views,
    blog_likes,
    blog_description,
    featured_image,
    category,
  };

  const blog = new Blog({
    ...new_blog_data,
  });

  await blog.save();

  // Update the user's blogs field
  const user = await User.findOneAndUpdate(
    { _id: author },
    { $push: { blogs: blog._id } },
    { new: true }
  );

  if (!user) {
    return {
      message: "User not found",
      statusCode: 404,
    };
  }

  return {
    message: "Blog created successfully",
    statusCode: 200,
  };
};

const trendingBlogs = async () => {
  const trending_blogs = await Blog.find()
    .sort({ total_views: -1 })
    .limit(5)
    .populate("author", "_id username name user_image");

  return {
    message: "Successfully trending Fetched",
    trending_blogs,
    statusCode: 200,
  };
};

const likeBlog = async (blog_id, user_id) => {
  let blog = await Blog.findById(blog_id);

  if (!blog) {
    return {
      message: "Blog not found",
      blog: null,
      statusCode: 400,
    };
  }

  const already_liked = blog.like_users.some(
    (like) => like.user.toString() === user_id
  );

  if (already_liked) {
    return {
      message: "You have already liked this blog",
      statusCode: 201,
    };
  }

  const liked_user = { user: user_id, isLike: true };

  const updatedBlog = await Blog.findByIdAndUpdate(
    blog_id,
    {
      $inc: { blog_likes: 1 },
      $push: { like_users: liked_user },
    },
    { new: true }
  )
    .populate("author", { name: 1, user_image: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "commenter",
        select: "name user_image",
      },
      options: {
        sort: { createdAt: -1 },
      },
    });

  return {
    message: "Blog liked",
    blog: updatedBlog,
    statusCode: 200,
  };
};

const unlikeBlog = async (blog_id, user_id) => {
  let blog = await Blog.findById(blog_id);

  if (!blog) {
    return {
      message: "Blog not found",
      statusCode: 400,
    };
  }

  const already_unliked = blog.like_users.findIndex(
    (like) => like.user.toString() === user_id
  );

  if (already_unliked === -1) {
    return {
      message: "You have already unliked this blog",
      statusCode: 201,
    };
  }

  const liked_user = { user: user_id, isLike: true };

  const updatedBlog = await Blog.findByIdAndUpdate(
    blog_id,
    {
      $inc: { blog_likes: -1 },
      $pull: { like_users: liked_user },
    },
    { new: true }
  )
    .populate("author", { name: 1, user_image: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "commenter",
        select: "name user_image",
      },
      options: {
        sort: { createdAt: -1 },
      },
    });

  return {
    message: "Blog unliked",
    blog: updatedBlog,
    statusCode: 200,
  };
};

const addComment = async (user_id, blog_id, comment_body) => {
  let blog = await Blog.findById(blog_id);

  if (!blog) {
    return {
      message: "Blog not found",
      statusCode: 400,
    };
  }

  const newComment = new Comment({
    commenter: user_id,
    comment_body: comment_body,
  });

  await newComment.save();

  let updatedBlog = await Blog.findByIdAndUpdate(
    blog_id,
    {
      $push: { comments: newComment._id },
    },
    {
      new: true,
    }
  )
    .populate("author", { name: 1, user_image: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "commenter",
        select: "name user_image",
      },
      options: {
        sort: { createdAt: -1 },
      },
    })
    .exec();

  return {
    message: "Comment added",
    blog: updatedBlog,
    statusCode: 200,
  };
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
