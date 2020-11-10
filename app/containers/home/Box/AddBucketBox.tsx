import React from 'react';
import { Modal, Input, message } from 'antd';
import "./style.scss";
interface IProp {
  show?: boolean;
  bucket?: any;
  type?: number;
  onOk?: (value: IState) => void;
  onCancel: () => void;
}
export interface IState {
  region: string;
  ak: string;
  sk: string;
  bucket: string;

}
class AddBucketBox extends React.Component<IProp, IState> {
  input: any;
  constructor(props: IProp, context: IState) {
    super(props, context);
    let { bucket, type } = props;
    this.state = {
      region: type === 2 && bucket && bucket.region ? bucket.region: "",
      ak: type === 2 && bucket && bucket.ak ? bucket.ak: "",
      sk: type === 2 && bucket && bucket.sk ? bucket.sk: "",
      bucket: type === 2 && bucket && bucket.bucket ? bucket.bucket: ""
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onAkChange = this.onAkChange.bind(this);
    this.onSkChange = this.onSkChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }
  render() {
    let { show } = this.props;
    let { region, ak, sk, bucket } = this.state;
    return (
      <Modal
          title="添加Bucket"
          visible={show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          
        >
          <div className="bucket-add-item">
            <Input onChange={this.onRegionChange} addonBefore="region" defaultValue="" value={region}/>
          </div>
          <div className="bucket-add-item">
            <Input onChange={this.onAkChange} addonBefore="ak" defaultValue="" value={ak}/>
          </div>
          <div className="bucket-add-item">
            <Input onChange={this.onSkChange} addonBefore="sk" defaultValue="" value={sk}/>
          </div>
          <div className="bucket-add-item">
            <Input onChange={this.onNameChange} addonBefore="buckct_name" defaultValue="" value={bucket}/>
          </div>
        </Modal>
    );
  }
  componentDidMount() {
    
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    // if (prevProps.show !== this.props.show) {
    //   if (this.props.show) {
    //     this.input && this.input.focus();
    //   }
    // }
  }
  
  handleOk() {
    let { onOk } = this.props;
    let { region, ak, sk, bucket } = this.state;
    if (!region || !ak || !sk || !bucket) {
      message.warning('请填写完整');
    } else {
      if (onOk) {
        onOk({...this.state});
      }
    }
    
  }
  handleCancel() {
    let { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    } 
  }
  onRegionChange(e: any) {
    this.setState({
      region: e.target.value
    });
  }
  onAkChange(e: any) {
    this.setState({
      ak: e.target.value
    });
  }
  onSkChange(e: any) {
    this.setState({
      sk: e.target.value
    });
  }
  onNameChange(e: any) {
    this.setState({
      bucket: e.target.value
    });
  }
}
export default AddBucketBox;