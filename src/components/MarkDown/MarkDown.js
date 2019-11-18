import React from "react";
import BaseComponent from "../BaseComponent";
import ReactMarkdown from "react-markdown";
import { Controlled as CodeMirror } from "react-codemirror2";
import AutoBind from "../../utils/Autobind";
// import DecoratorUtils from "../../utils/DecoratorUtils";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/markdown/markdown.js");
require("./index.scss");

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
    onBeforeChange(m, d, value) {
        this.setState({ value });
    }

    @AutoBind
    onKeydown(m, e) {
        console.log(`code: ${e.code}, key:${e.key}, ctrlKey: ${e.ctrlKey}, e.keycode: ${e.keyCode}`);
        if (e.ctrlKey && e.keyCode === 83) {
            e.stopPropagation();
            e.preventDefault();
            console.log("save");
        }
    }

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
                        autoCloseTags: true
                    }}
                    onScroll={this.editScroll}
                    onBeforeChange={this.onBeforeChange}
                    onKeyDown={this.onKeydown}
                />
                <div
                    className="ys-react-md s"
                    ref={ref => {
                        this.mdbox = ref;
                    }}
                >
                    <ReactMarkdown source={this.state.value} />
                </div>
            </div>
        );
    }
}
