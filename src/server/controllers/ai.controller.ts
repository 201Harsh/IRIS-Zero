import { Request, Response } from "express";
import IrisAI from "../agent/iris-ai.js";

export const TalkwithIRIS = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
        data: {},
      });
    }

    const response = await IrisAI({ prompt });

    return res.json({
      success: true,
      message: "AI response",
      data: { response },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      data: {},
    });
  }
};
