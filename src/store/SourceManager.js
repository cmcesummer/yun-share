import AutoBind from "../utils/Autobind";

export default class SourceManager {
    stroage = {};

    listener = {};

    @AutoBind
    getValue(sname) {
        if (!sname) return this.stroage;
        return this.stroage[sname];
    }

    @AutoBind
    setValue(name, value, fire = true) {
        this.stroage[name] = value;
        const listener = this.listener[name];
        if (fire && Array.isArray(listener)) {
            for (const fn of listener) {
                fn(value);
            }
        }
    }

    @AutoBind
    addListener(name, fn) {
        const listener = this.listener[name];
        if (!Array.isArray(listener)) {
            this.listener[name] = [fn];
        } else {
            listener.push(fn);
        }
        return () => {
            this.removeListener(name, fn);
        };
    }

    @AutoBind
    removeAllListener(name) {
        this.listener[name] = null;
    }

    @AutoBind
    removeListener(name, fn) {
        const listener = this.listener[name];
        if (Array.isArray(listener)) {
            for (let i = 0; i < listener.length; i++) {
                if (listener[i] === fn) {
                    listener.splice(i, 1);
                    break;
                }
            }
        }
    }
}
