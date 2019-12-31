import React from "react";
import ReactDOM from "react-dom";
import BaseComponent from "../BaseComponent";
import "./index.scss";
import ButtonExt from "../Button";
import AutoBind from "../../utils/Autobind";
import { Modal, Input } from "antd";

export default class RightClickMenu extends BaseComponent {
    state = {
        display: "none",
        x: 0,
        y: 0,
        visible: false
    };

    fileName = null;

    @AutoBind
    show(map) {
        const { x, y } = map;
        this.setState({
            x,
            y,
            display: "block"
        });
    }

    @AutoBind
    hidden() {
        this.setState({ display: "none" });
    }

    @AutoBind
    newMdFile() {
        this.hidden();
        this.setState({ visible: true });
    }

    renderCore() {
        const { display, x = 0, y = 0 } = this.state;
        return (
            <div className="ys-right-click-modal" style={{ display }}>
                <div className="ys-right-click-bg" onClick={this.hidden}></div>
                <div className="ys-right-click-box" style={{ top: y, left: x }}>
                    <ButtonExt onClick={this.newMdFile}>新建md</ButtonExt>
                </div>
            </div>
        );
    }

    @AutoBind
    handleOk() {
        const name = this.fileName;
        window.electron.ipcRenderer.send("CREATE_FILE", { name });
    }

    @AutoBind
    handleCancel() {}

    @AutoBind
    getFileName(e) {
        this.fileName = e.target.value;
    }

    render() {
        return (
            <>
                {ReactDOM.createPortal(this.renderCore(), document.body)}
                <Modal title="新建" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Input addonBefore="文件名：" addonAfter=".md" onChange={this.getFileName} />
                </Modal>
            </>
        );
    }
}
