import { describe, it, expect, beforeEach } from '@jest/globals';
import { GlobalConfig } from '../src/config/index.js';

describe('GlobalConfig', () => {
  beforeEach(() => {
    GlobalConfig.initTextConfig({
      test_message: 'Hello %s',
      simple_message: 'Simple message',
    });
  });

  it('should get text message without placeholders', () => {
    const message = GlobalConfig.getTextMessage('simple_message');
    expect(message).toBe('Simple message');
  });

  it('should replace placeholders in text message', () => {
    const message = GlobalConfig.getTextMessage('test_message', 'World');
    expect(message).toBe('Hello World');
  });

  it('should return key if message not found', () => {
    const message = GlobalConfig.getTextMessage('nonexistent');
    expect(message).toBe('nonexistent');
  });

  it('should initialize and get after game expiration', () => {
    GlobalConfig.initAfterGameExp(7200);
    expect(GlobalConfig.getAfterGameExp()).toBe(7200);
  });
});
