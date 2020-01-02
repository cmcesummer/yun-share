import React from "react";
import { Icon } from "antd";
import BaseComponent from "../components/BaseComponent";
import bind from "../Hoc/bind";

@bind("Header", { loading: false })
class Header extends BaseComponent {
    render() {
        const { loading = true } = this.props;
        console.log(loading);
        return (
            <header className="ys-header">
                <h1>yun-share</h1>
                {loading ? <Icon type="loading" /> : null}
            </header>
        );
    }
}

export default Header;
