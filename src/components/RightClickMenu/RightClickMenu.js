import React from "react";
import ReactDOM from "react-dom";
import BaseComponent from "../BaseComponent";
import "./index.scss";
import ButtonExt from "../Button";
import AutoBind from "../../utils/Autobind";
import { Modal, Input } from "antd";
const { ipcRenderer, remote } = require("electron");

const CREATE_FILE = "CREATE_FILE";

export default class RightClickMenu extends BaseComponent {
    state = {
        display: "none",
        x: 0,
        y: 0,
        visible: false,
        msg: ""
    };

    constructor(props) {
        super(props);
        ipcRenderer.on(`${CREATE_FILE}_BACK`, (e, arg) => {
            const { REV, MSG } = arg;
            if (!REV) {
                this.setState({ msg: MSG });
            } else {
                this.handleCancel();
            }
        });
    }

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
        if (!name) return this.setState({ msg: "请填写文件名称" });
        ipcRenderer.send(CREATE_FILE, { name: `${name}.md` });
    }

    @AutoBind
    handleCancel() {
        this.setState({ visible: false, msg: "" });
        this.fileName = null;
    }

    @AutoBind
    getFileName(e) {
        this.fileName = e.target.value;
    }

    render() {
        return (
            <>
                {ReactDOM.createPortal(this.renderCore(), document.body)}
                <Modal className="ys-create-file-modal" title="新建" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Input addonBefore="文件名：" addonAfter=".md" onChange={this.getFileName} />
                    <span className="ys-create-file-msg">{this.state.msg}</span>
                    <span className="ys-create-file-path">注：存储路径{remote.getGlobal("SAVE_FILE_DIR")}</span>
                </Modal>
            </>
        );
    }
}
