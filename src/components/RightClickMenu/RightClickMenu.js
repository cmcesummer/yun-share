import React from "react";
import BaseComponent from "../BaseComponent";
import "./index.scss";

export default class RightClickMenu extends BaseComponent {
    state = {
        display: "none",
        x: 0,
        y: 0
    };
    show = map => {
        const { x, y } = map;
        this.setState({
            x,
            y,
            display: "block"
        });
    };
    render() {
        const { display, x = 0, y = 0 } = this.state;
        return (
            <div className="ys-right-click-box" style={{ top: y, left: x, display }}>
                a
            </div>
        );
    }
}
