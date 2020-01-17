import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
// import Login from "./skeleton/Login";
// import BaseComponent from "./components/BaseComponent";

// import "./utils/db";

// 移除窗口的 drop 事件
document.addEventListener("drop", e => {
    e.preventDefault();
});

document.oncontextmenu = function(e) {
    e.preventDefault();
};

const ROOT = document.getElementById("root");

// class Yun extends BaseComponent {
//     state = {
//         login: false
//     };

//     registed = () => {
//         this.setState({ login: true });
//         document.getElementById("root").style.background = "rgba(255, 255, 255, 0.9)";
//     };

//     render() {
//         return this.state.login ? <App /> : <Login registed={this.registed} />;
//     }
// }

ReactDOM.render(<App />, ROOT, _ => {
    ROOT.style.opacity = "1";
});
