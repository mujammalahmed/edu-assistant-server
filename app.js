const express = require("express");
const router = require("./routes");
const { commonMiddleWare } = require("./middlewares/common.middleware");
const { errorHandler } = require("./middlewares/error.middleware");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

const Database = require("./databases");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(...commonMiddleWare);

router.registerApplicationRoutes(app);

app.use(errorHandler);

const genAI = new GoogleGenerativeAI("AIzaSyDkl1BzR9-C93e75-AWBf4zMKOHwvyEDxo");

app.post("/api/chat", async (req, res) => {
  try {
    // Check if messages exist in the request body
    if (!req.body || !req.body.messages) {
      return res.status(400).json({
        error: "Invalid request format. Expected { messages: [...] }",
        receivedBody: req.body,
      });
    }

    const { messages } = req.body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages must be a non-empty array",
        receivedMessages: messages,
      });
    }

    // Format the conversation history for Gemini
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create a chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Send the last message and get the response
    const result = await chat.sendMessage(
      messages[messages.length - 1].content
    );
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    res.status(500).json({
      error: "Failed to process your request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Your other middleware and routes go here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  Database.connect();
});
