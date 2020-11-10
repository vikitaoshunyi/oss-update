import { createStore } from 'redux';
import rootReducer from './reducer/index';

let storeCach: any = {};
let dev: Boolean = process.env.NODE_ENV !== "production";
declare global {
  interface Window {
    requestAnimFrame: any;
    mozRequestAnimationFrame: any;
    mozCancelAnimationFrame: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}
/*
 *   创建store
 */
export default function configureStore(initialState: object) {
    const store = createStore(rootReducer, initialState,
        // 触发 redux-devtools
        // eslint-disable-next-line no-undef
        window.__REDUX_DEVTOOLS_EXTENSION__ && dev ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
    );
    storeCach = store;
    return store;
}

export function getStore() {
    return storeCach;
}