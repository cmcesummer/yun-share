import React from "react";
import { Modal, Button } from "antd";
import Content from "./ModalContent";

// function Hoc(param) {
//     return Com => {
//         return class Hooc extends React.Component {
//             componentDidMount() {
//                 console.log("componentDidMount", param);
//             }
//             render() {
//                 return <Com></Com>;
//             }
//         };
//     };
// }

// @Hoc(56)

class Utils {
    static logger(...args) {
        console.log(...args);
    }
}

class App extends React.Component {
    state = {
        visible: false
    };
    showModal = () => {
        Utils.logger(this.state.visible);
        this.setState({
            visible: true
        });
    };
    close = () => {
        this.setState({
            visible: false
        });
    };
    handleCancel = () => {
        this.close();
    };
    handleOk = () => {
        this.close();
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
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

                    <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                        Learn Reactcccccc
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
