import express from "express";
import ViteExpress from "vite-express";
import AIRouter from "./router/ai.route.js";

const app = express();
const port = Number(process.env.PORT) || 4894;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ai", AIRouter);

ViteExpress.listen(app, port, () => {
  console.clear();
  console.log(`Server is running on http://localhost:${port}`);
});
