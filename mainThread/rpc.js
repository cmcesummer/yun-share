const path = require("path");
const ipc = require("electron").ipcMain;
const { app } = require("electron");
const fs = require("fs-extra");

const { timeFormat } = require("../common/common");

const FILE_DIR = path.join(app.getPath("userData"), "./userFile");

fs.ensureDir(FILE_DIR);

// 新建文件
ipc.on("CREATE_FILE", async (e, arg) => {
    const { name } = arg;
    const rev = await fs.exists(path.join(FILE_DIR, name));
    console.log(e, rev);
    if (!rev) {
        await fs.writeFile(path.join(FILE_DIR, name), "", "utf8");
        e.sender.send("CREATE_FILE_BACK", { REV: true });
    } else {
        e.sender.send("CREATE_FILE_BACK", { REV: false, MSG: "存在同名文件" });
    }
});

exports.SAVE_FILE_DIR = FILE_DIR;

const GET_FILE_LIST_BACK = "GET_FILE_LIST_BACK";

// 获取列表
ipc.on("GET_FILE_LIST", async (ev, arg) => {
    try {
        const fileArray = await fs.readdir(FILE_DIR);
        const arr = [];
        for (const file of fileArray) {
            const dir = path.join(FILE_DIR, file);
            const stat = await fs.stat(dir);
            const time = timeFormat(Math.floor(stat.mtimeMs), "MM-dd");
            const filename = file.replace(path.extname(file), "");
            arr.push({ dir, time, title: filename });
            ev.sender.send(GET_FILE_LIST_BACK, { REV: true, DATA: arr });
        }
    } catch (e) {
        ev.sender.send(GET_FILE_LIST_BACK, { REV: false, MSG: "获取列表出错" });
        console.log(e);
    }
});

// 获取内容
ipc.on("GET_FILE_CONTENT", async (ev, arg) => {
    const { dir } = arg;
    try {
        const content = await fs.readFile(dir, "utf8");
        ev.sender.send("GET_FILE_CONTENT_BACK", { REV: true, DATA: { ...arg, content } });
    } catch (e) {
        ev.sender.send("GET_FILE_CONTENT_BACK", { REV: false, MSG: "获取内容出错" });
        console.log(e);
    }
});
