import React from "react";
import BaseComponent from "../components/BaseComponent";
import AutoBind from "../utils/Autobind";
import bind from "../Hoc/bind";
import { ContainerStoreName } from "../utils/constant";
import RightClickMenu from "../components/RightClickMenu";

const { ipcRenderer } = require("electron");

@bind()
class FileList extends BaseComponent {
    state = {
        fileList: [],
        chooseTitle: ""
    };

    constructor(props) {
        super(props);
        ipcRenderer.send("GET_FILE_LIST");
        ipcRenderer.on("GET_FILE_LIST_BACK", (e, arg) => {
            const { REV, DATA } = arg;
            console.log(REV, DATA);
            if (!REV) return;
            this.setState({ fileList: DATA });
            console.log(DATA);
        });
        const { setValue } = props;
        ipcRenderer.on("GET_FILE_CONTENT_BACK", async (ev, arg) => {
            const { REV, DATA } = arg;
            if (!REV) return;
            setValue(ContainerStoreName, { fileInfo: DATA });
        });
    }

    @AutoBind
    closeContent() {
        this.props.setValue(ContainerStoreName, { fileInfo: null });
    }

    @AutoBind
    click(item) {
        ipcRenderer.send("GET_FILE_CONTENT", item);
        this.setState({ chooseTitle: item.title });
    }

    @AutoBind
    onMouseUp(e) {
        if (!this.menu) return;
        if (e.button !== 2) return;
        if (e.target.className === "ys-filelist") {
            this.menu.show({ x: e.clientX, y: e.clientY + 10 });
        }
    }

    @AutoBind
    itemMouseUp(item, e) {
        if (!this.menu) return;
        if (e.button !== 2) return;
        this.menu.show({ x: e.clientX, y: e.clientY + 10, dir: item.dir });
    }

    render() {
        const { fileList = [], chooseTitle } = this.state;
        return (
            <>
                <div className="ys-filelist" onMouseUp={this.onMouseUp} ref={ref => (this.box = ref)}>
                    {fileList.map(item => (
                        <div
                            key={item.title}
                            className={`ys-filelist-li ${item.title === chooseTitle ? "active" : ""}`}
                            onMouseUp={this.itemMouseUp.bind(this, item)}
                            onClick={this.click.bind(this, item)}
                        >
                            <div className="bg"></div>
                            <div className="content">
                                <div className="title">{item.title}</div>
                                <div className="time">{item.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <RightClickMenu ref={ref => (this.menu = ref)} closeContent={this.closeContent}></RightClickMenu>
            </>
        );
    }
}

export default FileList;
