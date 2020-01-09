import React from "react";
import { Icon } from "antd";
import BaseComponent from "../components/BaseComponent";
import bind from "../Hoc/bind";

const { ipcRenderer } = require("electron");

@bind("Header", { loading: false })
class Header extends BaseComponent {
    close() {
        ipcRenderer.send("win-close");
    }

    max() {
        ipcRenderer.send("win-max");
    }

    min() {
        ipcRenderer.send("win-min");
    }

    debug() {
        ipcRenderer.send("win-debug-panel");
    }

    render() {
        const { loading = true } = this.props;
        return (
            <header className="ys-header un-text">
                <h1>yun-share</h1>
                {loading ? <Icon type="loading" /> : null}
                <div className="ctrl-win-box">
                    <div className="bug" onClick={this.debug}>
                        <Icon type="bug" />
                    </div>
                    <div className="min" onClick={this.min}>
                        <Icon type="minus" />
                    </div>
                    {/* <div className="max" onClick={this.max}>
                        <Icon type="fullscreen" />
                    </div> */}
                    <div className="close" onClick={this.close}>
                        <Icon type="close" className="icon" />
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
