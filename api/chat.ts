import OpenAI from 'openai';

// This is the Vercel Serverless Function entrypoint
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ensure CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { message, memories, conversationHistory, userName } = req.body;

    const memoryContext = memories?.slice(0, 20).map((m: any) =>
      `[${m.type?.toUpperCase() || 'MEMORY'} - ${new Date(m.created_at || m.timestamp || Date.now()).toLocaleDateString()}]: ${m.content}`
    ).join('\n') || 'No memories yet.';

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Set SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are Verge, a warm and deeply personal AI second brain assistant for ${userName || 'the user'}.

You have access to their personal memories, thoughts, emotions, and commitments stored below.
Use this context to give personalized, insightful responses. Reference specific memories when relevant.

USER'S MEMORIES:
${memoryContext}

Your personality:
- Warm, empathetic, and genuinely caring
- Proactive: notice patterns and surface insights the user hasn't seen
- Concise but deep — no fluff, no generic advice
- Use the user's actual memories to make responses personal
- When asked for a summary, structure it clearly with sections
- When asked to organize thoughts, help them prioritize and clarify

You can help with:
- Daily summaries ("summarize my day/week")  
- Emotional check-ins ("how have I been feeling?")
- Pattern spotting ("what do I keep worrying about?")
- Thought organization ("help me think through X")
- Commitment tracking ("what have I committed to?")
- People insights ("what's going on with [person]?")`
        },
        ...(conversationHistory || []),
        { role: 'user', content: message }
      ]
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}
