import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {GoogleGenAI} from '@google/genai';
import fs from 'fs';

function chatApiPlugin() {
  const handler = async (req: any, res: any, next: any) => {
    // 1. Gedeelde portfolio data (stories, documenten & evaluaties) voor docenten en bezoekers
    if (req.method === 'GET' && req.url === '/api/portfolio/state') {
      try {
        const stateFile = path.resolve(__dirname, 'portfolio-state.json');
        if (fs.existsSync(stateFile)) {
          const content = fs.readFileSync(stateFile, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(content);
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ sprints_data: null }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message }));
        return;
      }
    }

    if (req.method === 'POST' && req.url === '/api/portfolio/state') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const stateFile = path.resolve(__dirname, 'portfolio-state.json');
          fs.writeFileSync(stateFile, body, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message }));
        }
      });
      return;
    }

    // 2. Gemini chat API
    if (req.method === 'POST' && req.url === '/api/chat') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const apiKey = process.env.GEMINI_API_KEY;

          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: {
                message: 'GEMINI_API_KEY is niet geconfigureerd in de serveromgeving.'
              }
            }));
            return;
          }

          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: parsed.contents || [],
            config: parsed.systemInstruction ? {
              systemInstruction: parsed.systemInstruction
            } : undefined
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            answer: response.text || ''
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: {
              message: err?.message || 'Fout bij verwerken van vraag via Gemini.'
            }
          }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'chat-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), chatApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
