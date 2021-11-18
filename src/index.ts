import express from "express";
import path from "path";

const app = express();
const port = 3000;

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "pug");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Zoom Clone!" });
});

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
