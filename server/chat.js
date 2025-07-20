// // server/chat.js (Node backend using Express)
// const express = require('express');
// const router = express.Router();
// const fetch = require('node-fetch');

// router.post('/chat', async (req, res) => {
//   const { context, message } = req.body;

//   const payload = {
//     model: 'gemma-4b-instruct',
//     messages: [
//       { role: 'system', content: `You are an assistant analyzing this post: \n${context}` },
//       { role: 'user', content: message },
//     ],
//   };

//   try {
//     const response = await fetch('http://localhost:1234/v1/chat/completions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();
//     const reply = data.choices?.[0]?.message?.content;
//     res.json({ reply });
//   } catch (err) {
//     console.error('Chat error:', err);
//     res.status(500).json({ reply: 'Error talking to the model.' });
//   }
// });

// module.exports = router;


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { original, query } = req.body;

  const fullPrompt = `Original LinkedIn Post:\n${original}\n\nFollow-Up Question:\n${query}\n\nAnswer:`;

  // Replace this with your LM Studio call to gemma or deepseek
  try {
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemma-3-4b',
        messages: [
          { role: "system", content: "You are a helpful LinkedIn content advisor." },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const json = await response.json();
    res.json({ reply: json.choices[0]?.message?.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Model call failed." });
  }
});

app.listen(port, () => {
  console.log(`🔥 Claude MCP Backend running at http://localhost:${port}`);
});
