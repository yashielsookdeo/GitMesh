import * as vscode from 'vscode';
import { GitMeshWebviewProvider } from './webviewProvider';

export function registerCommands(
  context: vscode.ExtensionContext,
  webviewProvider: GitMeshWebviewProvider,
  outputChannel: vscode.OutputChannel
) {
  const openDashboardCommand = vscode.commands.registerCommand(
    'gitmesh.openDashboard',
    () => {
      outputChannel.appendLine('Opening GitMesh dashboard');
      webviewProvider.show();
    }
  );

  context.subscriptions.push(openDashboardCommand);
}
