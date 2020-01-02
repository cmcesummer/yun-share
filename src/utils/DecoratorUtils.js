import Utils from "./Utils";

/**
 * DecoratorUtils 类
 */

export default class DecoratorUtils {
    static execTimesLimit(times = 1) {
        let flag = 0;
        return function(target, key, describe) {
            const method = describe.value;
            describe.value = function() {
                if (times <= flag) return;
                flag++;
                method.call(this);
            };
        };
    }

    static throttleDecorator(time = 300) {
        return function(target, key, descriptor) {
            const method = descriptor.value;
            return {
                configurable: true,
                get() {
                    return Utils.throttle(method, time, this);
                }
            };
        };
    }
}
