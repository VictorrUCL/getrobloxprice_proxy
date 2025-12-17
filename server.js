import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const ROLIMONS_URL = "https://www.rolimons.com/itemapi/itemdetails";

let cache = null;
let lastFetch = 0;
const CACHE_TIME = 1000 * 60 * 10; // 10 min

app.get("/", (req, res) => {
  res.send("@2025 Ghost.tech");
});

app.get("/rolimons/item/:assetId", async (req, res) => {
  const { assetId } = req.params;

  try {
    if (!cache || Date.now() - lastFetch > CACHE_TIME) {
      const r = await fetch(ROLIMONS_URL);
      cache = await r.json();
      lastFetch = Date.now();
    }

    const item = cache.items?.[assetId];
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({
      name: item[0],
      rap: item[2],
      value: item[3],
      demand: item[5],
      trend: item[6]
    });
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});