import { ChatGPTAPI } from 'chatgpt';
import * as vscode from 'vscode';

let chatGPT: ChatGPTAPI;

export default async function getChatGPT() {
  if (chatGPT) {
    return chatGPT;
  }

  // get apiKey from vs code config (gpilot.apiKey)
  // if there is no apiKey ask user to enter it ans save it to user config
  const config = vscode.workspace.getConfiguration('gpilot');
  let apiKey = config.get<string | undefined>('apiKey');

  if (!apiKey) {
    apiKey = await vscode.window.showInputBox({
      prompt: 'Please enter your ChatGPT API key (https://platform.openai.com/account/api-keys)',
    });

    if (apiKey) {
      config.update('apiKey', apiKey, true);
    }
  }

  if (!apiKey) {
    vscode.window.showErrorMessage('You need to provide ChatGPT API key');
    return undefined;
  }

  chatGPT = new ChatGPTAPI({ apiKey });

  return chatGPT;
}
