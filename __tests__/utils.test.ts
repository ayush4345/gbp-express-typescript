import { describe, it, expect } from '@jest/globals';
import { containsString, parseQueryParam } from '../src/utils/index.js';

describe('Utils', () => {
  describe('containsString', () => {
    it('should return true if string is in array', () => {
      expect(containsString(['foo', 'bar', 'baz'], 'bar')).toBe(true);
    });

    it('should return false if string is not in array', () => {
      expect(containsString(['foo', 'bar'], 'baz')).toBe(false);
    });

    it('should handle empty array', () => {
      expect(containsString([], 'foo')).toBe(false);
    });
  });

  describe('parseQueryParam', () => {
    it('should extract query parameter from URL', () => {
      const url = '/play?gid=123&player=1';
      expect(parseQueryParam(url, 'gid')).toBe('123');
      expect(parseQueryParam(url, 'player')).toBe('1');
    });

    it('should return undefined for missing parameter', () => {
      const url = '/play?gid=123';
      expect(parseQueryParam(url, 'player')).toBeUndefined();
    });

    it('should handle URL without query parameters', () => {
      const url = '/play';
      expect(parseQueryParam(url, 'gid')).toBeUndefined();
    });
  });
});
