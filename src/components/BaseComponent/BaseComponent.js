import React from "react";
import AutoBind from "../../utils/Autobind";

function componentDataCompare(thisProps, nextProps) {
    thisProps = thisProps === null ? {} : thisProps;
    nextProps = nextProps === null ? {} : nextProps;
    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
        return true;
    }
    for (const key in nextProps) {
        if (typeof thisProps[key] !== "function" && thisProps[key] !== nextProps[key]) {
            return true;
        }
    }
    return false;
}

export default class BaseComponent extends React.Component {
    _lifesEnd = [];

    shouldComponentUpdate(nextprops, nextstate) {
        if (componentDataCompare(this.props, nextprops)) {
            return true;
        }
        if (componentDataCompare(this.state, nextstate)) {
            return true;
        }
        return false;
    }

    componentDidCatch(err, info) {
        return false;
    }

    componentWillUnmount() {
        for (const fn of this._lifesEnd) {
            fn();
        }
    }

    @AutoBind
    setTimeout(callback, delay) {
        const timer = window.setTimeout(() => {
            callback();
        }, delay);
        this.lifesEndPush(() => {
            window.clearTimeout(timer);
        });
    }

    @AutoBind
    setInterval(callback, delay) {
        const timer = window.setInterval(() => {
            callback();
        }, delay);
        this.lifesEndPush(() => {
            window.clearInterval(timer);
        });
    }

    lifesEndPush(fn) {
        this._lifesEnd.push(fn);
    }

    render() {
        return null;
    }
}
