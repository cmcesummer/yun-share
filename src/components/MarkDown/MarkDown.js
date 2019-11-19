import React from "react";
import BaseComponent from "../BaseComponent";
import ReactMarkdown from "react-markdown";
import { Controlled as CodeMirror } from "react-codemirror2";
import AutoBind from "../../utils/Autobind";
// import DecoratorUtils from "../../utils/DecoratorUtils";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";

import "./index.scss";
// import { sendFile } from "../../utils/http";

const htmlParser = require("react-markdown/plugins/html-parser");
const parseHtml = htmlParser({
    isValidNode: node => node.type !== "script"
});

document.addEventListener("drop", e => {
    e.preventDefault();
});

export default class MarkDown extends BaseComponent {
    state = {
        value: ""
    };

    @AutoBind
    editScroll(e, pos) {
        const { height, top } = pos;
        const scrollP = top / height;
        const scrollTop = this.mdbox.scrollHeight * scrollP;
        this.mdbox.scrollTop = scrollTop;
    }

    @AutoBind
    onBeforeChange(e, d, value) {
        this.setState({ value });
    }

    @AutoBind
    save(e) {
        console.log("save", e);
    }

    onPaste(e, d) {
        const clipboardData = d.clipboardData;
        if (!clipboardData) return;
        const items = clipboardData.items;
        if (!items || items.length === 0) return;
        for (let i = 0; i < clipboardData.types.length; i++) {
            if (clipboardData.types[i] !== "Files") continue;
            const item = items[i];
            if (!item || item.kind !== "file" || !item.type.match(/^image\//i)) continue;
            console.log(item.getAsFile());
            // 粘贴拦截并上传图片后添加到内容中 等接口
            // const { line, ch } = e.doc.getCursor();
            // sendFile({ url: "xxx", file: item.getAsFile() })
            //     .then(res => {
            //         e.doc.replaceRange(` ![](${res.url}) `, { line, ch });
            //     })
            //     .catch(e => window.alert(`error:`, JSON.stringify(e)));
        }
    }

    onDragOver = (m, e) => {
        e.preventDefault();
    };
    onDragLeave = (m, e) => {
        e.preventDefault();
    };
    onDrop = (m, e) => {
        e.preventDefault();
        const fileList = e.dataTransfer.files;
        const len = fileList.length;
        if (!len) return;
        // 拖拽图片后上传并添加到内容中 等接口
        // for (const file of fileList) {
        //     if (!file.type.match(/^image\//i)) continue;
        //     const { line, ch } = m.doc.getCursor();
        //     sendFile({ url: "xxx", file })
        //         .then(res => {
        //             e.doc.replaceRange(` ![](${res.url}) `, { line, ch });
        //         })
        //         .catch(e => window.alert(`error:`, JSON.stringify(e)));
        // }
    };

    render() {
        const { showEdit = false } = this.props;
        return (
            <div className={`ys-md-box ${showEdit ? "ys-md-show-e" : ""}`}>
                <CodeMirror
                    value={this.state.value}
                    className="ys-codemirror"
                    options={{
                        mode: "markdown",
                        theme: "material",
                        lineNumbers: true,
                        autoCloseTags: true,
                        extraKeys: {
                            // todo: 测试 Ctrl-S 在mac上是否生效
                            "Ctrl-S": this.save
                        }
                    }}
                    onScroll={this.editScroll}
                    onBeforeChange={this.onBeforeChange}
                    onPaste={this.onPaste}
                />
                <div
                    className="ys-react-md"
                    ref={ref => {
                        this.mdbox = ref;
                    }}
                >
                    <ReactMarkdown source={this.state.value} skipHtml={false} escapeHtml={false} astPlugins={[parseHtml]} />
                </div>
            </div>
        );
    }
}
