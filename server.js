const express = require("express");
const MT19937 = require("./mt19937");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const LOGIN_KEY = "VIP*111";
let history = [];

function getSeed() {
  const now = new Date();
  return Number(
    `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}`
  );
}

function getPeriod() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const minutes = now.getHours() * 60 + now.getMinutes() + 1;
  return `${y}${m}${d}100010${String(minutes).padStart(3, "0")}`;
}

function bigSmall(n) {
  return n >= 5 ? "Big" : "Small";
}

function color(n) {
  if (n === 0) return ["Red", "Violet"];
  if (n === 5) return ["Green", "Violet"];
  return n % 2 === 0 ? ["Red"] : ["Green"];
}

app.post("/login", (req, res) => {
  if (req.body.key === LOGIN_KEY) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

app.get("/result", (req, res) => {
  const mt = new MT19937(getSeed());
  const number = mt.extractNumber() % 10;

  const data = {
    period: getPeriod(),
    number,
    bigSmall: bigSmall(number),
    color: color(number),
    time: new Date().toISOString()
  };

  history.unshift(data);
  if (history.length > 50) history.pop();

  res.json({
    current: data,
    history
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});