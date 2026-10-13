import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import handler from './api/recovery-plan.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Only this Node process receives the secret; it is not defined in client JS.
  process.env.ANTHROPIC_API_KEY ||= env.ANTHROPIC_API_KEY
  process.env.ANTHROPIC_MODEL ||= env.ANTHROPIC_MODEL
  return {
    plugins: [react(), {
      name: 'local-recovery-api',
      configureServer(server) {
        server.middlewares.use('/api/recovery-plan', async (req, res) => {
          const chunks = []
          let size = 0
          for await (const chunk of req) {
            size += chunk.length
            if (size > 8192) { res.statusCode = 413; res.end(); return }
            chunks.push(chunk)
          }
          try { req.body = JSON.parse(Buffer.concat(chunks).toString() || '{}') }
          catch { res.statusCode = 400; res.end(); return }
          res.status = code => { res.statusCode = code; return res }
          res.json = data => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)) }
          await handler(req, res)
        })
      },
    }],
  }
})
