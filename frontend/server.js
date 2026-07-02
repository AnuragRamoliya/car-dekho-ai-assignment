import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 4173);

const rawBackendTarget = process.env.BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://localhost:4000';
const backendTarget = rawBackendTarget.replace(/\/$/, '');
const backendBase = backendTarget.endsWith('/api') ? backendTarget : `${backendTarget}/api`;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

const readRequestBody = async (req) => {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const sendFile = async (res, filePath) => {
  const data = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');

  if (requestUrl.pathname.startsWith('/api/')) {
    const upstreamUrl = new URL(`${backendBase}${requestUrl.pathname.replace(/^\/api/, '')}${requestUrl.search}`);
    const body = await readRequestBody(req);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        ...(req.headers || {}),
        host: undefined
      },
      body
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');

    res.writeHead(upstreamResponse.status, Object.fromEntries(responseHeaders.entries()));
    if (req.method !== 'HEAD') {
      const arrayBuffer = await upstreamResponse.arrayBuffer();
      res.end(Buffer.from(arrayBuffer));
    } else {
      res.end();
    }
    return;
  }

  const requestPath = decodeURIComponent(requestUrl.pathname);
  const filePath = path.join(distDir, requestPath === '/' ? 'index.html' : requestPath);

  try {
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      await sendFile(res, filePath);
      return;
    }
  } catch {
    // fall through to SPA fallback
  }

  try {
    await sendFile(res, path.join(distDir, 'index.html'));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Failed to serve app');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server listening on port ${port}`);
});
