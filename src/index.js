require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const webhookRouter = require("./routes/webhook");
const apiRouter = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => { req.rawBody = raw; next(); });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/webhook", webhookRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({ service: "ReplyMind API", status: "running" });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`ReplyMind running on port ${PORT}`);
});

module.exports = app;
