const { SAVE_FILE_DIR } = require("./rpc");

global.SAVE_FILE_DIR = SAVE_FILE_DIR;

global.APP_PLATFORM_WINDOWS = process.platform === "win32";
