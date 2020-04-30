import React from "react";
import { Provider } from "./store/SourceCenter";
import SourceManager from "./store/SourceManager";
// import Container from "./skeleton/Container";
// import Header from "./skeleton/Header";
import Login from "./skeleton/hooks/Login";
// import Login from "./skeleton/Login";

class App extends React.Component {
    constructor() {
        super();
        const manger = new SourceManager();
        this.value = {
            getValue: manger.getValue,
            setValue: manger.setValue,
            addListener: manger.addListener,
            removeAllListener: manger.removeAllListener,
        };
        this.state = {
            login: false,
        };
    }

    registed = () => {
        this.setState({ login: true });
    };

    render() {
        return (
            <Provider value={this.value}>
                {/* <Header /> */}
                {/* {this.state.login ? <Container /> : <Login registed={this.registed} />} */}
                <Login registed={this.registed} />
            </Provider>
        );
    }
}

export default App;
