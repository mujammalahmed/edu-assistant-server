const userService = require("../../services/user/userService");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const { users, message, statusCode } = await userService.getUsers();

  res.status(statusCode).json({
    message,
    users,
  });
};

const getUser = async (req, res) => {
  const user_id = req.params.user_id;

  const { user, message, statusCode } = await userService.getUser(user_id);

  res.status(statusCode).json({
    message,
    user,
  });
};

const getTopContributors = async (req, res) => {
  const { topContributors, message, statusCode } =
    await userService.getTopContributors();

  res.status(statusCode).json({
    message,
    topContributors,
  });
};

const getLoggedInUser = async (req, res) => {
  if (req.cookies.token === undefined || req.cookies.token === null) {
    return res.status(400).json({
      message: "No Token Found",
      user: null,
    });
  }

  const auth = jwt.verify(req.cookies.token, process.env.JWT_SECRET_TOKEN);

  const { user, message, statusCode } = await userService.getUser(auth?._id);

  res.status(statusCode).json({
    message,
    user,
  });
};

const gteLoggedinUserBlogs = async (req, res) => {
  const { user_id, page, page_size } = req.body;

  const { blogs, total_blogs, total_pages, message, statusCode } =
    await userService.gteLoggedinUserBlogs(user_id, page, page_size);

  res.status(statusCode).json({
    message,
    blogs,
    total_blogs,
    total_pages,
  });
};

module.exports = {
  gteLoggedinUserBlogs,
  getTopContributors,
  getLoggedInUser,
  getUsers,
  getUser,
};
