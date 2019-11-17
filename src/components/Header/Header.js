import React from "react";
import "./index.scss";
import BaseComponent from "../BaseComponent";

export default class Header extends BaseComponent {
    render() {
        return (
            <header className="ys-header">
                <h1>yun-share</h1>
            </header>
        );
    }
}
