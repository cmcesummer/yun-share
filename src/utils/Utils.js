/**
 * 工具类
 */

export default class Utils {
    static throttle(fn, time, context) {
        let timer = null;
        return function(...arg) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                if (context) {
                    fn.call(context, ...arg);
                } else {
                    fn(...arg);
                }
            }, time);
        };
    }

    // 筛选粘贴内容中的image文件
    static findPasteImage(clipboardData) {
        if (!clipboardData) return;
        const items = clipboardData.items;
        if (!items || items.length === 0) return;
        const fileList = [];
        for (let i = 0; i < clipboardData.types.length; i++) {
            if (clipboardData.types[i] !== "Files") continue;
            const item = items[i];
            if (item.kind !== "file" || !item.type.match(/^image\//i)) continue;
            fileList.push(item.getAsFile());
        }
        return fileList;
    }
}
