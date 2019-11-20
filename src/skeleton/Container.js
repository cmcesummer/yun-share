import React from "react";
import bind from "../Hoc/bind";
// import { Modal, Button } from "antd";
// import Content from "../components/ModalContent";
import AutoBind from "../utils/Autobind";
import BaseComponent from "../components/BaseComponent";
import EditBox from "./EditBox";
import FileList from "./FileList";
import { ContainerStoreName } from "../utils/constant";

@bind(ContainerStoreName, { value: 0 })
class Container extends BaseComponent {
    state = {
        visible: false
    };

    static _name = "Container";

    modalCore(falg) {
        this.setState({ visible: !!falg });
    }

    @AutoBind
    showModal() {
        this.modalCore(true);
    }

    @AutoBind
    handleOk() {
        this.modalCore(false);
    }

    @AutoBind
    handleCancel() {
        this.modalCore(false);
    }

    render() {
        return (
            <div className="App">
                <FileList />
                <EditBox />
                {/* <header className="App-header">
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <Button type="primary" onClick={this.showModal}>
                        Open Modal
                    </Button>
                    {this.state.visible ? (
                        <Modal title="Basic Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                            <Content />
                        </Modal>
                    ) : null}

                    <p>this.props.value: {this.props.value}</p>
                </header> */}
            </div>
        );
    }
}

export default Container;
