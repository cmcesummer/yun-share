import React from "react";
import { Input, Icon, Checkbox } from "antd";
import BaseComponent from "../components/BaseComponent";
import ButtonExt from "../components/Button";
// import DecoratorUtils from "../utils/DecoratorUtils";

const REMEBER_USERNAME = "REMEBER_USERNAME";

const REMEBER_PASSWORD = "REMEBER_PASSWORD";

const REMEBER_CHECK = "false";

class Login extends BaseComponent {
    state = {
        msg: "",
        loading: false
    };

    username = "";
    password = "";
    remember = false;

    constructor(props) {
        super(props);
        this.username = window.localStorage.getItem(REMEBER_USERNAME) || "";
        this.password = window.localStorage.getItem(REMEBER_PASSWORD) || "";
        this.remember = window.localStorage.getItem(REMEBER_CHECK) === "true";
    }

    submit = () => {
        if (!this.username) {
            this.setState({ msg: "请填写 Username" });
            return;
        } else if (!this.password) {
            this.setState({ msg: "请填写 Password" });
            return;
        }
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false });
            if (this.remember) {
                window.localStorage.setItem(REMEBER_USERNAME, this.username);
                window.localStorage.setItem(REMEBER_PASSWORD, this.password);
                window.localStorage.setItem(REMEBER_CHECK, this.remember);
            } else {
                window.localStorage.removeItem(REMEBER_USERNAME);
                window.localStorage.removeItem(REMEBER_PASSWORD);
                window.localStorage.removeItem(REMEBER_CHECK);
            }
            this.props.registed();
        }, 500);
    };

    inputChange = (type, e) => {
        const value = e.target.value;
        if (type === "psd") {
            this.password = value;
        } else {
            this.username = value;
        }
    };

    checkboxChange = e => {
        this.remember = e.target.checked;
    };

    render() {
        return (
            <div className="login-box">
                <Input
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Username"
                    className="input-item"
                    defaultValue={this.username}
                    onChange={this.inputChange.bind(this, "user")}
                />

                <Input
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="password"
                    placeholder="Password"
                    className="input-item"
                    defaultValue={this.password}
                    onChange={this.inputChange.bind(this, "psd")}
                />

                <Checkbox className="check input-item" onChange={this.checkboxChange} defaultChecked={this.remember}>
                    Remember me
                </Checkbox>

                <ButtonExt className="login-form-button" type="primary" ant onClick={this.submit} loading={this.state.loading}>
                    Log in
                </ButtonExt>
                <p className="error-msg">{this.state.msg}</p>
            </div>
        );
    }
}

export default Login;
