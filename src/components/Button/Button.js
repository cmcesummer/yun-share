import React from "react";
import { Button } from "antd";
import BaseComponent from "../BaseComponent";
import AutoBind from "../../utils/Autobind";
import "./index.scss";

export default class ButtonExt extends BaseComponent {
    @AutoBind
    click(e) {
        const { onClick } = this.props;
        if (onClick) onClick(e);
    }

    render() {
        const { onClick, ant, className, ...other } = this.props;
        return ant ? (
            <Button onClick={this.click} className={`_btn-default-style ${className}`} {...other}>
                {this.props.children}
            </Button>
        ) : (
            <div onClick={this.click} className={`_btn-default-style ${className}`} {...other}>
                {this.props.children}
            </div>
        );
    }
}
