# Genshin Ban Pick - WebSocket Server (TypeScript)

A TypeScript implementation of the Genshin Ban Pick WebSocket backend server using Node.js, Express, and ESM modules.

## Tech Stack

- **Node.js** with TypeScript
- **Express** for HTTP server
- **ws** for WebSocket support
- **Redis** for state management
- **Jest** for testing
- **ESM** (ES Modules) for modern JavaScript

## Requirements

- Node.js 18.x or higher
- Redis server (for state management)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ayush4345/gbp-express-typescript.git
cd gbp-express-typescript
```

2. Install dependencies:
```bash
npm install
```

3. Configure the application:
   - Edit `config.yaml` to set up your Redis connection and other settings
   - Make sure Redis is running on the configured host/port

## Development

Run the server in development mode with hot reload:
```bash
npm run dev
```

## Building

Build the TypeScript code to JavaScript:
```bash
npm run build
```

## Running

Start the production server:
```bash
npm start
```

The server will start on the address specified in `config.yaml` (default: `localhost:8000`)

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Type Checking

Check TypeScript types without building:
```bash
npm run lint
```

## Available Endpoints

- **HTTP Health Check**: `GET http://localhost:8000/health`
- **WebSocket Play**: `ws://localhost:8000/play?gid={gameId}&player={playerId}&setting={setting}`
- **WebSocket Watch**: `ws://localhost:8000/watch?gid={gameId}&username={username}`

## Project Structure

```
src/
├── index.ts           # Main application entry point
├── config/            # Configuration management
│   ├── index.ts       # Config loader and global config
│   └── redis.ts       # Redis connection
├── handlers/          # WebSocket handlers
│   └── ws.ts          # WebSocket handler implementation
├── logic/             # Game logic
│   └── index.ts       # Game logic and turn management
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types and interfaces
└── utils/             # Utility functions
    └── index.ts       # Helper functions

__tests__/             # Jest test files
├── config.test.ts
├── logic.test.ts
└── utils.test.ts
```

## Configuration

Edit `config.yaml` to configure:
- Server address and port
- CORS allowed origins
- Redis connection details
- Game format and turn information
- Text messages for different game states

## Docker

To run with Docker (Redis included):
```bash
docker-compose up -d
```

## License

ISC