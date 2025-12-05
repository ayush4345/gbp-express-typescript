import { describe, it, expect } from '@jest/globals';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('Integration - Project Structure', () => {
  it('should have all required source files', () => {
    const requiredFiles = [
      'src/index.ts',
      'src/config/index.ts',
      'src/config/redis.ts',
      'src/handlers/ws.ts',
      'src/logic/index.ts',
      'src/types/index.ts',
      'src/utils/index.ts',
    ];

    requiredFiles.forEach((file) => {
      const filePath = resolve(process.cwd(), file);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it('should have all configuration files', () => {
    const configFiles = [
      'package.json',
      'tsconfig.json',
      'jest.config.js',
      'config.yaml',
      'Dockerfile',
      'docker-compose.yml',
      '.gitignore',
    ];

    configFiles.forEach((file) => {
      const filePath = resolve(process.cwd(), file);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it('should have built JavaScript files', () => {
    const builtFiles = [
      'dist/index.js',
      'dist/config/index.js',
      'dist/handlers/ws.js',
      'dist/logic/index.js',
    ];

    builtFiles.forEach((file) => {
      const filePath = resolve(process.cwd(), file);
      expect(existsSync(filePath)).toBe(true);
    });
  });
});
