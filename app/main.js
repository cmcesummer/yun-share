const { app, BrowserWindow } = require("electron");
const { format } = require("url");
const path = require("path");
const ctrlWin = require("./mainThread/ctrlWin");
require("./mainThread/rpc");
require("./mainThread/global");

const DEV_ENV = process.env.NODE_ENV === "development";

// 开发时开启debug
const debug = DEV_ENV === true;

const loadUrl = DEV_ENV
    ? "http://localhost:3002/"
    : format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file",
          slashes: true
      });
//   path.join("file://", __dirname, "/build/index.html");

let mainWindow = null;

function createWindow() {
    const options = {
        width: 1000,
        height: 700,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        show: false, // 创建后是否显示
        frame: true, // 是否创建frameless窗口
        center: true, // 是否出现在屏幕居中的位置
        fullscreenable: true, // 是否允许全屏
        resizable: true, // 是否允许拉伸大小
        title: "yun-share",
        vibrancy: "ultra-dark", // 窗口模糊的样式（仅macOS）
        transparent: true, // 是否是透明窗口（仅macOS）
        titleBarStyle: "hidden", // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
        hasShadow: true,
        webPreferences: {
            backgroundThrottling: false, // 当页面被置于非激活窗口的时候是否停止动画和计时器
            nodeIntegration: true
        }
    };
    if (process.platform === "win32") {
        // 针对windows平台做出不同的配置
        options.transparent = false;
        options.show = true; // 创建即展示
        options.frame = false; // 创建一个frameless窗口
        options.backgroundColor = "rgba(255, 255, 255, 0.9)"; // 背景色
    }

    mainWindow = new BrowserWindow(options);
    mainWindow.loadURL(loadUrl);

    //如果是--debug 打开开发者工具，窗口最大化，
    if (debug) {
        mainWindow.webContents.openDevTools();
        // require("devtron").install();
    }

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.on("show", () => {
        console.log("show");
    });

    mainWindow.setDocumentEdited(true);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
// makeSingleInstance();

// console.log(`=====`, app.getPath("userData"));

//app主进程的事件和方法
app.on("ready", () => {
    createWindow();
    // 处理窗口事件
    ctrlWin(mainWindow, app);
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
