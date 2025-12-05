import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { loadConfig, getConfig, GlobalConfig } from './config/index.js';
import { getRedisConnection } from './config/redis.js';
import { GameLogic } from './logic/index.js';
import { WebSocketHandler } from './handlers/ws.js';
import { containsString } from './utils/index.js';

async function main() {
  console.log('Loading WebSocket server...');

  // Load configuration
  const config = loadConfig('config.yaml');
  
  // Initialize text messages
  GlobalConfig.initTextConfig(config.text_messages);
  
  // Initialize after game expiration
  GlobalConfig.initAfterGameExp(config.AFTER_GAME_EXP);
  
  // Initialize game turn format
  GameLogic.initTurnFormat(config.GAME_TURN_FORMAT, config.GAME_FORMAT_INFO);

  // Create Express app
  const app = express();
  
  // Configure CORS
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if empty string is in CORS list (allows all origins)
      if (config.CORS.includes('')) {
        callback(null, true);
        return;
      }
      
      const hostname = new URL(origin).hostname;
      if (containsString(config.CORS, hostname)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked: ${hostname}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Create HTTP server
  const server = createServer(app);

  // Initialize Redis connection
  const redisClient = await getRedisConnection(config);

  // Create WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  // Create WebSocket handler
  const wsHandler = new WebSocketHandler(redisClient, wss);

  // Handle WebSocket upgrade
  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', 'ws://localhost').pathname;

    if (pathname === '/play') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wsHandler.handlePlay(ws, request);
      });
    } else if (pathname === '/watch') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wsHandler.handleWatch(ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  // Start server
  const [host, port] = config.addr.split(':');
  server.listen(parseInt(port, 10), host, () => {
    console.log(`WebSocket server started successfully on ${config.addr}`);
    console.log(`Available endpoints:`);
    console.log(`  - HTTP: http://${config.addr}/health`);
    console.log(`  - WebSocket: ws://${config.addr}/play`);
    console.log(`  - WebSocket: ws://${config.addr}/watch`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    server.close();
    await redisClient.quit();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    server.close();
    await redisClient.quit();
    process.exit(0);
  });
}

// Start the application
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
