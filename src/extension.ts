import * as vscode from 'vscode';
import getChatGPT from './getChatGPT';
import { formatCodeForInsertion } from './utils/code';

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('gpilot.suggest', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found!');
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const cursorPosition = selection.active;
    const textBeforeCursor = document.getText(
      new vscode.Range(new vscode.Position(0, 0), cursorPosition)
    );
    const textAfterCursor = document.getText(
      new vscode.Range(cursorPosition, new vscode.Position(document.lineCount, 0))
    );

    const api = await getChatGPT();

    if (api) {
      const systemMessage = `I'll send you ${document.languageId} code. You should write the best replacement for placeholder {write code here} in the text. No explanations. Don't touch my code.`;
      const res = await api.sendMessage(`${textBeforeCursor}{write code here}${textAfterCursor}`, {
        systemMessage,
      });

      editor.edit(async (editBuilder) => {
        editBuilder.replace(selection, formatCodeForInsertion(res.text, textBeforeCursor));

        // format inserted text
        // const insertedText = res.text;
        // const range = new vscode.Range(
        //   cursorPosition.line,
        //   cursorPosition.character - textBeforeCursor.length,
        //   cursorPosition.line,
        //   cursorPosition.character + textAfterCursor.length
        // );
        // const formattedText = await vscode.commands.executeCommand<string>(
        //   'editor.action.format',
        //   editor.document.uri,
        //   range,
        //   insertedText
        // );

        // editBuilder.replace(selection, formattedText);
      });
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
