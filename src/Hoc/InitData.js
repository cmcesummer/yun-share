import React from "react";
import { INIT_DATA_LIST, GOLBAL_INIT_DATA } from "../../common/constant";

// interface IDataArray {
//     name: string;
//     ajax: () => {}
// }

export default function InitData(dataArray /* : IDataArray  */) {
  return function(Component) {
    Component[INIT_DATA_LIST] = dataArray;

    return class HOCInitData extends React.Component {
      state = {
        data: {}
      };
      constructor() {
        super();
        if (window[GOLBAL_INIT_DATA]) {
          this.state.data = window[GOLBAL_INIT_DATA];
          return;
        }
      }

      render() {
        return <Component data={this.state.data} />;
      }
    };
  };
}
