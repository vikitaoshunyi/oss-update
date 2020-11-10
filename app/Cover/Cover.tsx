import React from "react";

export interface IProps { compiler: string; framework: string;}
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Cover extends React.Component<IProps, {}> {
    render() {
        return <h2 >2</h2>;
    }
    getTemp() {
      let temp: string[] = ['12', '32'];
      let arr: Array<any> = temp.map((item: String) => {
        let tet = "13";
        return {stly: tet};
      });
      return arr;
    }
}