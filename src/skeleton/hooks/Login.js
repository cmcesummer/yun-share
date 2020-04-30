import React, { useState, useCallback, memo } from "react";
import { Input, Icon, Checkbox } from "antd";
import ButtonExt from "../../components/Button";
// import DecoratorUtils from "../utils/DecoratorUtils";

const REMEBER_USERNAME = "REMEBER_USERNAME";

const REMEBER_PASSWORD = "REMEBER_PASSWORD";

const REMEBER_CHECK = "REMEBER_CHECK";

const Inp = memo(function (props) {
    console.log(`render ${props.type}`);
    return <Input {...props} />;
});

const local = {
    get(name) {
        return window.localStorage.getItem(name) || "";
    },
    set(name, value) {
        return window.localStorage.setItem(name, value);
    },
    delete(name) {
        return window.localStorage.removeItem(name);
    },
};

const UserIcon = <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />;
const PasswordIcon = <Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />;

export default memo(function Login(props) {
    const [username, setUsername] = useState(local.get(REMEBER_USERNAME));
    const [password, setPassword] = useState(local.get(REMEBER_PASSWORD));
    const [remember, setRemember] = useState(local.get(REMEBER_CHECK) === "true");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const submit = useCallback(
        function () {
            if (!username) {
                setMsg("请填写 Username");
                return;
            }
            if (!password) {
                setMsg("请填写 Password");
                return;
            }
            setMsg("");
            setLoading(true);
            setTimeout(() => {
                if (remember) {
                    local.set(REMEBER_USERNAME, username);
                    local.set(REMEBER_PASSWORD, password);
                    local.set(REMEBER_CHECK, remember);
                } else {
                    local.delete(REMEBER_USERNAME);
                    local.delete(REMEBER_PASSWORD);
                    local.delete(REMEBER_CHECK);
                }
                setLoading(false);
            }, 500);
        },
        [username, password, remember]
    );

    const userInputChange = useCallback((e) => {
        setUsername(e.target.value);
    }, []);

    const passwordChange = useCallback((e) => {
        setPassword(e.target.value);
    }, []);

    const checkboxChange = useCallback((e) => {
        setRemember(e.target.checked);
    }, []);

    return (
        <div className="login-box">
            <Inp prefix={UserIcon} type="text" placeholder="Username" className="input-item" defaultValue={username} onChange={userInputChange} />

            <Inp prefix={PasswordIcon} type="password" placeholder="Password" className="input-item" defaultValue={password} onChange={passwordChange} />

            <Checkbox className="input-item check" onChange={checkboxChange} defaultChecked={remember}>
                Remember me
            </Checkbox>

            <ButtonExt className="login-form-button" type="primary" ant onClick={submit} loading={loading}>
                Log in
            </ButtonExt>
            <p className="error-msg">{msg}</p>
        </div>
    );
});
