const express = require("express");
const router = express.Router();
const recomendationService = require("../../services/blog/recomendationService");

router.get("/", recomendationService.getScript);

module.exports = router;
