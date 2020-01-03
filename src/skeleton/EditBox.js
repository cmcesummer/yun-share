import React from "react";
import BaseComponent from "../components/BaseComponent";
import MarkDown from "../components/MarkDown/MarkDown";
import bind from "../Hoc/bind";
import AutoBind from "../utils/Autobind";
import { ContainerStoreName } from "../utils/constant";
import ButtonExt from "../components/Button";

const { ipcRenderer } = require("electron");

@bind(ContainerStoreName)
class EditBox extends BaseComponent {
    state = {
        showEdit: false,
        title: ""
    };

    constructor(props) {
        super(props);
        ipcRenderer.on("SET_FILE_CONTENT_BACK", async (ev, arg) => {
            const { REV } = arg;
            if (!REV) return;
            setTimeout(() => {
                this.props.setValue("Header", { loading: false });
            }, 1000);
        });
    }

    static getDerivedStateFromProps(np, ls) {
        const { fileInfo } = np;
        if (fileInfo) {
            const pt = fileInfo.title;
            const st = ls.title;
            if (pt !== st) {
                return { showEdit: false, title: pt };
            }
        }
        return ls;
    }

    @AutoBind
    changeEdit() {
        this.setState({ showEdit: !this.state.showEdit });
        if (this.state.showEdit) {
            console.log(`save`);
            this.md.onSave();
        }
    }

    cacheFileValue = "";

    @AutoBind
    onSave(value) {
        // 本地保存成文件
        if (this.cacheFileValue !== value) {
            this.props.setValue("Header", { loading: true });
            console.log(value);
            this.cacheFileValue = value;
            ipcRenderer.send("SET_FILE_CONTENT", { ...this.props.fileInfo, content: value });
        }
    }

    @AutoBind
    saveToHtml() {
        const html = this.md.innerHtml();
        if (!html) return;
        ipcRenderer.send("SAVE_TO_HTML_DIALOG", { title: this.props.fileInfo.title, html });
    }

    renderCore() {
        const { showEdit } = this.state;
        return (
            <section className="eidtbox">
                <div className="eidtbox-topbar">{this.props.fileInfo && this.props.fileInfo.title}</div>
                <div className="eidtbox-body">
                    {console.log(this.props.fileInfo && this.props.fileInfo.content)}
                    <MarkDown
                        ref={ref => (this.md = ref)}
                        showEdit={showEdit}
                        onSave={this.onSave}
                        value={this.props.fileInfo && this.props.fileInfo.content}
                    />

                    <div className="eidtbox-ctrlbar">
                        <ButtonExt onClick={this.changeEdit} ant>
                            {showEdit ? `预览` : `编辑`}
                        </ButtonExt>
                        <ButtonExt onClick={this.saveToHtml} ant>
                            导出
                        </ButtonExt>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        return this.props.fileInfo ? this.renderCore() : null;
    }
}

export default EditBox;
