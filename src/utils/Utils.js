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
}
