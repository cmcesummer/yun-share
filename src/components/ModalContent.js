import React from "react";
import bind from "../Hoc/bind";
import AutoBind from "../utils/Autobind";

// import React, { useState } from "react";
// import ReactDOM from "react-dom";

// function Creat() {
//     return <div>555555555555555555555555</div>;
// }

// export default function Counter() {
//     let [number, setNumber] = useState(0);
//     function alertNumber() {
//         setTimeout(() => {
//             // alert 只能获取到点击按钮时的那个状态
//             alert(number);
//         }, 3000);
//     }
//     window.$.ajax({
//         url: "/api/player",
//         success(res) {
//             console.log(res);
//         }
//     });
//     return (
//         <>
//             <p>{number}</p>
//             <button onClick={() => setNumber(number + 1)}>+</button>
//             <button onClick={alertNumber}>alertNumber</button>
//         </>
//     );
// }

@bind()
class Content extends React.Component {
    componentWillUnmount() {
        console.log("componentWillUnmount");
    }
    static _name = "module";
    componentDidMount() {}

    @AutoBind
    click() {
        const { value } = this.props.getValue("Container");
        this.props.setValue("Container", { value: value + 1 });
    }

    render() {
        return (
            <>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <button onClick={this.click}> 增加其他模块的 value </button>
            </>
        );
    }
}

export default Content;
