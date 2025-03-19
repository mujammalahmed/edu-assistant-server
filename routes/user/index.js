const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");
const checkAuth = require("../../middlewares/common/check-auth");

router.get("/", userController.getUsers);
router.get("/logged-in-user", userController.getLoggedInUser);
router.post("/logged-in-user-blogs", userController.gteLoggedinUserBlogs);
router.get("/top-contributors", userController.getTopContributors);
router.get("/:user_id", userController.getUser);

module.exports = router;
