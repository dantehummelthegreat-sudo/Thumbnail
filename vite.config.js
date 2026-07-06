import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves POST /api/critique during `npm run dev` using the same handler core
// as the Vercel serverless function. The ANTHROPIC_API_KEY has no VITE_
// prefix, so Vite never exposes it to the client bundle.
function critiqueApiPlugin() {
  return {
    name: 'thumbtest-critique-api',
    configureServer(server) {
      server.middlewares.use('/api/critique', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
          return
        }
        const chunks = []
        req.on('data', (c) => chunks.push(c))
        req.on('end', async () => {
          res.setHeader('content-type', 'application/json')
          let payload
          try {
            payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'bad_request', message: 'Invalid JSON body.' }))
            return
          }
          try {
            const { critiqueImage } = await import('./api/_lib/critique-core.js')
            const { status, body } = await critiqueImage(payload)
            res.statusCode = status
            res.end(JSON.stringify(body))
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'internal', message: 'Critique handler crashed.' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Pull ANTHROPIC_API_KEY from .env files into the dev-server process env
  // (server-side only; never bundled).
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
  }
  return {
    plugins: [react(), tailwindcss(), critiqueApiPlugin()],
  }
})
