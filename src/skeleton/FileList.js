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
        fileList: []
    };

    constructor(props) {
        super(props);
        ipcRenderer.send("GET_FILE_LIST");
        ipcRenderer.on("GET_FILE_LIST_BACK", (e, arg) => {
            const { REV, DATA } = arg;
            if (!REV) return;
            this.setState({ fileList: DATA });
        });
        const { setValue } = props;
        ipcRenderer.on("GET_FILE_CONTENT_BACK", async (ev, arg) => {
            // setValue(ContainerStoreName, { fileInfo: item });
            const { REV, DATA } = arg;
            if (!REV) return;
            setValue(ContainerStoreName, { fileInfo: DATA });
        });
    }

    @AutoBind
    click(item) {
        ipcRenderer.send("GET_FILE_CONTENT", item);
    }

    @AutoBind
    onMouseUp(e) {
        if (e.button === 2 && e.target.className === "ys-filelist") {
            if (!this.menu) return;
            this.menu.show({ x: e.clientX, y: e.clientY + 10 });
        }
    }

    render() {
        const { fileList = [] } = this.state;
        return (
            <>
                <div className="ys-filelist" onMouseUp={this.onMouseUp} ref={ref => (this.box = ref)}>
                    {fileList.map(item => (
                        <div key={item.title} className="ys-filelist-li" onClick={this.click.bind(this, item)}>
                            <div className="title">{item.title}</div>
                            <div className="time">{item.time}</div>
                        </div>
                    ))}
                </div>
                <RightClickMenu ref={ref => (this.menu = ref)}></RightClickMenu>
            </>
        );
    }
}

export default FileList;
