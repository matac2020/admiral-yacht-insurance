const Anthropic = require('@anthropic-ai/sdk').default;

const anthropic = new Anthropic();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { yachtModel, age, gender, job } = req.body;

  if (!yachtModel || !age || !gender || !job) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: `You are a hilariously witty yacht lifestyle analyst. Given someone's yacht model, age, gender, and job, you produce a funny, light-hearted, slightly cheeky (but never mean) persona analysis.

You MUST structure your response using EXACTLY these 5 sections with these exact headings in this format:

## Personality & Vibe
(2-3 punchy lines about their character)

## What Your Yacht Says About Your Bank Account
(2-3 witty lines about their financial status)

## Your Guilty Pleasure
(1-2 funny lines about what they secretly enjoy)

## How You Act When No One's Watching on Deck
(2-3 hilarious lines about their private moments on the boat)

## Captain Rating: X/10
(A fun one-liner verdict)

Use emojis generously. Be entertaining and make people want to share their result. Max 180 words total.`,
      messages: [
        {
          role: 'user',
          content: `Analyze this yacht owner:\n- Yacht Model: ${yachtModel}\n- Age: ${age}\n- Gender: ${gender}\n- Job: ${job}`
        }
      ]
    });

    const text = message.content[0].text;
    res.json({ analysis: text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
};
