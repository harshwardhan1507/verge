import express from 'express'
import cors from 'cors'
// No external import needed for fetch
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// No client needed

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
    const systemPrompt = `You are Verge, a warm and deeply personal AI second brain assistant for ${userName || 'the user'}.

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

    // Map history to Gemini format
    const contents = []
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })
      }
    }
    
    // Add the latest user message with system instructions
    contents.push({
      role: 'user',
      parts: [{ text: `[SYSTEM INSTRUCTIONS]:\n${systemPrompt}\n\n[USER MESSAGE]:\n${message}` }]
    })

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
       throw new Error(data.error?.message || 'Error from Gemini API')
    }

    const reply = data.candidates[0].content.parts[0].text
    
    // Write the result in the expected stream format
    res.write(`data: ${JSON.stringify({ text: reply })}\n\n`)
    res.write(`data: [DONE]\n\n`)
    res.end()

  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.listen(3001, () => console.log('MemoryOS server running on port 3001'))
