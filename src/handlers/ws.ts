import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { createClient } from 'redis';
import { parseQueryParam, sendWSError, sendWSSuccess } from '../utils/index.js';
import { GlobalConfig } from '../config/index.js';

type RedisClient = ReturnType<typeof createClient>;

export class WebSocketHandler {
  private redisClient: RedisClient;
  private wss: WebSocketServer;

  constructor(redisClient: RedisClient, wss: WebSocketServer) {
    this.redisClient = redisClient;
    this.wss = wss;
  }

  async handlePlay(ws: WebSocket, request: IncomingMessage): Promise<void> {
    try {
      const url = request.url || '';
      const gameId = parseQueryParam(url, 'gid');
      const player = parseQueryParam(url, 'player');
      const setting = parseQueryParam(url, 'setting');

      if (!gameId) {
        const errorMsg = GlobalConfig.getTextMessage('params_required', 'gid');
        sendWSError(ws, new Error(errorMsg), 'JOIN_GAME_ERROR', errorMsg);
        return;
      }

      if (!player) {
        const errorMsg = GlobalConfig.getTextMessage('params_required', 'player');
        sendWSError(ws, new Error(errorMsg), 'JOIN_GAME_ERROR', errorMsg);
        return;
      }

      // Connect to game logic would go here
      await this.connectGame(ws, gameId, player, setting);
    } catch (error) {
      const err = error as Error;
      sendWSError(ws, err, 'JOIN_GAME_ERROR', 'Connection error');
    }
  }

  async handleWatch(ws: WebSocket, request: IncomingMessage): Promise<void> {
    try {
      const url = request.url || '';
      const gameId = parseQueryParam(url, 'gid');
      const username = parseQueryParam(url, 'username');

      if (!gameId) {
        const errorMsg = GlobalConfig.getTextMessage('params_required', 'gid');
        sendWSError(ws, new Error(errorMsg), 'WATCH_GAME_ERROR', errorMsg);
        return;
      }

      // Watch game logic would go here
      await this.watchGame(ws, gameId, username);
    } catch (error) {
      const err = error as Error;
      sendWSError(ws, err, 'WATCH_GAME_ERROR', 'Watch error');
    }
  }

  private async connectGame(
    ws: WebSocket,
    gameId: string,
    player: string,
    setting?: string
  ): Promise<void> {
    // Placeholder for game connection logic
    console.log(`Player ${player} connecting to game ${gameId} with setting ${setting}`);
    
    // Check if game exists in Redis
    const gameExists = await this.redisClient.exists(`game:${gameId}`);
    
    if (!gameExists) {
      // Create new game
      await this.createGame(gameId, player, setting);
      const waitingMsg = GlobalConfig.getTextMessage('waiting_player');
      sendWSSuccess(ws, 'WAITING', waitingMsg);
    } else {
      // Join existing game
      const readyMsg = GlobalConfig.getTextMessage('game_ready');
      sendWSSuccess(ws, 'GAME_READY', readyMsg);
    }

    // Set up message handlers
    ws.on('message', async (data: Buffer) => {
      await this.handleGameMessage(ws, gameId, player, data);
    });

    ws.on('close', () => {
      console.log(`Player ${player} disconnected from game ${gameId}`);
      this.handleDisconnect(gameId, player);
    });
  }

  private async watchGame(
    ws: WebSocket,
    gameId: string,
    username?: string
  ): Promise<void> {
    // Placeholder for watch logic
    console.log(`User ${username || 'anonymous'} watching game ${gameId}`);
    
    const gameExists = await this.redisClient.exists(`game:${gameId}`);
    
    if (!gameExists) {
      sendWSError(ws, new Error('Game not found'), 'WATCH_ERROR', 'Game does not exist');
      return;
    }

    const joinMsg = GlobalConfig.getTextMessage('watch_game_join', username || 'Anonymous');
    sendWSSuccess(ws, 'WATCHING', joinMsg);

    ws.on('close', () => {
      console.log(`Watcher ${username || 'anonymous'} left game ${gameId}`);
    });
  }

  private async createGame(
    gameId: string,
    player: string,
    setting?: string
  ): Promise<void> {
    // Create initial game state in Redis
    const gameState = {
      gameId,
      player1: player,
      player2: null,
      setting: setting || '4',
      currentTurn: 1,
      ended: false,
      createdAt: Date.now(),
    };

    await this.redisClient.set(`game:${gameId}`, JSON.stringify(gameState));
    await this.redisClient.expire(`game:${gameId}`, GlobalConfig.getAfterGameExp());
  }

  private async handleGameMessage(
    ws: WebSocket,
    gameId: string,
    player: string,
    data: Buffer
  ): Promise<void> {
    try {
      const message = JSON.parse(data.toString());
      console.log(`Game ${gameId} - Player ${player} message:`, message);
      
      // Game logic would process the message here
      // For now, just acknowledge receipt
      sendWSSuccess(ws, 'MESSAGE_RECEIVED', 'Message processed', message);
    } catch (error) {
      const err = error as Error;
      sendWSError(ws, err, 'MESSAGE_ERROR', 'Invalid message format');
    }
  }

  private handleDisconnect(gameId: string, player: string): void {
    // Handle player disconnection
    console.log(`Handling disconnect for player ${player} in game ${gameId}`);
    // Could notify other players, update game state, etc.
  }
}
