/*
 *   创建user reducer
 */
import * as actionTypes from '../constants/action';
import { get, save } from "@app/utils/store";
import { v4 as uuidv4 } from 'uuid';
// import * as homeType from "../constants/home"
export interface IState {
  buckets: Array<any>;
  bucketIndex: number;
  itemIndex: number | null;
  [index: number]: any;
  syncing: boolean;
  uploadConfirm: boolean;
  percent: any;
  filePercent: any;
}
const defaultState = {
  buckets: [
    // {
    //
    //   items: []
    // }
  ] as any,
  bucketIndex: 0,
  itemIndex: null as any,
  syncing: false,
  uploadConfirm: true,
  uploadType: 1, // 1覆盖,2跳过
  percent: {
    all: 100,
    file: 100,
    length:0,
    index: 0
  },
}
let initialState: IState = null;
try {
  let storeState = get();
  initialState = storeState ? {...defaultState, ...get()} : defaultState;
  save(initialState);
} catch(e) {

}

let saveActions = [
  actionTypes.ADD_RESOURCE,
  actionTypes.REMOVE_RESOURCE,
  actionTypes.ADD_ITEM,
  actionTypes.UPDATE_RESOURCE_DATA,
  actionTypes.ADD_BUCKET,
  actionTypes.MODIFY_BUCKET,
  actionTypes.UPDATE_RESOURCE,
  actionTypes.DEL_ITEM,
]
export default function main (state = initialState, action: any) {
  let newState: IState = Object.assign({}, state);
  switch (action.type) {
    case actionTypes.ACTIVE_ITEM:{
      let id = action.data;
      let items = newState.buckets[newState.bucketIndex] && newState.buckets[newState.bucketIndex].items;
      let index = null;
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          if (item.id === id) {
            index = i;
            break;

          }
        }
      }
      newState.itemIndex = index;
      break;
    }
    case actionTypes.ADD_ITEM: {
      let nowBucket = newState.buckets[newState.bucketIndex];
      let items = nowBucket.items;
      let temp = {
        id: uuidv4(),
        title: action.data,
        checked: false,
        config: [] as any,
      };
      nowBucket.items = [...nowBucket.items, temp];
      newState.buckets = [...newState.buckets];
      break;
    }
    case actionTypes.DEL_ITEM: {
      let nowBucket = newState.buckets[newState.bucketIndex];
      let items = nowBucket.items;
      let id = action.data;
      nowBucket.items = items.filter((item: any) => { return item.id !== id;});
      if (nowBucket.items.length < newState.itemIndex + 1) {
        newState.itemIndex = nowBucket.items.length - 1;
      }
      newState.buckets = [...newState.buckets];
      
      break;
    }
    case actionTypes.ADD_RESOURCE: {
      let nowBucket = newState.buckets[newState.bucketIndex];
      let items = nowBucket.items;
      let item = items[newState.itemIndex];
      let config = item.config || [];
      item.config = [...config, {id:uuidv4(),localDir: action.data.localDir, remoteDir: action.data.remoteDir}]
      newState.buckets = [...newState.buckets];
      break;
    }
    case actionTypes.UPDATE_RESOURCE: {
      let nowBucket = newState.buckets[newState.bucketIndex];
      let items = nowBucket.items;
      let item = items[newState.itemIndex];
      let config = item.config || [];
      let value = config.find((d:any) => { return d.id === action.data.id;})
      if (value) {
        value.localDir = action.data.localDir;
        value.remoteDir = action.data.remoteDir;
        item.config = [...config];
        newState.buckets = [...newState.buckets];
      }
      break;
    }
    case actionTypes.REMOVE_RESOURCE: {
      let nowBucket = newState.buckets[newState.bucketIndex];
      let items = nowBucket.items;
      let item = items[newState.itemIndex];
      item.config = item.config.filter((item: any) => {
        console.log(item.id !== action.data);
        return item.id !== action.data;
      });
      newState.buckets = [...newState.buckets];
      break
    }
    case actionTypes.UPDATE_RESOURCE_DATA: {
      let itemData = action.data;
      let id = action.id;
      let itemIndex = -1;
      if (id) {
        let items = newState.buckets[newState.bucketIndex].items || [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            itemIndex = i;
            break;
          }
        }
      }
      if (itemIndex > -1) {
        // let itemIndex = id != null ? index : newState.itemIndex;
        try {
          let newItem = newState.buckets[newState.bucketIndex].items[itemIndex].config;
          newState.buckets[newState.bucketIndex].items[itemIndex].config = newItem.map((item: any, i: number) => {
            return { ...item, ...itemData[i]};
          });
          newState.buckets = [...newState.buckets];
        }catch(e) {}
        
      }
      break;
    }
    case actionTypes.SYNCING: {
      newState.syncing = action.data;
      break;
    }
    case actionTypes.MUTI_SYNCING: {
      newState.syncing = action.data;
      let items = newState.buckets[newState.bucketIndex].items;
      break;
    }
    
    case actionTypes.CHECK_ITEMS: {
      let id = action.data;
      let items = newState.buckets[newState.bucketIndex].items;
      let item = items.find((item: any) => { return item.id === id;})
      item.checked = !item.checked;
      newState.buckets[newState.bucketIndex].items = [...items];
      newState.buckets = [...newState.buckets];
      break;
    }
    case actionTypes.ADD_BUCKET: {
      let temp = {
        id: uuidv4(),
        ak: "",
        sk: "",
        bucket: "",
        region: "",
        items: [] as any
      };
      let bucket = Object.assign({}, temp, action.data)
      newState.buckets = [...newState.buckets, bucket];
      let length = newState.buckets.length;
      newState.bucketIndex = length - 1;
      break;
    }
    case actionTypes.MODIFY_BUCKET: {
      let bucket = newState.buckets[newState.bucketIndex];
      newState.buckets[newState.bucketIndex] = {...bucket, ...action.data}
      newState.buckets = [...newState.buckets];
      break;
    }
    case actionTypes.ACTIVE_BUCKET: {
      let id = action.data;
      for(let i = 0; i < newState.buckets.length; i++) {
        let bt = newState.buckets[i];
        if (bt.id === id) {
          newState.bucketIndex = i;
          break;
        }
      }
      newState.itemIndex = null;
      break;
      
    }
    case actionTypes.UPLOAD_CONFIRM: {
      newState.uploadConfirm = action.data;
      break;
    }
    case actionTypes.UPLOAD_PERCENT: {
      let [all, file, length, index] = action.data;
      newState.percent = {
        all: all ?? newState.percent.all,
        file: file ?? newState.percent.file,
        length: length ?? newState.percent.length,
        index: index ?? newState.percent.index
      };
      
      break;
    }
    
    default:
      return state;
  }
  // 保存数据库
  if (saveActions.indexOf(action.type) > -1) {
    save(newState);
  }
  return newState;
}