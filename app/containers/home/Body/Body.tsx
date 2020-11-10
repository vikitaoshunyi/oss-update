import React from 'react';
import { Button, Table, Modal, Input, message, Popconfirm, Checkbox } from "antd";
import { remote } from "electron";
import { uploadSingle, upload, getFile, hasFile } from "@app/oss/upload";
import { getStore } from "@app/redux/store";
import { syncing, updateResourceData, uploadConfirm, uploadPercent } from "@app/redux/action/action";
import { ExclamationCircleOutlined } from '@ant-design/icons';
const path = require("path");
const url = require('url')
import moment from "moment";
import "./style.scss";
import { v4 as uuidv4 } from 'uuid';
const { confirm } = Modal;
// var { aa } =  require("@app/utils/test");
interface IProp {
  content: any;
  itemIndex: number;
  buckets: any;
  bucketIndex: number;
  syncing: boolean;
  uploadConfirm: boolean;
  uploadType: number;
  onAddResource: (localDir:string, remoteDir: string, mode?: number, id?: string) => void;
  onRemoveResource: (id: number) => void;
}
interface IState {
  show: boolean;
  mLocalDir: string;
  mRemoteDir: string;
  syncing: boolean;
}
class Body extends React.PureComponent<IProp, IState> {
  mode: number;
  editId: any;
  constructor(props: IProp, context: IState) {
    super(props, context);
    this.state = {
      show: false,
      mLocalDir: "",
      mRemoteDir: "",
      syncing: false
    };
    this.mode = 1;
    this.addResourceClick = this.addResourceClick.bind(this);
    this.updateResourceClick = this.updateResourceClick.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onOssPathChange = this.onOssPathChange.bind(this);
    this.browseClick = this.browseClick.bind(this);
    this.syncClick = this.syncClick.bind(this);
  }
  render() {
    let { content, bucketIndex, itemIndex, syncing } = this.props;
    let { show, mLocalDir , mRemoteDir } = this.state;
    const columns = [
      { title: '本地路径', dataIndex: 'localDir', key: 'localDir',},
      { title: 'oss路径', dataIndex: 'remoteDir',key: 'remoteDir'},
      { title: '同步时间', dataIndex: 'syncTime',key: 'syncTime', render: (text: any) => {
        if(!text) {
          return "";
        }
        return moment(new Date(text)).format("YYYY-MM-DD h:mm:ss");
      }},
      { title: '同步文件', dataIndex: 'syncFiles',key: 'syncFiles'},
      { title: '修改', dataIndex: "", fixed: "right" as any, render: (text: any, record: any, index: any) => {
        return  <a href="#" data-id={record.id} data-localdir={record.localDir} data-remotedir={record.remoteDir} onClick={this.updateResourceClick}>修改</a>
      }},
      { title: '删除',  dataIndex: "",  fixed: "right" as any, render: (text: any, record: any, index: any) => {
        return <Popconfirm title="是否确认删除?" onConfirm={this.removeClick.bind(this, text, record, index)}  okText="确定" cancelText="取消">
          <a href="#">删除</a>
        </Popconfirm>;
      }}
    ]
    let inputKey = bucketIndex+"_"+itemIndex;
   
    return (
      <div className="body">
        {
          !content
          ? <div className="b-center-empty">
              {/* <iframe src={url2} frameBorder="0"></iframe> */}
             <span>尚未选择</span>
              {/* <div className="b-center-empty-img"></div> */}
              {/* <img src={require("../../../images/personal_page_empty_status.png").default} alt=""/> */}
            </div>
          : (
            <div className="b-center">
              <div className="b-sync">
                <Button loading={syncing} type="primary" onClick={this.syncClick}>同步</Button>
                <Button onClick={this.addResourceClick}>添加</Button>
              </div>
              <Table rowKey="id" columns={columns} dataSource={content} scroll={{x:true}} ></Table>
            </div>
          )
        }
         <Modal
          wrapClassName="b-add-box"
          title="添加资源"
          visible={show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Input key={inputKey+"_1"} addonBefore="本地路径" defaultValue="" value={mLocalDir} addonAfter={<Button onClick={this.browseClick} style={{color: "#0057ff"}} type="link" ghost size="small">浏览</Button>  }/>
            <div className="b-add-line"></div>
            <Input key={inputKey+"_2"} onChange={this.onOssPathChange} addonBefore="oss路径" defaultValue="" value={mRemoteDir}/>
          </div>
        </Modal>
      </div>
    );
  }
  componentDidMount() {
    // return;
  }
  
  addResourceClick() {
    // remote.dialog.showOpenDialog({
    //   title: "轻易选择"
    // })
    let { syncing } = this.props;
    if (syncing) {
      message.error("正在执行同步...请稍后...");
    } else {
      this.mode = 1;
      this.setState({
        show: true,
      })

    }
  }
  updateResourceClick(e:any) {
    let { syncing } = this.props;
    if (syncing) {
      message.error("正在执行同步...请稍后...");
    } else {
      this.mode = 2;
      let { id,remotedir,localdir } = e.currentTarget.dataset;
      this.editId = id;
      this.setState({
        show: true,
        mRemoteDir: remotedir,
        mLocalDir: localdir
      })

    }
  }
  handleOk() {
    let { mRemoteDir, mLocalDir } = this.state;
    let { onAddResource } = this.props;
    if (mRemoteDir && mLocalDir) {
      this.setState({
        show: false,
        mRemoteDir: "",
        mLocalDir: ""
      })
      onAddResource(mLocalDir, mRemoteDir, this.mode, this.editId);
    } else {
      message.warning("请填写路径!")
    }
  }
  handleCancel() {
    this.setState({
      show: false,
      mRemoteDir: "",
      mLocalDir: ""
    })
  }
  onOssPathChange(e: any) {
    this.setState({
      mRemoteDir: e.target.value
    });
  }
  browseClick() {
    remote.dialog.showOpenDialog({
      title: "请选择文件夹",
      properties: ["openDirectory"]
    }).then(({canceled, filePaths}) => {
      if (!canceled && filePaths.length) {
        let path = filePaths[0];
        this.setState({
          mLocalDir: path
        });
      }
    })
  }
  removeClick(text: any, record: any, index: any) {
    let { onRemoveResource } = this.props;
    if (onRemoveResource) {
      onRemoveResource(record.id);
    }
  }
  async syncClick() {
    let { content,buckets, bucketIndex, itemIndex } = this.props;
    var value = buckets && buckets[bucketIndex]?.items && buckets[bucketIndex]?.items[itemIndex];
    if (!value) {
      return message.error("未找到当前同步信息!");
    }
    if (content && content.length) {
      let uploadFiles = content.map((data: any) => {
        return getFile(data.localDir);
      });
      let filesArr: Array<any> = await Promise.all(uploadFiles).catch(() => []);
      // filesArr = filesArr.flat();
      let flatFilesArr = filesArr.flat(Infinity);
      let flatLength = flatFilesArr.length;
      if (!filesArr || !filesArr.length) return;
      getStore().dispatch(syncing(true));
      getStore().dispatch(uploadPercent([0, 0, flatLength, 0]));
      let contentNameArr = [];
      let tempIndex = 0;
      for(let i = 0; i < content.length; i++) {
        let data = content[i];
        let nameArr = [];
        for(let file of filesArr[i]) {
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
          getStore().dispatch(uploadPercent([Math.round(tempIndex/flatLength * 100), 100, flatLength, tempIndex] ));
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
      getStore().dispatch(updateResourceData(d, value.id));
      message.success("同步成功!")
      getStore().dispatch(syncing(false));
      
    } else {
      message.warning("请添加同步文件路径配置!")
    }
  }
  async handleConfirm(remotePath: string) {
    return new Promise((resolve, reject) => {
      confirm({
        title: `文件:${remotePath}已存在,是否覆盖?`,
        icon: <ExclamationCircleOutlined />,
        content: <Checkbox onChange={(e)=>{
          getStore().dispatch(uploadConfirm(!e.target.checked));
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
export default Body;