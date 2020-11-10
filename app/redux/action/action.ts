import * as actionTypes from '../constants/action';

export function activeItem(data: any) {
    return {
        type: actionTypes.ACTIVE_ITEM,
        data
    };
}
export function addItem(data: any) {
  return {
      type: actionTypes.ADD_ITEM,
      data
  };
}
export function delItem(data: any) {
  return {
      type: actionTypes.DEL_ITEM,
      data
  };
}
export function addResource(data: any) {
  return {
      type: actionTypes.ADD_RESOURCE,
      data
  };
}
export function updateResource(data: any) {
  return {
      type: actionTypes.UPDATE_RESOURCE,
      data
  };
}
export function removeResource(data: any) {
  return {
      type: actionTypes.REMOVE_RESOURCE,
      data
  };
}
export function updateResourceData(data: any, id?: number) {
  return {
      type: actionTypes.UPDATE_RESOURCE_DATA,
      data,
      id
  };
}
export function syncing(data: any) {
  return {
      type: actionTypes.SYNCING,
      data
  };
}
export function mutiSyncing(data: any) {
  return {
      type: actionTypes.MUTI_SYNCING,
      data
  };
}

export function checkItem(data: any) {
  return {
      type: actionTypes.CHECK_ITEMS,
      data
  };
}
export function addBucket(data: any) {
  return {
      type: actionTypes.ADD_BUCKET,
      data
  };
}
export function modifyBucket(data: any) {
  return {
      type: actionTypes.MODIFY_BUCKET,
      data
  };
}

export function activeBucket(data: any) {
  return {
      type: actionTypes.ACTIVE_BUCKET,
      data
  };
}
export function uploadConfirm(data: any) {
  return {
      type: actionTypes.UPLOAD_CONFIRM,
      data
  };
}
export function uploadPercent(data: any) {
  return {
      type: actionTypes.UPLOAD_PERCENT,
      data
  };
}





