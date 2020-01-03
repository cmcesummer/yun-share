const path = require("path");
const ipc = require("electron").ipcMain;
const { app, dialog } = require("electron");
const fs = require("fs-extra");

const { timeFormat, renderMToHtml } = require("../common/common");

const FILE_DIR = path.join(app.getPath("userData"), "./userFile");

fs.ensureDir(FILE_DIR);

// 新建文件
ipc.on("CREATE_FILE", async (e, arg) => {
    const { name } = arg;
    const rev = await fs.exists(path.join(FILE_DIR, name));
    if (!rev) {
        await fs.writeFile(path.join(FILE_DIR, name), "", "utf8");
        e.sender.send("CREATE_FILE_BACK", { REV: true });
    } else {
        e.sender.send("CREATE_FILE_BACK", { REV: false, MSG: "存在同名文件" });
    }
});

// 删除文件
ipc.on("DELETE_FILE", async (e, arg) => {
    const { dir } = arg;
    await fs.unlink(dir);
    e.sender.send("DELETE_FILE_BACK", { REV: true });
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

// 保存文件、写入内容
ipc.on("SET_FILE_CONTENT", async (ev, arg) => {
    const { dir, content } = arg;
    try {
        await fs.writeFile(dir, content, "utf8");
        ev.sender.send("SET_FILE_CONTENT_BACK", { REV: true });
    } catch (e) {
        ev.sender.send("SET_FILE_CONTENT_BACK", { REV: false, MSG: "写入内容出错" });
        console.log(e);
    }
});

// 弹出保存文件路径对话框
ipc.on("SAVE_TO_HTML_DIALOG", async (ev, arg) => {
    const { title, html } = arg;
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: "保存文件",
        filters: [
            { name: "Html", extensions: ["html"] },
            { name: "All Files", extensions: ["*"] }
        ],
        defaultPath: `${title}.html`
    });
    if (canceled) {
        ev.sender.send("SAVE_TO_HTML_DIALOG_BACK", { REV: false, MSG: "取消", CODE: -1 });
        return;
    }
    await fs.writeFile(filePath, renderMToHtml(title, html), "utf8");
    ev.sender.send("SAVE_TO_HTML_DIALOG_BACK", { REV: true });
});
