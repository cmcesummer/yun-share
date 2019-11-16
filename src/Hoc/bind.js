import React from "react";
import { Consumer } from "../store/SourceCenter";
import BaseComponent from "../utils/BaseComponent";
import DecoratorUtils from "../utils/DecoratorUtils";

export default function bind(dataname, initdata) {
    return Component => {
        return class Bind extends BaseComponent {
            state = { flag: false };

            consumerValue = null;

            @DecoratorUtils.execTimesLimit()
            initAndBindListener() {
                if (this.consumerValue) {
                    if (initdata) this.consumerValue.setValue(dataname, initdata, false);
                    const removeListener = this.consumerValue.addListener(dataname, v => {
                        this.setState({ flag: !this.state.flag });
                    });
                    this.lifesEndPush(removeListener);
                }
            }

            renderComp() {
                let props = {};
                const value = this.consumerValue;
                if (dataname) props = value.getValue(dataname) || {};

                const { refProxy, ...other } = this.props;
                if (refProxy) other.ref = refProxy;

                return <Component {...other} {...value} {...props} />;
            }

            render() {
                return (
                    <Consumer>
                        {value => {
                            this.consumerValue = value;
                            this.initAndBindListener();
                            return this.renderComp();
                        }}
                    </Consumer>
                );
            }
        };
    };
}
