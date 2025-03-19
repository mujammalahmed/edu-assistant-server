const { spawn } = require("child_process");
const Blog = require("../../models/blog");

const getScript = async (req, res) => {
  let scriptOutput = "";

  const blogs = await Blog.find();

  console.log(blogs[11], "asdasdsad");

  const htmlContent = `
<div><p>This is a <b>bold</b> paragraph with <a href="#">a link</a>.</p>
<p>Another <i>italic</i> text with <span style="color: red;">colored span</span>.</p></div>
`;

  const pythonProcess = spawn("python", [
    "D:/Projects/geek-bloggers/geek-bloggers-server/scripts/cleanBlog.py",
    blogs[11].blog_description,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Output from Python script: ${data}`);
    scriptOutput += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python script: ${data.toString()}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
    if (code === 0) {
      res.status(200).json({
        message: "Script executed",
        output: scriptOutput.trim(),
      });
    } else {
      res.status(500).json({ error: `Script exited with code ${code}` });
    }
  });
};

module.exports = {
  getScript,
};
