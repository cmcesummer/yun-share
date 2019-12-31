import React from "react";
import { Button } from "antd";
import BaseComponent from "../BaseComponent";
import AutoBind from "../../utils/Autobind";

export default class ButtonExt extends BaseComponent {
    @AutoBind
    click(e) {
        const { onClick } = this.props;
        if (onClick) onClick(e);
    }

    render() {
        const { onClick, ...other } = this.props;
        return (
            <Button onClick={this.click} {...other}>
                {this.props.children}
            </Button>
        );
    }
}
