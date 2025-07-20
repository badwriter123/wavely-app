

// // server/index.mjs
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import fetch from 'node-fetch';
// import bcrypt from 'bcrypt';
// import fs from 'fs';

// const app = express();
// const port = 3001;

// app.use(cors());
// app.use(bodyParser.json());

// // 🧠 In-memory store (for demo)
// const users = {};

// // ✅ Root health check
// app.get('/', (req, res) => {
//   res.send('Claude Content MCP backend running.');
// });

// // ✅ Signup Route
// app.post('/signup', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

//   if (users[email]) return res.status(400).json({ error: 'Email already exists' });

//   const hashed = await bcrypt.hash(password, 10);
//   users[email] = hashed;
//   const userLine = `User: ${email} | Hashed Password: ${hashed}\n`;
//   fs.appendFileSync('user_log.txt', userLine);

//   res.json({ success: true });
// });

// // ✅ Login Route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const hashed = users[email];

//   if (!hashed) return res.status(400).json({ error: 'User not found' });

//   const match = await bcrypt.compare(password, hashed);
//   if (!match) return res.status(401).json({ error: 'Incorrect password' });

//   const loginLine = `Login Attempt: ${email} | Time: ${new Date().toISOString()}\n`;
//   fs.appendFileSync('user_log.txt', loginLine);


//   res.json({ success: true });
// });

// // ✅ Main Chat Route
// app.post('/chat', async (req, res) => {
//   const { original, query } = req.body;

//   if (!original || !query) {
//     return res.status(400).json({ error: "Missing original or query" });
//   }

//   const fullPrompt = `Original LinkedIn Post:\n${original}\n\nFollow-Up Question:\n${query}\n\nAnswer:`;

//   try {
//     const response = await fetch('http://localhost:1234/v1/chat/completions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'google/gemma-3-4b', // Make sure LM Studio is using this
//         messages: [
//           { role: "system", content: "You are a helpful LinkedIn content advisor." },
//           { role: "user", content: fullPrompt }
//         ],
//         temperature: 0.7,
//         max_tokens: 1024
//       })
//     });

//     const data = await response.json();
//     res.json({ reply: data.choices?.[0]?.message?.content || "No reply from model." });

//   } catch (error) {
//     console.error("❌ Error connecting to LM Studio:", error.message);
//     res.status(500).json({ error: "Failed to connect to model." });
//   }
// });

// app.listen(port, () => {
//   console.log(`🚀 Claude MCP backend running at http://localhost:${port}`);
// });


// server/index.mjs
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import fs from 'fs';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// 🧠 In-memory store (hashed passwords only for security)
const users = {};

// ✅ Root health check
app.get('/', (req, res) => {
  res.send('Claude Content MCP backend running.');
});

// ✅ Signup Route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  if (users[email]) return res.status(400).json({ error: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  users[email] = hashed;

  // 🔐 Logging hashed + plain password for dev
  const userLine = `User: ${email} | Plain Password: ${password} | Hashed Password: ${hashed}\n`;
  fs.appendFileSync('user_log.txt', userLine);

  res.json({ success: true });
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const hashed = users[email];

  if (!hashed) return res.status(400).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, hashed);
  if (!match) return res.status(401).json({ error: 'Incorrect password' });

  const loginLine = `Login Attempt: ${email} | Password Used: ${password} | Time: ${new Date().toISOString()}\n`;
  fs.appendFileSync('user_log.txt', loginLine);

  res.json({ success: true });
});

// ✅ Main Chat Route
app.post('/chat', async (req, res) => {
  const { original, query } = req.body;

  if (!original || !query) {
    return res.status(400).json({ error: "Missing original or query" });
  }

  const fullPrompt = `Original LinkedIn Post:\n${original}\n\nFollow-Up Question:\n${query}\n\nAnswer:`;

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
