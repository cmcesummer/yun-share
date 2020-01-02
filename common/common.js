exports.timeFormat = function(time, fmt) {
    const date = new Date(Number(time) < 10000000000 ? Number(time) * 1000 : Number(time)); //对于只有10位数的时间做*1000处理
    const o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    const week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    }
    return fmt;
};
