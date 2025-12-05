import { describe, it, expect, beforeAll } from '@jest/globals';
import { GameLogic } from '../src/logic/index.js';

describe('GameLogic', () => {
  beforeAll(() => {
    GameLogic.initTurnFormat(
      {
        '4': {
          1: { pick: false, player: 1 },
          2: { pick: false, player: 2 },
          3: { pick: true, player: 1 },
        },
      },
      {
        '4': { abyss: 24, onslaught: 32 },
        '3': { abyss: 22, onslaught: 30 },
      }
    );
  });

  describe('getTurnInfo', () => {
    it('should return turn info for valid format and turn', () => {
      const turnInfo = GameLogic.getTurnInfo('4', 1);
      expect(turnInfo).toEqual({ pick: false, player: 1 });
    });

    it('should return undefined for invalid format', () => {
      const turnInfo = GameLogic.getTurnInfo('invalid', 1);
      expect(turnInfo).toBeUndefined();
    });

    it('should return undefined for invalid turn', () => {
      const turnInfo = GameLogic.getTurnInfo('4', 999);
      expect(turnInfo).toBeUndefined();
    });
  });

  describe('getFormatInfo', () => {
    it('should return format info for valid format', () => {
      const formatInfo = GameLogic.getFormatInfo('4');
      expect(formatInfo).toEqual({ abyss: 24, onslaught: 32 });
    });

    it('should return undefined for invalid format', () => {
      const formatInfo = GameLogic.getFormatInfo('invalid');
      expect(formatInfo).toBeUndefined();
    });
  });

  describe('getTotalTurns', () => {
    it('should return total turns for abyss mode', () => {
      expect(GameLogic.getTotalTurns('4', 'abyss')).toBe(24);
    });

    it('should return total turns for onslaught mode', () => {
      expect(GameLogic.getTotalTurns('4', 'onslaught')).toBe(32);
    });

    it('should return 0 for invalid format', () => {
      expect(GameLogic.getTotalTurns('invalid', 'abyss')).toBe(0);
    });
  });

  describe('isValidFormat', () => {
    it('should return true for valid format', () => {
      expect(GameLogic.isValidFormat('4')).toBe(true);
      expect(GameLogic.isValidFormat('3')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(GameLogic.isValidFormat('invalid')).toBe(false);
    });
  });

  describe('isGameEnded', () => {
    it('should return false if game is not ended', () => {
      expect(GameLogic.isGameEnded('4', 10, 'abyss')).toBe(false);
    });

    it('should return true if turn exceeds total turns', () => {
      expect(GameLogic.isGameEnded('4', 25, 'abyss')).toBe(true);
    });
  });
});
