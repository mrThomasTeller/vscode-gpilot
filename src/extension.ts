import * as vscode from 'vscode';
import getChatGPT from './getChatGPT';
import { formatCodeForInsertion } from './utils/code';
import isProgrammingLanguage from './utils/isProgrammingLanguage';
import logger from './logger';

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
      const programmingLanguage = isProgrammingLanguage(document.languageId, textBeforeCursor);
      const contentName = programmingLanguage ? 'code' : 'text';

      let systemMessage = `I'll send you ${document.languageId} ${contentName}. You should write the best replacement for placeholder {write ${contentName} here} in the text.`;
      if (programmingLanguage) {
        systemMessage += " No explanations. Don't touch my code.";
      }

      const requestText = `${textBeforeCursor}{write ${contentName} here}${textAfterCursor}`;
      const res = await api.sendMessage(requestText, { systemMessage });

      logger.info(`systemMessage: ${systemMessage}`);
      logger.info(`request: ${requestText}`);
      logger.info(`response: ${res.text}`);

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
