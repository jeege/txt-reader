(function(){
    const vscode = acquireVsCodeApi();
    const callbacks = {};
    window.callVscode = function(data, cb) {
        if (typeof data === 'string') {
            data = {cmd: data};
        }
        if (cb) {
            const cbid = `${Date.now()}${Math.round(Math.random() * 100000)}`;
            callbacks[cbid] = cb;
            data.cbid = cbid;
        }
        vscode.postMessage(data);
    };
    window.addEventListener('message', e => {
        const message = e.data;
        switch(message.cmd) {
            case 'vscodeCallback': 
                (callbacks[message.cbid] || function() {})(message.data);
                delete callbacks[message.cbid];
                break;
            default: break;
        }
    });
})();