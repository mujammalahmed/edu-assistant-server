const express = require("express");
const router = require("./routes");
const { commonMiddleWare } = require("./middlewares/common.middleware");
const { errorHandler } = require("./middlewares/error.middleware");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

const Database = require("./databases");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(...commonMiddleWare);

router.registerApplicationRoutes(app);

app.use(errorHandler);

// Your other middleware and routes go here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  Database.connect();
});
