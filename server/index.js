import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import multer from 'multer';
import ColorThief from 'colorthief';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Set up multer for image upload (store in tmp folder)
const upload = multer({ dest: 'tmp/' });

// GET / (status route)
app.get('/', (req, res) => {
  res.send('ChromaGen backend running');
});

/**
 * POST /api/generate-palette
 * Accepts either a text prompt or an image upload for Colormind palette generation.
 * - For text: maps prompt to Colormind input (simple mapping: use as seed color).
 * - For image: extracts 2 dominant colors and sends them as input to Colormind.
 * Accepts multipart/form-data for image, or JSON for prompt.
 */
app.post('/api/generate-palette', upload.single('image'), async (req, res) => {
  try {
    let input = [[44,43,44],[90,83,82],"N","N","N"];
    let model = "default";
    // If text prompt is provided
    if (req.body && req.body.prompt) {
      // Simple hash to RGB for prompt-based seed
      const prompt = req.body.prompt;
      function stringToRgb(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const rgb = [0, 0, 0].map((_, i) => (hash >> (i * 8)) & 0xFF);
        return rgb;
      }
      input = [stringToRgb(prompt), [90,83,82], "N", "N", "N"];
    }
    // If image is uploaded
    else if (req.file) {
      const imagePath = path.resolve(req.file.path);
      try {
        // Extract top 2 dominant colors
        const palette = await ColorThief.getPalette(imagePath, 2);
        input = [palette[0], palette[1], "N", "N", "N"];
      } catch (imgErr) {
        return res.status(400).json({ error: 'Failed to extract colors from image.' });
      } finally {
        // Clean up temp file
        fs.unlink(imagePath, () => {});
      }
    } else {
      // Fallback to default input
    }
    const payload = { input, model };
    const response = await fetch('http://colormind.io/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch from Colormind API' });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

