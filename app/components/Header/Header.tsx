import React from 'react';
import { Select, Progress } from "antd";
import "./style.scss";
const { Option } = Select;
interface IProp {
  percent?: number;
  selection: Array<any>;
  selectIndex: number;
  onSelect: (key: any) => void;
  progressClick?: () => void
}
interface IState {
}
class Header extends React.PureComponent<IProp, IState> {
  constructor(props: IProp, context: IState) {
    super(props, context);
    this.state = {};
    this.onSelect = this.onSelect.bind(this);
    this.progressClick = this.progressClick.bind(this);
  }
  render() {
    let { selection, selectIndex, percent } = this.props;
    let options = selection.map((item) => {
      return <Option key={item.id} value={item.id}>{item.bucket}</Option>;
    })
    let dv = selection[selectIndex];
    let defaultV = "";
    if (dv) {
      defaultV = dv.id
    }
    return (
      <div className="header">
        <Select size="small" defaultValue={defaultV} value={defaultV} style={{ width: 120 }} onSelect={this.onSelect}>
          {options}
        </Select>
        <div className="h-progress" onClick={this.progressClick}>
          <Progress type="circle" percent={percent} width={40} strokeWidth={6}/>
        </div>
      </div>
    );
  }
  onSelect(key: any) {
    if(this.props.onSelect) {
      this.props.onSelect(key);
    }
  }
  progressClick() {
    this.props.progressClick && this.props.progressClick();
  }
}
export default Header;