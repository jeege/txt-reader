import {
    Event,
    EventEmitter,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Uri,
    window,
} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class TxtListProvider implements TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: EventEmitter<TreeItem | undefined | void> = new EventEmitter<
        TreeItem | undefined | void
    >();
    readonly onDidChangeTreeData: Event<TreeItem | undefined | void> =
        this._onDidChangeTreeData.event;
    constructor(private filePath: string) {}
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element: TreeItem): TreeItem {
        return element;
    }
    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        return Promise.resolve(this.getTxtList());
    }
    setFilePath(path: string) {
        this.filePath = path;
    }
    private getTxtList() {
        try {
            const list = fs.readdirSync(this.filePath);
            return list
                .filter((i) => i.endsWith('.txt'))
                .map((i) => {
                    const item = new TreeItem(i.slice(0, -4), TreeItemCollapsibleState.None);
                    item.command = {
                        title: 'open',
                        command: 'txt-reader.openFile',
                        arguments: [path.join(this.filePath, i), i.slice(0, -4)],
                    };
                    return item;
                });
        } catch (error) {
            return [];
        }
    }
}
