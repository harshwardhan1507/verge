import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/api/chat', async (req, res) => {
  const { message, memories, conversationHistory, userName } = req.body

  // Build memory context string from user's last 20 memories
  const memoryContext = memories?.slice(0, 20).map((m: any) =>
    `[${m.type?.toUpperCase() || 'MEMORY'} - ${new Date(m.created_at || m.timestamp || Date.now()).toLocaleDateString()}]: ${m.content}`
  ).join('\n') || 'No memories yet.'

  // Set SSE headers for streaming
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
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
    })

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || ''
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }
    
    res.write(`data: [DONE]\n\n`)
    res.end()

  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.listen(3001, () => console.log('MemoryOS server running on port 3001'))
