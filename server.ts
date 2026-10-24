import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './src/server/routes/authRoutes.js';
import noticeRoutes from './src/server/routes/noticeRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/notices', noticeRoutes);

  // Health and info endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'College Digital Notice Board API',
      timestamp: new Date().toISOString(),
    });
  });

  // Direct download route for the complete project ZIP archive
  app.get('/api/download-zip', (req, res) => {
    const zipPath = path.resolve(__dirname, 'public', 'lbrce-digital-notice-board.zip');
    res.download(zipPath, 'lbrce-digital-notice-board.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ message: 'Error downloading project archive' });
      }
    });
  });

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Notice Board Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
