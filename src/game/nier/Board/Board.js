import React, {Component} from 'react';
import {PlaneGeometryComponent} from './PlaneGeometryComponent';

export default class Board extends Component {

  render = () => {
    // return <div key="div">board</div>;
    return <div key="div">board
      <PlaneGeometryComponent key="plane" {...this.props}/>
    </div>;
  };
}
