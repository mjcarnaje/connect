import express, { Response } from "express";
import env from "dotenv";

env.config();

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res: Response) => res.render("home"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
