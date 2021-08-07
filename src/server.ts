import express, { Request, Response } from "express";
import env from "dotenv";

env.config();

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Zoom clone Sever works!");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
