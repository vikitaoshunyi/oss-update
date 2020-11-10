import React from 'react';
import "./style.scss";
interface IProp {
}
interface IState {
}
class text extends React.Component<IProp, IState> {
  constructor(props: IProp, context: IState) {
    super(props, context);
    this.state = {};
  }
  render() {
    return (
      <div>test组件</div>
    );
  }
}
export default text;