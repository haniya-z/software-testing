const express = require("express");
const pkg = require("../package.json");

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

app.get("/api/version", (_req, res) => {
  res.json({ name: pkg.name, version: pkg.version });
});

app.post("/api/echo", (req, res) => {
  const { message } = req.body ?? {};
  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "message must be a non-empty string" });
  }
  return res.json({ message: message.trim() });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;
