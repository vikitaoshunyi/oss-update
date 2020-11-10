import * as actionTypes from '../constants/userinfo';

export function loginSuccess(data: any) {
    return {
        type: actionTypes.USERINFO_LOGIN_SUCCESS,
        data
    };
}
export function loginFailure(data: any) {
    return {
        type: actionTypes.USERINFO_LOGIN_FAILURE,
        data
    };
}

export function loginOut(data: any) {
    return {
        type: actionTypes.USERINFO_LOGIN_OUT,
        data
    };
}
export function updateToken(data: any) {
    return {
        type: actionTypes.UPDATE_TOKEN,
        data: data
    };
}