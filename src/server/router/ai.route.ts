import { Router } from "express";
import IrisAI from "../agent/iris-ai.js";

const AIRouter = Router();

AIRouter.post("/ask", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ response: "Please provide a prompt." });
  }
  const response = await IrisAI({ prompt });

  return res.json({
    success: true,
    message: "Response from IrisAI",
    data: {
      response,
    },
  });
});

export default AIRouter;
