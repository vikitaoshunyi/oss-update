import React from "react";
import {HashRouter, BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
// import Login from "@app/containers/login/Index";
import Home from '@app/containers/home/Index';
import AsyncComponent from "@app/components/asyncComponent";
import { ipcRenderer } from "electron"
// import Login from "@app/containers/login/Index";
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
class App extends React.Component<any, any> {
    render() {
        return (
          <HashRouter>
            <Switch>
              <Route exact path="/login" component={AsyncComponent(() => import(/*webpackChunkName:'login'*/"@app/containers/login/Index"))}/>
              <Route path="/" component={Home}/>
            </Switch>
          </HashRouter>
        );
    }
    componentDidMount() {
      
    }
    
}
export default App;