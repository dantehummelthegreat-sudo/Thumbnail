// Server-side core of the AI critique. Shared by the Vercel serverless
// function (api/critique.js) and the Vite dev-server middleware, so the
// ANTHROPIC_API_KEY only ever lives in a server environment variable and is
// never shipped to the browser.
import Anthropic from '@anthropic-ai/sdk'

// NOTE: this instruction was supplied by the project owner. Their original
// message was cut off mid-sentence at "(5) does it create" — the remainder of
// point (5) and the JSON-format footer below were filled in to match intent.
// Edit this constant if the wording should differ.
export const CRITIQUE_PROMPT = `You are a blunt, expert YouTube thumbnail coach. Analyze this thumbnail as it would perform in a crowded YouTube feed. Be specific and honest — never say generic things like 'looks good.' Evaluate: (1) is the text large and legible at small mobile size, (2) contrast between the subject and background, (3) is there a single clear focal point or is it cluttered, (4) if there's a face, is it expressive and uncropped, (5) does it create curiosity or an emotional hook strong enough to earn a click without being misleading.

Return your critique as JSON with exactly these fields:
- "score": integer 1-10, predicted click-through strength in a crowded feed
- "summary": 2-3 blunt sentences forecasting how this thumbnail will likely perform — name specifically what will make it STAND OUT in the feed and what could make it FAIL
- "verdict": one blunt sentence summarizing how this thumbnail will perform
- "problems": array of short strings, the specific weaknesses (empty if none)
- "fixes": array of short strings, the concrete highest-impact changes to make`

const CRITIQUE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['score', 'summary', 'verdict', 'problems', 'fixes'],
  properties: {
    score: { type: 'integer', description: 'Predicted click-through strength, 1 (weak) to 10 (strong)' },
    summary: {
      type: 'string',
      description: '2-3 sentences: how it will likely perform — what makes it stand out, what could make it fail',
    },
    verdict: { type: 'string', description: 'One blunt sentence on how this thumbnail will perform' },
    problems: { type: 'array', items: { type: 'string' } },
    fixes: { type: 'array', items: { type: 'string' } },
  },
}

export function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

const ALLOWED_MEDIA = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

// Returns { status, body } for the HTTP layer to send.
export async function critiqueImage({ imageBase64, mediaType, title, channel }) {
  if (!isConfigured()) {
    return {
      status: 503,
      body: { error: 'not_configured', message: 'AI critique is not set up yet — set ANTHROPIC_API_KEY on the server.' },
    }
  }
  if (typeof imageBase64 !== 'string' || !imageBase64 || imageBase64.length > 8_000_000) {
    return { status: 400, body: { error: 'bad_request', message: 'Missing or oversized image.' } }
  }
  if (!ALLOWED_MEDIA.has(mediaType)) {
    return { status: 400, body: { error: 'bad_request', message: 'Unsupported image type.' } }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const context = [
    title ? `Video title: "${String(title).slice(0, 200)}"` : 'No video title provided.',
    channel ? `Channel name: "${String(channel).slice(0, 100)}"` : '',
    'Critique the attached thumbnail.',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      system: CRITIQUE_PROMPT,
      output_config: { format: { type: 'json_schema', schema: CRITIQUE_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: context },
          ],
        },
      ],
    })

    if (response.stop_reason === 'refusal') {
      return { status: 502, body: { error: 'refused', message: 'The AI declined to analyze this image.' } }
    }
    const text = response.content.find((b) => b.type === 'text')?.text
    if (!text) {
      return { status: 502, body: { error: 'empty', message: 'The AI returned no critique.' } }
    }
    return { status: 200, body: JSON.parse(text) }
  } catch (err) {
    const message =
      err?.status === 401
        ? 'The configured API key was rejected.'
        : err?.status === 429
          ? 'The AI service is rate-limited right now — try again in a minute.'
          : 'The AI critique failed — try again.'
    return { status: 502, body: { error: 'upstream', message } }
  }
}
