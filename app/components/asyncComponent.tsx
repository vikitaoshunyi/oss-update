
import React from 'react';
export default function asyncComponent(importComponent: any): React.ComponentClass {
  class AsyncComponent extends React.Component<any, any> {
      constructor(props: any) {
          super(props);
          this.state = {component: null};
      }
      async componentDidMount() {
          const {default: component} = await importComponent();
          this.setState({component});
      }
      render() {
          const Comp = this.state.component;
          return Comp ? <Comp {...this.props} /> : null;
      }
  }
  return AsyncComponent;
}