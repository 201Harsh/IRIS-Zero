import express from "express";
import ViteExpress from "vite-express";

const app = express();
const port = Number(process.env.PORT) || 4894;

ViteExpress.listen(app, port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);