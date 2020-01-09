/**
 * 处理窗口事件
 */

const path = require("path");
const ipc = require("electron").ipcMain;
const { Tray, Menu } = require("electron");

const DEV_ENV = process.env.NODE_ENV === "development";

let tray = null;

module.exports = function(mainWindow, app) {
    ipc.on("win-min", function() {
        mainWindow.minimize();
    });
    ipc.on("win-max", function() {
        mainWindow.maximize();
    });
    ipc.on("win-unmax", function() {
        mainWindow.unmaximize();
    });
    ipc.on("win-close", function() {
        // mainWindow.close();
        mainWindow.hide();
        // mainWindow.minimize();
        // mainWindow.setSkipTaskbar(true);
    });
    ipc.on("win-debug-panel", function() {
        mainWindow.webContents.openDevTools();
    });

    mainWindow.on("close", event => {
        mainWindow.hide();
        event.preventDefault();
    });

    /**
     * 托盘相关
     */
    const STATIC = DEV_ENV ? path.join(__dirname, "../../public/") : path.join(__dirname, "../");

    const IMAGE = process.platform === "darwin" ? path.join(STATIC, "mac16x16.png") : path.join(STATIC, "icon.ico");
    tray = new Tray(IMAGE);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "退出",
            click: () => {
                mainWindow.destroy();
                app.quit();
                // mainWindow.close();
            }
        }
    ]);
    tray.setToolTip("yun-share");
    tray.setContextMenu(contextMenu);
    tray.on("click", () => {
        process.nextTick(() => {
            mainWindow.show();
            // mainWindow.setSkipTaskbar(false);
        });
    });
};
