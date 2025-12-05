# Usage Guide

This guide provides examples of how to use the Genshin Ban Pick WebSocket Server.

## Starting the Server

### Development Mode
```bash
npm run dev
```
This starts the server with hot-reload for development.

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### HTTP Endpoints

#### Health Check
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-05T19:58:29.278Z"
}
```

### WebSocket Endpoints

#### Play Endpoint
Connect as a player to join or create a game.

**URL:** `ws://localhost:8000/play`

**Query Parameters:**
- `gid` (required): Game ID
- `player` (required): Player number (1 or 2)
- `setting` (optional): Game format setting (0-4)

**Example (JavaScript):**
```javascript
const ws = new WebSocket('ws://localhost:8000/play?gid=game123&player=1&setting=4');

ws.onopen = () => {
  console.log('Connected to game');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from game');
};
```

**Example (Node.js with ws library):**
```javascript
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8000/play?gid=game123&player=1&setting=4');

ws.on('open', () => {
  console.log('Connected to game');
  
  // Send a game move
  ws.send(JSON.stringify({
    type: 'move',
    data: {
      turn: 1,
      choice: 'character_id'
    }
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('Received:', message);
});
```

#### Watch Endpoint
Connect as a spectator to watch a game.

**URL:** `ws://localhost:8000/watch`

**Query Parameters:**
- `gid` (required): Game ID to watch
- `username` (optional): Your username for identification

**Example:**
```javascript
const ws = new WebSocket('ws://localhost:8000/watch?gid=game123&username=spectator1');

ws.onmessage = (event) => {
  const gameState = JSON.parse(event.data);
  console.log('Game state update:', gameState);
};
```

## Message Format

### Client to Server Messages
```json
{
  "type": "move",
  "data": {
    "turn": 1,
    "choice": "character_id"
  }
}
```

### Server to Client Messages

#### Success Message
```json
{
  "type": "success",
  "status": "GAME_READY",
  "data": "Both players are connected, the game is ready"
}
```

#### Error Message
```json
{
  "type": "error",
  "status": "JOIN_GAME_ERROR",
  "error": "Param gid is required to connect to the game",
  "data": "Error message details"
}
```

## Game Formats

The server supports 5 game formats (0-4), each with different numbers of turns:

| Format | Abyss Mode | Onslaught Mode |
|--------|-----------|----------------|
| 4      | 24 turns  | 32 turns       |
| 3      | 22 turns  | 30 turns       |
| 2      | 20 turns  | 28 turns       |
| 1      | 18 turns  | 26 turns       |
| 0      | 16 turns  | 24 turns       |

## Configuration

Edit `config.yaml` to customize:

### Server Settings
```yaml
addr: localhost:8000  # Server address and port
```

### CORS Settings
```yaml
CORS: ["localhost", "genshinbanpick.com", ""]  # Allowed origins
```

### Redis Settings
```yaml
redis_addr: localhost:6379
redis_pwd: ""
redis_db: 0
```

## Docker Deployment

### Build and Run with Docker Compose
```bash
docker-compose up -d
```

This starts both the WebSocket server and Redis.

### Build Docker Image
```bash
docker build -t gbp-ws:latest .
```

### Run Docker Container
```bash
docker run -p 8000:8000 --env-file .env gbp-ws:latest
```

## Testing WebSocket Connection

### Using websocat (Command Line Tool)
```bash
# Install websocat
# macOS: brew install websocat
# Linux: cargo install websocat

# Connect to play endpoint
websocat "ws://localhost:8000/play?gid=test&player=1&setting=4"

# Connect to watch endpoint
websocat "ws://localhost:8000/watch?gid=test&username=spectator"
```

### Using Browser Console
```javascript
// Open browser console (F12) and run:
const ws = new WebSocket('ws://localhost:8000/play?gid=test&player=1&setting=4');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.send(JSON.stringify({ type: 'move', data: { turn: 1, choice: 'char1' } }));
```

## Troubleshooting

### Redis Connection Error
If you see "Redis Client Error", make sure Redis is running:
```bash
# Check if Redis is running
redis-cli ping

# Start Redis (if not running)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

### CORS Issues
If you're blocked by CORS, add your origin to `config.yaml`:
```yaml
CORS: ["localhost", "yourdomain.com"]
```

### Port Already in Use
If port 8000 is busy, change it in `config.yaml`:
```yaml
addr: localhost:3000
```
