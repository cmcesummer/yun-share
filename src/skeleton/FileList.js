import React from "react";
import BaseComponent from "../components/BaseComponent";
import AutoBind from "../utils/Autobind";
import bind from "../Hoc/bind";
import { ContainerStoreName } from "../utils/constant";

const map = [
    {
        title: "titleeeeetitleeeeetitleeeeetitleeeee",
        time: "11-9"
    },
    {
        title: "s",
        time: "11-9"
    },
    {
        title: "titleeeeetitleeeeetitleeeeetitleeeee",
        time: "11-9"
    },
    {
        title: "aa",
        time: "11-9"
    }
];

@bind()
class FileList extends BaseComponent {
    @AutoBind
    click(item) {
        const { setValue } = this.props;
        setValue(ContainerStoreName, { fileInfo: item });
    }

    @AutoBind
    onMouseUp(e) {
        if (e.button === 2 && e.target.className === "ys-filelist") {
            console.log(`mouseY`, e.clientY, e.pageY);
            console.log(`mouseX`, e.clientX, e.pageX);
        }
    }

    render() {
        return (
            <ul className="ys-filelist" onMouseUp={this.onMouseUp}>
                {map.map((item, index) => (
                    <li key={index} onClick={this.click.bind(this, item)}>
                        <div className="title">{item.title}</div>
                        <div className="time">{item.time}</div>
                    </li>
                ))}
            </ul>
        );
    }
}

export default FileList;
