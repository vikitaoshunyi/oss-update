/*
 *   创建user reducer
 */
import * as actionTypes from '../constants/userinfo';
// import * as homeType from "../constants/home"
let initialState = {};
try {
    let userInfoStr = window.sessionStorage && window.sessionStorage.getItem("userinfo");
    if (userInfoStr) {
        initialState = JSON.parse(userInfoStr);
    }
} catch(e) {

}


export default function userinfo (state = initialState, action: any) {
    switch (action.type) {
        case actionTypes.USERINFO_LOGIN_SUCCESS:
            return action.data;
        case actionTypes.USERINFO_LOGIN_OUT:
            return {};
        case actionTypes.UPDATE_TOKEN: {
            state = action.data;
            window.sessionStorage.setItem("userinfo", JSON.stringify(action.data));
            return state;
        }
        // case homeType.ACTIVE_MY_COMPANY: {
        //     if (state.profile) {
        //         state.profile.companyId = action.data;
        //     }
        //     return state;
        // }
        default:
            return state;
    }
}