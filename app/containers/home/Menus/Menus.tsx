import React from 'react';
import Iconfont from "@app/components/Iconfont";
import { remote } from "electron"
import emitter from "@app/components/emitter";
import "./style.scss";
import { Button, Checkbox } from "antd";
interface IProp {
  items: Array<any>;
  activeIndex: number;
  onMenuClick: (id: number) => void;
  onCheckClick: (id: number) => void;
  onMutiClick: () => void;
}
interface IState {
  rightClickedId: string;
}
class Menus extends React.PureComponent<IProp, IState> {
  private _rightToken: any;
  constructor(props: IProp, context: IState) {
    super(props, context);
    this.state = {
      rightClickedId: ""
    };
    this.itemClick = this.itemClick.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mutiClick = this.mutiClick.bind(this);
    this.onCheckClick = this.onCheckClick.bind(this);
  }
  render() {
    let { items, activeIndex } = this.props;
    let { rightClickedId } = this.state;
    let domItems = null, disabled = false;
    if (items && items.length) {
      domItems = items && items.map((item, i) => {
        return <MenuItem key={i} isRightClicked={rightClickedId === item.id} isActive={activeIndex === i} title={item.title} id={item.id} checked={item.checked} onMenuClick={this.itemClick} onCheckClick={this.onCheckClick}></MenuItem>
      })
      disabled = !items.some((item: any) => { return item.checked;})
    }else {
      disabled = true;
    }

    return (
      <div className="menus" onMouseDown={this.mousedown}>
        <ul>
          {domItems}
        </ul>
        <div className="menus-tools">
          <Button type="primary" block disabled={disabled} onClick={this.mutiClick}>
            批量同步
          </Button>
        </div>
      </div>
    );
  }
  itemClick(id: number) {
    
    if (this.props.onMenuClick) {
      this.props.onMenuClick(id);
    }
  }
  mousedown(e: any) {
    if (e.button) { //右击
      let etMenu = new remote.Menu();
      etMenu.append(new remote.MenuItem({
        label: "新建",
        click() {
          emitter.emit("showAddBox", true);
        }
      }));
      let { flag, thisTarget } = this._isInMenuItem(e);
      if (flag) {
        etMenu.append(new remote.MenuItem({
          label: "删除",
          click() {
            emitter.emit("showDelBox", thisTarget.dataset.id);
          }
        }));
        this.setState({
          rightClickedId: thisTarget.dataset.id
        });
        if (this._rightToken) {
          clearTimeout(this._rightToken);
        }
        this._rightToken = setTimeout(() => {
          this.setState({
            rightClickedId: ""
          });
        }, 1000);
      }
      etMenu.popup()

    }
  }
  _isInMenuItem(e: any): any {
    let target = e.target;
    let flag = false;
    let thisTarget = null;
    while(target) {
      if (target && target.classList && target.classList.contains("menu-item")) {
        flag = true;
        thisTarget = target;
        target = null;
        
      }else {
        target = target.parentNode;
      }
    }
    return {flag, thisTarget};
  }
  onCheckClick(id: number) {
    if (this.props.onCheckClick) {
      this.props.onCheckClick(id);
    }
  }
  mutiClick() {
    if (this.props.onMutiClick) {
      this.props.onMutiClick();
    }
  }
}
interface IMIProps {
  title?: string;
  id?: number;
  isActive?: boolean;
  checked?: boolean;
  isRightClicked?: boolean;
  onMenuClick?: (id: number) => void;
  onCheckClick?: (id: number) => void;
}
interface IMIState {
  test: any;
}
class MenuItem extends React.PureComponent<IMIProps, IMIState> {
  constructor(props: IMIProps, context: IMIState) {
    super(props, context);
    this.state = {
      test:1
    };
    this.itemClick = this.itemClick.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
  }
  render() {
    let { id, title, isActive, checked, isRightClicked } = this.props;
    return (
      <li className={"menu-item " + (isActive ? "active " : "") + (isRightClicked ? "right":"")} data-id={id} onClick={this.itemClick}>
        <Checkbox checked={checked} onChange={this.onCheckChange} onClick={this.stopPropagation}></Checkbox>
        <Iconfont type="icon-liuchengxiangdao"></Iconfont>
        <span>{title}</span>
      </li>
    );
  }
  itemClick(e: any) {
    e.stopPropagation();
    let { onMenuClick, id } = this.props;
    if (onMenuClick) {
      onMenuClick(id);
      
    }
  }
  stopPropagation(e: any) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
  }
  onCheckChange(e: any) {
    let { onCheckClick, id } = this.props;
    if (onCheckClick) {
      onCheckClick(id);
     
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    console.log("test", this.state.test);
  }
  
  componentDidMount() {
    console.log(this.props);
  }
  
  // componentDidUpdate(prevProps:any, prevState:any) {
  //   console.log(this.props.id);
  // }
  // componentWillUnmount() {
  //   console.log("componentWillUnmount", this.props.id);
  // }
  
  
}

export default Menus;