import { TurnFormat, FormatInfo, TurnInfo } from '../types/index.js';

export class GameLogic {
  private static turnFormat: TurnFormat = {};
  private static formatInfo: Record<string, FormatInfo> = {};

  static initTurnFormat(
    turnFormat: TurnFormat,
    formatInfo: Record<string, FormatInfo>
  ): void {
    this.turnFormat = turnFormat;
    this.formatInfo = formatInfo;
  }

  static getTurnInfo(format: string, turn: number): TurnInfo | undefined {
    return this.turnFormat[format]?.[turn];
  }

  static getFormatInfo(format: string): FormatInfo | undefined {
    return this.formatInfo[format];
  }

  static getTotalTurns(format: string, gameMode: 'abyss' | 'onslaught'): number {
    const formatInfo = this.getFormatInfo(format);
    if (!formatInfo) {
      return 0;
    }
    return formatInfo[gameMode];
  }

  static isValidFormat(format: string): boolean {
    return format in this.formatInfo;
  }

  static isGameEnded(format: string, currentTurn: number, gameMode: 'abyss' | 'onslaught'): boolean {
    const totalTurns = this.getTotalTurns(format, gameMode);
    return currentTurn > totalTurns;
  }
}
