const User = require("../../models/user");
const Blog = require("../../models/blog");
const { statusCodes } = require("../../config");

const getUsers = async () => {
  const users = await User.aggregate([
    {
      $project: {
        name: 1,
        username: 1,
        email: 1,
        user_image: 1,
        linkedin: 1,
        github: 1,
        instagram: 1,
        facebook: 1,
        designation: 1,
      },
    },
  ]);

  if (!users) {
    return {
      users,
      message: "Users Not Found",
      statusCode: 400,
    };
  }

  return {
    users,
    message: "Successfully Fetched",
    statusCode: statusCodes.SUCCESSFUL.SUCCESS,
  };
};

const getUser = async (user_id) => {
  const user = await User.findById(user_id).select("-password");

  if (!user) {
    return {
      message: "User Not Found",
      statusCode: 400,
    };
  }

  return {
    user,
    message: "Successfully Fetched",
    statusCode: statusCodes.SUCCESSFUL.SUCCESS,
  };
};

const getTopContributors = async () => {
  const topContributors = await User.aggregate([
    {
      $project: {
        name: 1,
        username: 1,
        email: 1,
        user_image: 1,
        linkedin: 1,
        github: 1,
        instagram: 1,
        facebook: 1,
        designation: 1,
        total_blogs: { $size: "$blogs" },
      },
    },
    { $sort: { total_blogs: -1 } },
    { $limit: 4 },
  ]);

  if (!topContributors) {
    return {
      message: "Top Contributors Not Found",
      statusCode: 400,
    };
  }

  return {
    topContributors,
    message: "Successfully Fetched",
    statusCode: statusCodes.SUCCESSFUL.SUCCESS,
  };
};

const gteLoggedinUserBlogs = async (user_id, page, page_size) => {
  const blogs = await Blog.find({ author: user_id })
    .populate("author", {
      name: 1,
      username: 1,
      user_image: 1,
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * page_size)
    .limit(page_size);

  const total_blogs = await Blog.countDocuments();
  const total_pages = Math.ceil(total_blogs / page_size);

  return {
    blogs,
    total_blogs,
    total_pages,
    message: "Blogs fetched",
    statusCode: statusCodes.SUCCESSFUL.SUCCESS,
  };
};

module.exports = {
  getTopContributors,
  gteLoggedinUserBlogs,
  getUsers,
  getUser,
};
