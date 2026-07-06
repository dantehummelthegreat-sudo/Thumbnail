// Vercel-style serverless function: POST /api/critique
// Reads ANTHROPIC_API_KEY from the server environment — never from the client.
import { critiqueImage } from './_lib/critique-core.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  const { status, body } = await critiqueImage(req.body ?? {})
  res.status(status).json(body)
}
