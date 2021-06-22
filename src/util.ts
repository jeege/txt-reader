import { Uri } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite';

interface NovelDataItem {
    title: string,
    subtitle?: string,
    content: string[]
}

export function getContent(filePath: string) {
    const buffer = fs.readFileSync(filePath);
    if (buffer[0] === 0xef && buffer[1] === 0xbb) {
        return Buffer.from(buffer).toString('utf-8');
    } else {
        return iconv.decode(buffer, 'GBK');
    }
}

export function transNovelData(data:string) {
    const titleReg = /(?<=\r\n)([第序]{1}.*?[章幕卷]{1}.*?)(?=\r\n)/g;
    let firstIndex = titleReg.lastIndex;
    let result = titleReg.exec(data);
    const novelData:NovelDataItem[] = [{title: '简介', content: []}];
    while(result) {
        const content = data.slice(firstIndex, result.index);
        if (!(/\S/.test(content))) {
            novelData[novelData.length - 1].subtitle = result[1];
        } else {
            novelData[novelData.length - 1].content = content.split('\n');
            novelData.push({
                title: result[1],
                content: []
            });
        }
        firstIndex = titleReg.lastIndex;
        result = titleReg.exec(data);
    }
    novelData[novelData.length - 1].content =  data.slice(firstIndex).split('\n');
    return novelData;
}

export function getWebviewContent(extensionPath: string) {
    const resourcePath = path.join(extensionPath, 'src/view/index.html');
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return (
            $1 +
            Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() +
            '"'
        );
    });
    return html;
}
