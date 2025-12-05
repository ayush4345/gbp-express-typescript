import { WebSocket } from 'ws';
import { WSMessage } from '../types/index.js';

export function containsString(arr: string[], str: string): boolean {
  return arr.includes(str);
}

export function sendWSMessage(ws: WebSocket, message: WSMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

export function sendWSError(
  ws: WebSocket,
  error: Error,
  status: string,
  message: string
): void {
  const errorMessage: WSMessage = {
    type: 'error',
    status,
    error: message,
    data: error.message,
  };
  sendWSMessage(ws, errorMessage);
  ws.close();
}

export function sendWSSuccess(
  ws: WebSocket,
  status: string,
  message: string,
  data?: any
): void {
  const successMessage: WSMessage = {
    type: 'success',
    status,
    data: data || message,
  };
  sendWSMessage(ws, successMessage);
}

export function parseQueryParam(
  url: string,
  param: string
): string | undefined {
  const urlObj = new URL(url, 'http://localhost');
  return urlObj.searchParams.get(param) || undefined;
}
