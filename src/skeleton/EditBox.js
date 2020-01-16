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
            if (!REV) {
                alert("本地保存出错");
                return;
            }
            setTimeout(() => {
                this.showLoad(false);
            }, 1000);
        });
    }

    @AutoBind
    showLoad(loading) {
        this.props.setValue("Header", { loading });
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
    changeEdit(flag) {
        // 上传的时候禁止出界面到其他地方
        if (this.upFileFlag) return;
        const showEdit = flag === true ? flag : this.state.showEdit;
        this.setState({ showEdit: !showEdit });
        this.props.setValue("FileList", { isHidden: !showEdit });
        if (showEdit) {
            console.log(`save`);
            this.md.onSave();
        }
    }

    cacheFileValue = "";

    @AutoBind
    onSave(value) {
        // 本地保存成文件
        if (this.cacheFileValue !== value) {
            this.showLoad(true);
            this.cacheFileValue = value;
            ipcRenderer.send("SET_FILE_CONTENT", { ...this.props.fileInfo, content: value });
        }
    }

    // 上传锁
    upFileFlag = false;
    @AutoBind
    upFile() {
        if (this.upFileFlag) return;
        this.upFileFlag = true;
        this.showLoad(true);
        console.log(this.props.fileInfo);
        setTimeout(() => {
            this.changeEdit(true);
            this.showLoad(false);
            this.upFileFlag = false;
        }, 5000);
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
            <section className={`eidtbox ${showEdit ? "eidt-full" : ""}`}>
                <div className="eidtbox-topbar">{this.props.fileInfo && this.props.fileInfo.title}</div>
                <div className="eidtbox-body">
                    <MarkDown
                        ref={ref => (this.md = ref)}
                        showEdit={showEdit}
                        onSave={this.onSave}
                        value={this.props.fileInfo && this.props.fileInfo.content}
                    />
                    <div className="eidtbox-ctrlbar un-text">
                        <ButtonExt onClick={this.changeEdit} ant>
                            {showEdit ? `预览` : `编辑`}
                        </ButtonExt>
                        <ButtonExt onClick={this.saveToHtml} ant>
                            导出
                        </ButtonExt>
                        {showEdit ? (
                            <ButtonExt onClick={this.upFile} ant>
                                上传
                            </ButtonExt>
                        ) : null}
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
