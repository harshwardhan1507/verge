import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { message, memories, conversationHistory, userName } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' })
  }

  const memoryContext = memories?.slice(0, 20).map((m: any) =>
    `[${m.type?.toUpperCase() || 'MEMORY'} - ${new Date(m.created_at || m.timestamp || Date.now()).toLocaleDateString()}]: ${m.content}`
  ).join('\n') || 'No memories yet.'

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const messages: any[] = [
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
      }
    ]

    // Add conversation history
    if (conversationHistory?.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })
      }
    }

    // Add latest user message
    messages.push({ role: 'user', content: message })

    // Call Groq API (OpenAI-compatible format)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // free + very capable
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      })
    })

    const data = await groqRes.json()

    if (!groqRes.ok) {
      throw new Error(data.error?.message || 'Groq API error')
    }

    const reply = data.choices?.[0]?.message?.content
    if (!reply) throw new Error('No response from Groq')

    res.write(`data: ${JSON.stringify({ text: reply })}\n\n`)
    res.write(`data: [DONE]\n\n`)
    res.end()

  } catch (err: any) {
    console.error('[Verge Error]', err.message)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.listen(3001, () => console.log('✅ Verge server running on http://localhost:3001'))