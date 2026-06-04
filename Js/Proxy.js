const express = require("express");
const cors    = require("cors");
const fetch   = require("node-fetch");

const app         = express();
const REED_API_KEY = "6d2c6e9d-9472-4b55-b6a0-d7d838a1c2aa";

app.use(cors());

app.get("/jobs", async function (req, res) {
  try {
    let params = new URLSearchParams({
      keywords:        req.query.keywords      || "",
      resultsToTake:   20,
      resultsToSkip:   0,
    });

    if (req.query.locationName) {
      params.set("locationName",          req.query.locationName);
      params.set("distancefromLocation",  req.query.distancefromLocation || 15);
    }

    let url     = "https://www.reed.co.uk/api/1.0/search?" + params.toString();
    let headers = { "Authorization": "Basic " + Buffer.from(REED_API_KEY + ":").toString("base64") };

    let response = await fetch(url, { headers });
    let data     = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
});

app.listen(3000, function () {
  console.log("Job proxy running at http://localhost:3000");
});
