import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { AppConfig } from '../types/index.js';

let config: AppConfig | null = null;

export function loadConfig(configPath: string): AppConfig {
  try {
    const fileContents = readFileSync(configPath, 'utf8');
    config = yaml.load(fileContents) as AppConfig;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    throw error;
  }
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error('Configuration not loaded. Call loadConfig() first.');
  }
  return config;
}

export class GlobalConfig {
  private static textMessages: Record<string, string> = {};
  private static afterGameExp: number = 3600;

  static initTextConfig(messages: Record<string, string>): void {
    this.textMessages = messages;
  }

  static getTextMessage(key: string, ...args: any[]): string {
    let message = this.textMessages[key] || key;
    args.forEach((arg, index) => {
      message = message.replace(`%s`, String(arg));
    });
    return message;
  }

  static initAfterGameExp(seconds: number): void {
    this.afterGameExp = seconds;
  }

  static getAfterGameExp(): number {
    return this.afterGameExp;
  }
}
