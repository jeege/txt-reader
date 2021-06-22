// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
    ExtensionContext,
    commands,
    window,
    workspace,
    Uri,
    Location,
    Position,
    Range,
    TextEditorRevealType,
    ViewColumn,
    TextEditor,
    TextDocument,
	WebviewPanel,
} from 'vscode';
import { TxtListProvider } from './txtList';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { getContent, getWebviewContent, transNovelData } from './util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

interface Message {
	cmd: string, 
	cbid?: string,
	[propName: string]: any
}

export function activate({
    subscriptions,
    globalState,
    globalStorageUri,
    extensionPath,
}: ExtensionContext) {
    const novelPath: string = workspace.getConfiguration().get('txt-reader.filePath') || '';
    const txtListProvider = new TxtListProvider(novelPath);
	const invokeCallback = function(panel: WebviewPanel, message: Message, resp: any) {
		panel.webview.postMessage({cmd: 'vscodeCallback', cbid: message.cbid, data: resp});
	};

    subscriptions.push(window.registerTreeDataProvider('txt-reader-menu.list', txtListProvider));

    subscriptions.push(
        commands.registerCommand('txt-reader.openFile', async (filePath, fileName) => {
            const panel = window.createWebviewPanel(
                'novel',
                fileName,
                {
                    viewColumn: ViewColumn.One,
                },
                {
                    enableScripts: true,
                }
            );
			const novelContent = getContent(filePath);
			const novelData = transNovelData(novelContent);
			let index = (globalState.get(`${fileName}_chapter`) as number) || 0;
            panel.webview.html = getWebviewContent(extensionPath);
            panel.webview.onDidReceiveMessage((message) => {
				if (message.cmd === 'init') {
					if (message.page) {
						index = message.page;
					};
					invokeCallback(panel, message, novelData[index]);
				}
				if (message.cmd === 'left' && index > 0) {
					invokeCallback(panel, message, novelData[--index]);
				}
				if (message.cmd === 'right' && index < novelData.length - 1) {
					invokeCallback(panel, message, novelData[++index]);
				}
				if (message.cmd === 'getDirectory') {
					invokeCallback(panel, message, novelData.map(i => (i.subtitle || i.title)));
				}
            }, undefined, subscriptions);
			panel.onDidDispose(() => {
				globalState.update(`${fileName}_chapter`, index);
			});
        })
    );

    subscriptions.push(
        commands.registerCommand('txt-reader.refreshList', () => {
            txtListProvider.refresh();
        })
    );

    subscriptions.push(
        commands.registerCommand('txt-reader.settingPath', () => {
            window
                .showInputBox({
                    placeHolder: '设置文件夹路径',
                    validateInput: (value) => {
                        if (fs.existsSync(value)) {
                            return;
                        }
                        return '请输入合法的路径';
                    },
                })
                .then((path) => {
                    if (path) {
                        workspace.getConfiguration().update('txt-reader.filePath', path);
                        txtListProvider.setFilePath(path);
                        txtListProvider.refresh();
                    }
                });
        })
    );

    subscriptions.push(
        commands.registerCommand('txt-reader.openPath', () => {
            if (novelPath) {
                execSync(`open ${novelPath}`);
            } else {
                window.showErrorMessage('请先设置目录');
            }
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
