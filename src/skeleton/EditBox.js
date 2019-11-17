import React from "react";
import { Button } from "antd";
import BaseComponent from "../components/BaseComponent";
import MarkDown from "../components/MarkDown/MarkDown";
import bind from "../Hoc/bind";
import AutoBind from "../utils/Autobind";

@bind("Edit")
class EditBox extends BaseComponent {
    state = {
        showEdit: false
    };

    @AutoBind
    changeEdit() {
        this.setState({ showEdit: !this.state.showEdit });
    }

    render() {
        const { showEdit } = this.state;
        return (
            <section className="eidtbox">
                <div className="eidtbox-topbar">
                    <Button onClick={this.changeEdit}>{showEdit ? `预览` : `编辑`}</Button>
                </div>
                <div className="eidtbox-body">
                    <MarkDown showEdit={showEdit} />
                </div>
            </section>
        );
    }
}

export default EditBox;
