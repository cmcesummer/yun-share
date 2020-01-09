const databaseName = "YUN_SHARE_DB";
const dbVersion = 1;
const request = window.indexedDB.open(databaseName, dbVersion);

let db = null;

request.onerror = function(event) {
    window.alert("本地存储打开出错");
};

request.onsuccess = function(event) {
    db = request.result;
    // console.log("数据库打开成功", db);
};

const TABLE_NAME = "localList";

const WRITABLE = {
    read: "readonly",
    readwrite: "readwrite"
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(TABLE_NAME, { autoIncrement: true });
    objectStore.createIndex("title", "title", { unique: true });
    objectStore.createIndex("sid", "sid", { unique: true });
};

export function add(value) {
    const request = db
        .transaction([TABLE_NAME], WRITABLE.readwrite)
        .objectStore(TABLE_NAME)
        .add(value);

    return new Promise((res, rej) => {
        request.onsuccess = function(event) {
            res(event);
        };
        request.onerror = function(event) {
            rej(event);
        };
    });
}

// setTimeout(() => {
//     add({ title: "aaa" })
//         .then(_ => {
//             console.log(`add success`);
//         })
//         .catch(_ => {
//             console.log(_);
//         });
// }, 1000);
