const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Configuration de l'application
const config = {
  appName: process.env.APP_NAME || 'CI/CD Demo App',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.APP_VERSION || '1.0.0'
};

// Utilitaire pour servir les fichiers statiques
function serveStaticFile(filePath, contentType, res) {
  const fullPath = path.join(__dirname, '..', 'public', filePath);
  
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

// Données de l'API
function getAppInfo() {
  return {
    name: config.appName,
    version: config.version,
    environment: config.environment,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodejs: process.version
  };
}

// Gestionnaire de routes
function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  switch (url.pathname) {
    case '/':
      serveStaticFile('index.html', 'text/html', res);
      break;
      
    case '/style.css':
      serveStaticFile('style.css', 'text/css', res);
      break;
      
    case '/api/info':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getAppInfo(), null, 2));
      break;
      
    case '/api/health':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
      break;
      
    case '/api/ready':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ready: true }));
      break;
      
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found', path: url.pathname }));
  }
}

// Création et démarrage du serveur
const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`📦 Environment: ${config.environment}`);
  console.log(`📌 Version: ${config.version}`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { getAppInfo, config };
