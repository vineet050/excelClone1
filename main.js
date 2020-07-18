const {app,BrowserWindow} = require('electron');
const ejse = require('ejs-electron');

ejse.data({
    r : '100',
    c : '26'
})

app.whenReady().then(function(){
    const win = new BrowserWindow({
        width : 800,
        height : 600,
        slow : false,
        webPreferences : {
            nodeIntegration : true
        }
    });
    win.loadFile('index.ejs').then(function(){
        win.removeMenu();
        win.maximize();
        win.show();
        win.webContents.openDevTools();
    });
});