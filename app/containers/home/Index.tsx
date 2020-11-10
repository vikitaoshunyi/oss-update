import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from "@app/redux/action/action"
import Header from "@app/components/Header/Header";
import Menus from "./Menus/Menus";
import Body from "./Body/Body";
import AddItemBox from "./Box/AddItemBox";
import AddBucketBox, { IState } from "./Box/AddBucketBox";
import emitter from "@app/components/emitter";
import ProgressBox from "./Box/ProgressBox"
import { message, Modal, Checkbox } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./style.scss";
import { upload, getFile, uploadSingle, hasFile } from "@app/oss/upload";
const path = require("path");
import { ipcRenderer } from "electron"
const { confirm } = Modal;
export interface IProps { compiler: string; framework: string;}

class Home extends React.PureComponent<any, any> {
  emitToken: any;
  private _type: number;
  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      show: false,
      bucketShow: false,
      progressShow: false,
    }
    this._type = 1; // 1新增,2修改
    this.menuClick = this.menuClick.bind(this);
    this.onBoxOk = this.onBoxOk.bind(this);
    this.onBoxCancel = this.onBoxCancel.bind(this);
    this.onAddResource = this.onAddResource.bind(this);
    this.onRemoveResource = this.onRemoveResource.bind(this);
    this.checkClick = this.checkClick.bind(this);
    this.mutiSyncClick = this.mutiSyncClick.bind(this);
    this.onBucketBoxOk = this.onBucketBoxOk.bind(this);
    this.onBucketBoxCancel = this.onBucketBoxCancel.bind(this);
    this.headSelect = this.headSelect.bind(this);
    this.progressClick = this.progressClick.bind(this);
    this.progressClose = this.progressClose.bind(this);
  }
  render() {
    let { buckets, bucketIndex, itemIndex, syncing, uploadConfirm, uploadType, percent } = this.props;
    let { show, bucketShow, progressShow } = this.state;
    let bucket = buckets[bucketIndex] || null;
    let items = buckets[bucketIndex] && buckets[bucketIndex].items || [];
    let selection = buckets.map((item: any) => {
      return {
        ak: item.ak,
        sk: item.sk,
        bucket: item.bucket,
        id: item.id
      }
    })
    let config = items[itemIndex] && items[itemIndex].config;
    return (
      <>
        <Header percent={percent.all} selection={selection} selectIndex={bucketIndex} onSelect={this.headSelect} progressClick={this.progressClick}></Header>
        <div className="content">
          <Menus items={items} activeIndex={itemIndex} onMenuClick={this.menuClick} onCheckClick={this.checkClick} onMutiClick={this.mutiSyncClick}></Menus>
          <Body uploadType={uploadType} uploadConfirm={uploadConfirm} syncing={syncing} content={config} buckets={buckets} bucketIndex={bucketIndex} itemIndex={itemIndex} onAddResource={this.onAddResource} onRemoveResource={this.onRemoveResource}></Body>
          <AddItemBox show={show} onOk={this.onBoxOk} onCancel={this.onBoxCancel}></AddItemBox>
          { bucketShow ? <AddBucketBox show={bucketShow} key={this._type} type={this._type} bucket={bucket} onOk={this.onBucketBoxOk} onCancel={this.onBucketBoxCancel}></AddBucketBox> : null}
          <ProgressBox syncing={syncing} length={percent.length} index={percent.index} allProgress={percent.all} fileProgress={percent.file}show={progressShow} onClose={this.progressClose}></ProgressBox>
        </div>
      </>
    );
  }
  componentDidMount() {
    this.emitToken = emitter.addListener("showAddBox", (flag: boolean) => {
      let { buckets, bucketIndex } = this.props;
      if (buckets && buckets.length) {
        if(buckets[bucketIndex]) {
          this.setState({
            show: flag
          })
        }else {
          message.warning("没有选中bucket")
        }
      }else {
        this.setState({
          bucketShow: true
        })
      }
    });
    this.emitToken = emitter.addListener("showDelBox", (id: String) => {
      let { buckets, bucketIndex, actions } = this.props;
      if (buckets && buckets.length && buckets[bucketIndex]) {
        console.log("showdelbox", id);
        actions.delItem(id);
        
      }
      
    });
    ipcRenderer.on("showAddBucketBox", (event, args) => {
      let { bucketShow } = this.state;
      if (bucketShow) {
        return message.warning("目前正处于编辑中,请关闭后重试...")
      }
      this._type = 1;
      this.setState({
        bucketShow: true
      })
    });
    ipcRenderer.on("showModifyBucketBox", (event, args) => {
      let { bucketShow } = this.state;
      if (bucketShow) {
        return message.warning("目前正处于编辑中,请关闭后重试...")
      }
      this._type = 2;
      this.setState({
        bucketShow: true
      })
    })
    ipcRenderer.on("sendPuppeteer", (event, args) => {
      this.props.history.push("login");
    })
  }
  componentWillUnmount() {
    this.emitToken.remove();
    ipcRenderer.removeAllListeners("showAddBucketBox")
  }
  menuClick(id: number) {
    let { actions, syncing } = this.props;
    if (syncing) {
      return message.warning("正在同步,请稍后...");
    }else {
      actions.activeItem(id);

    }
  }
  onBoxOk(value: string) {
    this.setState({
      show: false,
    })
    let { actions } = this.props;
    actions.addItem(value);
    
  }
  onBoxCancel() {
    this.setState({
      show: false,
    })
  }
  onBucketBoxOk(value: IState) {
    this.setState({
      bucketShow: false,
    })
    let { actions } = this.props;
    if (this._type === 1) {
      actions.addBucket(value);
    } else {
      actions.modifyBucket(value);
    }
    
  }
  onBucketBoxCancel() {
    this.setState({
      bucketShow: false,
    })
  }
  onAddResource(localDir:string, remoteDir: string, mode?: number, id?: string) {
    let { actions } = this.props;
    if (mode === 1 || !mode) {
      actions.addResource({localDir, remoteDir});
    }else {
      actions.updateResource({localDir, remoteDir, mode, id});
    }
  }
  onRemoveResource(id: number) {
    let { actions } = this.props;
    actions.removeResource(id);
  }
  checkClick(id: number) {
    let { actions } = this.props;
    actions.checkItem(id);
  }
  async mutiSyncClick() {
    let { buckets, bucketIndex, actions, syncing } = this.props;
    if (syncing) return message.error("正在同步,请稍后再试...")
    let items = buckets[bucketIndex] && buckets[bucketIndex].items;
    items = items.filter((item: any) => {
      return item.checked;
    });
    
    if (items && items.length) {
      actions.syncing(true);
      let uploadFiles = items.map(async (item: any): Promise<any> => {
        let uploadFiles = item.config && item.config.length ? item.config.map((data: any) => {
          return getFile(data.localDir);
        }) : [];
        if (uploadFiles.length) {
          let filesArr = await Promise.all(uploadFiles).catch(() => []);
          return filesArr;
        }else {
          return [];
        }
      });
      let filesArr: Array<any> = await Promise.all(uploadFiles).catch(() => []);
      let flatFilesArr = filesArr.flat(Infinity);
      let flatLength = flatFilesArr.length;
      actions.uploadPercent([0, 0, flatLength, 0]);
      if (filesArr && filesArr.length) {
        let tempIndex = 0;
        for(let k = 0; k < items.length; k++) {
          let value = items[k];
          let thisFilesArr = filesArr[k];
          let contentNameArr = [];
          for(let i = 0; i < value.config.length; i++) {
            let data = value.config[i];
            let nameArr = [];
            for(let file of thisFilesArr[i]) {
              tempIndex++;
              if (!file) continue;
              if (this.props.uploadConfirm) {
                let hasF = await hasFile(data.remoteDir, file).catch(()=>{});
                if (hasF) {
                  let confirm = await this.handleConfirm(path.join(data.remoteDir, file));
                  if (!confirm) continue;
                }
              } else {
                if (this.props.uploadType === 1) {
                  
                } else if (this.props.uploadType === 2) {
                  let hasF = await hasFile(data.remoteDir, file).catch(()=>{});
                  if (hasF) {
                    continue;
                  }
                }
              }
              let res = await uploadSingle(data.localDir, data.remoteDir, file).catch((res) => { console.log(res);return 0;});
              
              if (res) {
                nameArr.push(path.basename(res.name));
              }
              actions.uploadPercent([Math.round(tempIndex/flatLength * 100), 100, flatLength, tempIndex]);
            }
            contentNameArr.push(nameArr);
          }
          let date = new Date().getTime();
          let d = contentNameArr.map((item: any) => {
            return {
              syncTime: date,
              syncFiles: item.join(",") ,
            }
          });
          actions.updateResourceData(d, value.id);
          message.success(`${value.title},success!!`);
        }
      }
      
      
      actions.syncing(false);
      
      
    }else {
      message.warning("没有可上传的条目!")
    }
  }
  headSelect(key: any) {
    let { actions } = this.props;
    actions.activeBucket(key);
  }
  progressClick() {
    this.setState({
      progressShow: !this.state.progressShow
    })
  }
  progressClose() {
    this.setState({
      progressShow: false
    })
  }
  async handleConfirm(remotePath: string) {
    let { actions } = this.props;
    return new Promise((resolve, reject) => {
      confirm({
        title: `文件:${remotePath}已存在,是否覆盖?`,
        icon: <ExclamationCircleOutlined />,
        content: <Checkbox onChange={(e)=>{
          actions.uploadConfirm(!e.target.checked);
        }}>下次不再提示</Checkbox>,
        okText: "覆盖",
        cancelText: "跳过",
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false)
        },
      });
    });
  }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state: any) {
  return {
    buckets: state.main.buckets,
    bucketIndex: state.main.bucketIndex,
    itemIndex: state.main.itemIndex,
    syncing: state.main.syncing,
    uploadConfirm: state.main.uploadConfirm,
    uploadType: state.main.uploadType,
    percent: state.main.percent,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
      actions: bindActionCreators(actions, dispatch),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
/**
 * let { match } = this.props;
 *  <h2 >主界面{match.params.id}</h2>;
 * <Switch>
          <Route path="/home/test" component={Test2}/>
          <Route path="/home/tab" component={Test}/> 
          <Route path="/home/:id/test" component={Test}/>
          <Redirect from="/home/tab2" to="/home/tab" />
          <Route component={Test3} />
        </Switch>
 */
