import { Router } from "express";
import { TalkwithIRIS } from "../controllers/ai.controller.js";

const AIRouter = Router();

AIRouter.post("/talk", TalkwithIRIS);

export default AIRouter;
