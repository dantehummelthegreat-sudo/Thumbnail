// Server-side core of the AI critique. Shared by the Vercel serverless
// function (api/critique.js) and the Vite dev-server middleware, so the
// ANTHROPIC_API_KEY only ever lives in a server environment variable and is
// never shipped to the browser.
import Anthropic from '@anthropic-ai/sdk'

// Instruction supplied by the project owner — edit this constant to tune it.
export const CRITIQUE_PROMPT = `You are a blunt expert YouTube thumbnail coach. Analyze this thumbnail as it would perform in a crowded feed. Return JSON: { summary: a 2-3 sentence overview of how it will likely perform — specifically what will make it STAND OUT and what could make it FAIL; overall_score: 1-10; biggest_problem: string; fixes: [up to 3 specific action items]; strengths: [up to 2 items] }. Be specific — never say generic things like 'looks good.'`

const CRITIQUE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'overall_score', 'biggest_problem', 'fixes', 'strengths'],
  properties: {
    summary: {
      type: 'string',
      description:
        '2-3 sentence overview of likely performance — what will make it STAND OUT and what could make it FAIL',
    },
    overall_score: {
      type: 'integer',
      description: 'Predicted click-through strength, 1 (weak) to 10 (strong)',
    },
    biggest_problem: { type: 'string', description: 'The single most damaging weakness' },
    fixes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Up to 3 specific action items',
    },
    strengths: {
      type: 'array',
      items: { type: 'string' },
      description: 'Up to 2 things that already work',
    },
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
