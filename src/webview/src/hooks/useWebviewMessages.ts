import { useEffect, useCallback } from 'react';
import { MessageToWebview, MessageFromWebview } from '../types';

declare const acquireVsCodeApi: () => {
  postMessage: (message: MessageFromWebview) => void;
  getState: () => any;
  setState: (state: any) => void;
};

const vscode = acquireVsCodeApi();

export function useWebviewMessages(
  onMessage: (message: MessageToWebview) => void
) {
  useEffect(() => {
    const handler = (event: MessageEvent<MessageToWebview>) => {
      onMessage(event.data);
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onMessage]);

  const postMessage = useCallback((message: MessageFromWebview) => {
    vscode.postMessage(message);
  }, []);

  return { postMessage };
}
