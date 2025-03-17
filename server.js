const express = require("express");
const path = require("path");
const mineflayer = require("mineflayer");

const app = express();
const port = 3000;

let bot;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.hbs"));
});

app.post("/start-bot", (req, res) => {
  const { username, password } = req.body;

  if (bot) bot.end(); // Jeśli bot już istnieje, rozłącz go

  bot = mineflayer.createBot({
    host: "CraftMC.PL",
    port: 25565,
    username,
    auth: "offline",
    version: "1.20.4",
  });

  bot.on("spawn", () => {
    console.log(`✅ Bot ${username} połączony!`);
    setTimeout(() => bot.chat(`/login ${password}`), 2000);
  });

  bot.on("message", (message) => console.log(`[CHAT] ${message.toAnsi()}`));

  bot.on("end", () => console.log("⚠️ Bot rozłączony"));

  bot.on("error", (err) => console.log(`❌ Błąd: ${err}`));

  res.send(`<h2>Bot ${username} został uruchomiony!</h2><a href="/">Wróć</a>`);
});

app.listen(port, () => {
  console.log(`🚀 Serwer działa na http://localhost:${port}`);
});
