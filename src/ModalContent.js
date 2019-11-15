import React, { useState } from "react";
// import ReactDOM from "react-dom";

// function Creat() {
//     return <div>555555555555555555555555</div>;
// }

export default function Counter() {
    let [number, setNumber] = useState(0);
    function alertNumber() {
        setTimeout(() => {
            // alert 只能获取到点击按钮时的那个状态
            alert(number);
        }, 3000);
    }
    window.$.ajax({
        url: "/api/player",
        success(res) {
            console.log(res);
        }
    });
    return (
        <>
            <p>{number}</p>
            <button onClick={() => setNumber(number + 1)}>+</button>
            <button onClick={alertNumber}>alertNumber</button>
        </>
    );
}

// export default class Content extends React.Component {
//     componentWillUnmount() {
//         console.log("componentWillUnmount");
//     }
//     createP = () => {
//         return ReactDOM.createPortal(<Creat />, document.body);
//     };

//     render() {
//         return (
//             <>
//                 <p>Some contents...</p>
//                 {this.createP()}
//                 {Counter()}
//                 <p>Some contents...</p>
//             </>
//         );
//     }
// }
