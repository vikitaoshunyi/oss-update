import React from "react";
import { Link } from 'react-router-dom'; 
import { Input, Button } from "antd";
import { ipcRenderer, remote } from "electron";

const path = require("path"); 
const fs = require("fs");
// const puppeteer = require('puppeteer-core');
// import puppeteer from "puppeteer";
console.log(fs);
import "./style.scss";
export interface IProps { compiler: string; framework: string;}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
class Login extends React.Component<any, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }
  render() {
    return (
      <div>
        <Link to="/">跳转</Link>
        <h2 style={{color: "red"}}>登录界面</h2>
        <Input></Input>
        <Button loading={false} onClick={this.click}>test</Button>
        <img src={require('../../images/icon.png').default}/>
      </div>
    );
    
  }
  click() {
    // console.log(dialog);
    console.log(require('../../images/icon.png'));
    remote.dialog.showMessageBox({
      type: "warning",
      buttons: ["知道", "不知道"],
      message:"hi,错误了",
      icon: remote.nativeImage.createFromPath(path.join(__dirname, '/static/icon.png'))
    }).then((res) => {
      console.log(res);
    })
     ipcRenderer.send("add");
    
  }
  
}
export default Login;