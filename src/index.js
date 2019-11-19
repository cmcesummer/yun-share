import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

// 移除窗口的 drop 事件
document.addEventListener("drop", e => {
    e.preventDefault();
});

ReactDOM.render(<App />, document.getElementById("root"));
