import React from 'react';
import ReactDOM from 'react-dom';
import { Progress } from 'antd';
import IconFont from "@app/components/Iconfont"
interface IProp {
  fileProgress?: number;
  allProgress?: number;
  length?: number;
  index?: number;
  show?: boolean;
  syncing?: boolean;
  onClose?: () => void;
}
interface IState {
  anClass?: string;
}
class ProgressBox extends React.Component<IProp, IState> {
  constructor(props: IProp, context: IState) {
    super(props, context);
    this.state = {
      anClass: "md-hide"
    };
    this.onClose = this.onClose.bind(this);
  }
  render() {
    let { fileProgress, allProgress, show, syncing, length, index } = this.props;
    let { anClass } = this.state;
    if (show && anClass === "md-hide") return null;
    const dom = (
      <div className={"progress " + anClass}>
        <div className="progress-content">
          <a className="prog-close" onClick={this.onClose} href="#"><IconFont type="icon-cuowu" /></a>
          <p>{syncing ? "上传进度" : "当前未上传"}</p>
          <div className="prog-file">
            当前文件进度:
            <Progress percent={fileProgress} size="small" />
          </div>
          <div className="prog-all">
            总进度:
            <Progress percent={allProgress} size="small" />
          </div>
          <div>
            {syncing ? `共${length??0}个文件,正在上传第${index??0}个...`: `上次上传了${length??0}个文件`}
          </div>
        </div>
      </div>
    );
    return ReactDOM.createPortal(dom, document.getElementsByTagName("body")[0]);
  }
  componentDidMount() {
    if (this.props.show) {
        this.setState({
          anClass: "md-show"
        });
    }else {
        this.setState({
          anClass: "md-hide"
        });
    }
  }
  componentDidUpdate(prevProps: IProp, prevState: IState) {
    if (prevProps.show === this.props.show) return
    if (this.props.show) {
      this.setState({
          anClass: "md-enter"
      },() => {
        window.setTimeout(() => {
            if (!this.props.show) return;
            this.setState({
                anClass: "md-show"
            });
        },30);
      });
      
    }else {
      this.setState({
          anClass: "md-leave"
      });
      window.setTimeout(() => {
          if (this.props.show) return;
          this.setState({
              anClass: "md-hide"
          });
      },300);
    }
      
  }
  onClose(e:any) {
    this.props.onClose && this.props.onClose();
  }
  
}
export default ProgressBox;