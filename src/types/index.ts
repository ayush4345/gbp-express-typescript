export interface TurnInfo {
  pick: boolean;
  player: number;
}

export interface FormatInfo {
  abyss: number;
  onslaught: number;
}

export interface GameFormatConfig {
  [formatKey: string]: FormatInfo;
}

export interface TurnFormat {
  [formatKey: string]: {
    [turnNumber: number]: TurnInfo;
  };
}

export interface TextMessages {
  [key: string]: string;
}

export interface AppConfig {
  addr: string;
  CORS: string[];
  redis_addr: string;
  redis_pwd: string;
  redis_db: number;
  text_messages: TextMessages;
  GAME_FORMAT_INFO: GameFormatConfig;
  GAME_TURN_FORMAT: TurnFormat;
  AFTER_GAME_EXP: number;
}

export interface WSMessage {
  type: string;
  data?: any;
  error?: string;
  status?: string;
}

export interface GameState {
  gameId: string;
  player1Connected: boolean;
  player2Connected: boolean;
  currentTurn: number;
  format: string;
  ended: boolean;
  picks: Record<number, any>;
  bans: Record<number, any>;
}
