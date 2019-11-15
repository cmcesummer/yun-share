const { app, BrowserWindow } = require("electron");
const path = require("path");

const DEV_ENV = process.env.NODE_ENV === "development";

// 开发时开启debug
const debug = DEV_ENV === true;

const loadUrl = DEV_ENV ? "http://localhost:3002/" : path.join("file://", __dirname, "/build/index.html");

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 950,
        height: 700,
        backgroundColor: "#021524"
    });
    mainWindow.loadURL(loadUrl);
    //接收渲染进程的信息
    const ipc = require("electron").ipcMain;
    ipc.on("min", function() {
        mainWindow.minimize();
    });
    ipc.on("max", function() {
        mainWindow.maximize();
    });
    ipc.on("login", function() {
        mainWindow.maximize();
    });
    //如果是--debug 打开开发者工具，窗口最大化，
    if (debug) {
        mainWindow.webContents.openDevTools();
        // require("devtron").install();
    }

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.setDocumentEdited(true);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
// makeSingleInstance();

//app主进程的事件和方法
app.on("ready", () => {
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
module.exports = mainWindow;
