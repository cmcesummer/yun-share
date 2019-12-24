const ipc = require("electron").ipcMain;

ipc.on("write", (e, arg) => {
    console.log(e, arg);
});
