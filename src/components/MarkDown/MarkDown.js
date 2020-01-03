import React from "react";
import BaseComponent from "../BaseComponent";
import ReactMarkdown from "react-markdown";
import CodeMirror from "./../CodeMirror";
import AutoBind from "../../utils/Autobind";
// import DecoratorUtils from "../../utils/DecoratorUtils";
import "./index.scss";
import IF from "../IF";
// import { sendFile } from "../../utils/http";

const htmlParser = require("react-markdown/plugins/html-parser");
const parseHtml = htmlParser({
    isValidNode: node => node.type !== "script"
});

export default class MarkDown extends BaseComponent {
    constructor(props) {
        super(props);
        const { value = "" } = props;
        this.state = { value, defaultValue: value };
    }

    componentDidUpdate(lp, ls) {
        const { value } = this.props;
        if (value !== void 0 && lp.value !== value) {
            this.setState({ value, defaultValue: value });
        }
    }

    @AutoBind
    editScroll(e, pos) {
        const { height, top } = pos;
        const scrollP = top / height;
        const scrollTop = this.mdbox.scrollHeight * scrollP;
        this.mdbox.scrollTop = scrollTop;
    }

    @AutoBind
    onChange(value) {
        this.setState({ value });
    }

    @AutoBind
    onSave(e) {
        const { value } = this.state;
        const { onSave } = this.props;
        if (onSave) onSave(value, e);
    }

    render() {
        const { showEdit = false } = this.props;

        return (
            <div className={`ys-md-box ${showEdit ? "ys-md-show-e" : ""}`}>
                <IF flag={showEdit}>
                    <CodeMirror
                        actionUrl={`http://iad.test.jj.cn:7001/cloudplt/api/oss/upload?gameId=1&sname=publicui&t=&collectFile=false&matType=2&uzip=undefined&up=undefined`}
                        className="ys-codemirror"
                        onSave={this.onSave}
                        onScroll={this.editScroll}
                        onChange={this.onChange}
                        defaultValue={this.state.value}
                    />
                </IF>
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
