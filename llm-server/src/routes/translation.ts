import express from "express";
import { translateText } from "../services/translation";

const router = express.Router();

router.post("/translate", async (req, res) => {
  try {
    const { text, targetLang = "EN" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const translatedText = await translateText(text, targetLang);
    res.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
