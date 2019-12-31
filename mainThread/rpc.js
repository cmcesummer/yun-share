const path = require("path");
const ipc = require("electron").ipcMain;
const { app } = require("electron");
const fs = require("fs-extra");

const FILE_DIR = path.join(app.getPath("userData"), "./userFile");

fs.ensureDir(FILE_DIR);

ipc.on("CREATE_FILE", async (e, arg) => {
    console.log(e, arg);
    // fs.exists(path.join(FILE_DIR));
});
