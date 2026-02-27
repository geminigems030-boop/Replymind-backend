const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ReplyMind - Transform Egypt" });
});

router.post("/reply", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });
  try {
    const axios = require("axios");
    const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY;
    const prompt = `You are a warm assistant for Transform Egypt (@transformegypt), Egypt's biggest hair extensions center. Branches: Cairo Festival Mall, CityStars, Sofitel Downtown, Nile Ritz-Carlton, El Alamein. Phone: 01009780008. Reply warmly in the same language as the message. Max 2-3 sentences.\n\nMessage: "${message}"`;
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 300 }
    });
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    res.json({ reply, confidence: 0.92 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
