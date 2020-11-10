import React from 'react';
import { Modal, Input, message } from 'antd';
import "./style.scss";
interface IProp {
  show?: boolean;
  onOk?: (value: string) => void;
  onCancel: () => void;
}
interface IState {
  value: string;
}
class AddItemBox extends React.Component<IProp, IState> {
  input: any;
  constructor(props: IProp, context: IState) {
    super(props, context);
    this.state = {
      value: ""
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  render() {
    let { show } = this.props;
    let { value } = this.state;
    return (
      <Modal
          title="添加文件名"
          visible={show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          forceRender
        >
          <div>
            <Input ref={(node) => 
              {this.input = node;}
            } 
            onChange={this.onChange} addonBefore="标题名称" defaultValue="" value={value}/>
          </div>
        </Modal>
    );
  }
  componentDidMount() {
    
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.show !== this.props.show) {
      if (this.props.show) {
        this.input && this.input.focus();
      }
    }
  }
  
  handleOk() {
    let { onOk } = this.props;
    let { value } = this.state;
    if (!value) {
      message.warning('请填写标题');
    } else {
      if (onOk) {
        onOk(value);
      }
    }
    
  }
  handleCancel() {
    let { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    } 
  }
  onChange(e: any) {
    this.setState({
      value: e.target.value
    });
  }
}
export default AddItemBox;