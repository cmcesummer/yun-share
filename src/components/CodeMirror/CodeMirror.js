import React from "react";
import BaseComponent from "../BaseComponent";
import { Controlled } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";
import AutoBind from "../../utils/Autobind";
import { sendFile } from "../../utils/http";

function upImage({ url, file, codem }) {
    const { line, ch } = codem.doc.getCursor();
    sendFile({ url, file })
        .then(res => codem.doc.replaceRange(` ![](${res.url}) `, { line, ch }))
        .catch(er => window.alert(`error:`, JSON.stringify(er)));
}

export default class CodeMirror extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || ""
        };
    }

    @AutoBind
    onChange(e, d, value) {
        this.setState({ value });
        const { onChange } = this.props;
        if (onChange) onChange(value);
    }

    @AutoBind
    save(e) {
        const { onSave } = this.props;
        if (onSave) onSave(e);
    }

    @AutoBind
    onPaste(e, d) {
        const { actionUrl, onPaste } = this.props;
        if (onPaste) onPaste(e, d);
        if (!actionUrl) return;
        const clipboardData = d.clipboardData;
        if (!clipboardData) return;
        const items = clipboardData.items;
        if (!items || items.length === 0) return;
        for (let i = 0; i < clipboardData.types.length; i++) {
            if (clipboardData.types[i] !== "Files") continue;
            const item = items[i];
            if (!item || item.kind !== "file" || !item.type.match(/^image\//i)) continue;
            // 粘贴拦截并上传图片后添加到内容中 等接口
            upImage({ url: actionUrl, file: item.getAsFile(), codem: e });
        }
    }

    stopDrag(m, e) {
        e.preventDefault();
    }

    @AutoBind
    onDrop(m, e) {
        e.preventDefault();
        const { actionUrl, onDrop } = this.props;
        if (onDrop) onDrop(m, e);
        if (!actionUrl) return;
        const fileList = e.dataTransfer.files;
        const len = fileList.length;
        if (!len) return;
        for (const file of fileList) {
            if (!file.type.match(/^image\//i)) continue;
            // 拖拽图片后上传并添加到内容中 等接口
            upImage({ url: actionUrl, file, codem: m });
        }
    }

    render() {
        const { className, mode = "markdown", theme = "material", onScroll = () => {} } = this.props;
        return (
            <Controlled
                value={this.state.value}
                className={className}
                options={{
                    mode,
                    theme,
                    lineNumbers: true,
                    autoCloseTags: true,
                    extraKeys: {
                        // todo: 测试 Ctrl-S 在mac上是否生效
                        "Ctrl-S": this.save
                    }
                }}
                onScroll={onScroll}
                onBeforeChange={this.onChange}
                onPaste={this.onPaste}
                onDragOver={this.stopDrag}
                onDragLeave={this.stopDrag}
                onDrop={this.onDrop}
            />
        );
    }
}
