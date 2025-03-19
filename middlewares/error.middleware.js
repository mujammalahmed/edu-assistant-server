const { CustomError } = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ errors: error.serialize() });
    return;
  }

  //   if (process.env.NODE_ENV === "production") {
  //     res.status(500).json({ errors: [{ message: "Something went wrong" }] });
  //     return;
  //   }

  res.status(500).json({
    errors: [{ message: error.message, stack: error.stack }],
  });
};

module.exports = { errorHandler };
