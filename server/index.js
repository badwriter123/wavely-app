// server/index.mjs
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // This is okay in .mjs format

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Claude Content MCP backend running.');
});

app.post('/chat', async (req, res) => {
  const { original, query } = req.body;

  if (!original || !query) {
    return res.status(400).json({ error: "Missing original or query" });
  }

  const fullPrompt = `Original LinkedIn / Reddit Post:\n${original}\n\nFollow-Up Question:\n${query}\n\nAnswer:`;

  try {
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemma-3-4b', // Update if using a different one
        messages: [
          { role: "system", content: "You are a helpful LinkedIn / Reddit content advisor." },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "No reply from model." });

  } catch (error) {
    console.error("❌ Error connecting to LM Studio:", error.message);
    res.status(500).json({ error: "Failed to connect to model." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Claude MCP backend running at http://localhost:${port}`);
});
