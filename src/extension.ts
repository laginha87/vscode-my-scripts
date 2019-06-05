"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { mkdirSync, existsSync, copyFileSync, readdirSync, readFileSync } from 'fs';

import { join } from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  const scriptsPath = join((<any>context).globalStoragePath, 'scripts');

  if (!existsSync(scriptsPath)) {
    mkdirSync((<any>context).globalStoragePath);
    mkdirSync(scriptsPath);
    copyFileSync(join(context.extensionPath, 'samples', 'sample.rb'), join(scriptsPath, 'sample.rb'));
  }



  console.log('Congratulations, your extension "my-scripts" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  let disposable = vscode.commands.registerCommand('myScripts.openScript', async () => {
    const scripts = readdirSync(scriptsPath);
    const file = await vscode.window.showQuickPick(scripts, { canPickMany: false });

    if (file === undefined) {
      return;
    }

    const f = await vscode.workspace.openTextDocument(join(scriptsPath, file));


    let content = readFileSync(join(scriptsPath, file)).toString();

    vscode.workspace
        .openTextDocument({ content, language: f.languageId })
        .then(e => {
          vscode.window.showTextDocument(e).then(editor => {
            const position = new vscode.Position(e.lineCount + 1, 0);
            editor.selection = new vscode.Selection(position, position);
          });
        });
  });

  disposable = vscode.commands.registerCommand('myScripts.openMyScripts', async () => {
    let uri = vscode.Uri.file(scriptsPath);
    return vscode.commands.executeCommand('vscode.openFolder', uri);
  });

  disposable = vscode.commands.registerCommand(
    "myScripts.openRubyScript",
    () => {
      // The code you place here will be executed every time your command is executed
      let content = `
def copy(text)
    IO.popen('pbcopy', 'w') {|f| f << text}
end

class Array
    def to_c
        copy map(&:to_s).join("\\n")
    end
end

class String
    def to_c
        copy self
    end
end
`;

      vscode.workspace
        .openTextDocument({ content, language: "ruby" })
        .then(e => {
          vscode.window.showTextDocument(e).then(editor => {
            const position = new vscode.Position(e.lineCount + 1, 0);
            editor.selection = new vscode.Selection(position, position);
          });
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
