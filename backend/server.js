import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MODEL_NAME = 'openai/gpt-oss-120b';

// Centralized AI Service function for streaming
async function streamAICompletion(messages, temperature, res) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: "GROQ_API_KEY is not configured on the backend server. Please create a .env file with your GROQ_API_KEY." } });
    return;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        stream: true,
        temperature: temperature || 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      res.status(response.status).json({
        error: {
          message: errorData.error?.message || `Groq API Error: ${response.statusText}`
        }
      });
      return;
    }

    // Set headers for Server-Sent Events (SSE) streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Read the readable stream and write directly to res
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        // Forward the exact raw byte chunk to the frontend
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error('Error during AI streaming:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: { message: error.message || 'Internal Server Error' } });
    }
  }
}

// Route handlers
app.post('/api/mystriver', async (req, res) => {
  const { messages, temperature } = req.body;
  await streamAICompletion(messages, temperature || 0.3, res);
});

app.post('/api/chatmini', async (req, res) => {
  const { messages, temperature } = req.body;
  await streamAICompletion(messages, temperature || 0.7, res);
});

app.post('/api/writer', async (req, res) => {
  const { messages, temperature } = req.body;
  await streamAICompletion(messages, temperature || 0.8, res);
});

app.listen(PORT, () => {
  console.log(`TRiO AI Backend running on port ${PORT}`);
  console.log(`Centralized Model Config: ${MODEL_NAME}`);
});
