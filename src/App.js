import React from "react";
import { Provider } from "./store/SourceCenter";
import SourceManager from "./store/SourceManager";
import Container from "./skeleton/Container";
import Header from "./skeleton/Header";

class App extends React.Component {
    constructor() {
        super();
        const manger = new SourceManager();
        this.value = {
            getValue: manger.getValue,
            setValue: manger.setValue,
            addListener: manger.addListener,
            removeAllListener: manger.removeAllListener
        };
    }
    render() {
        return (
            <Provider value={this.value}>
                <Header></Header>
                <Container></Container>
            </Provider>
        );
    }
}

export default App;
