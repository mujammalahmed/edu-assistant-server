// middlewares/common.middleware.js
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const commonMiddleWare = [
  express.json({ limit: "2mb" }),
  express.urlencoded({ extended: true }),
  cookieParser(),
  cors({
    origin: "http://localhost:5173",
    methods: ["HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "x-now-id",
      "x-now-trace",
      "x-powered-by",
      "Origin",
      "Accept",
      "Content-Type",
      "Set-Cookie",
      "Authorization",
    ],
  }),
];

module.exports = { commonMiddleWare };
