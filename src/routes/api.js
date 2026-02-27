const express = require("express");
const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Replymind-backend" });
});

// Reply route
router.post("/reply", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
    
    // Using built-in fetch instead of axios to prevent missing module crashes
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a warm assistant. ${message}` }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
       throw new Error(data.error?.message || "Failed to fetch from Gemini");
    }

    const replyText = data.candidates[0].content.parts[0].text;
    res.json({ reply: replyText });

  } catch (error) {
    console.error("Error generating reply:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

// This is the crucial line that allows index.js to find this file!
module.exports = router;
