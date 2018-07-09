import React, {Component} from 'react';
import {PlaneGeometryComponent} from './PlaneGeometryComponent';

export default class Board extends Component {

  plane;
  planePhysics;

  addPlane = ( plane ) => {
    this.plane = plane;
    console.info( plane.component.plane );
  };

  render = () => {
    // return <div key="div">board</div>;
    return <div key="div">board
      <PlaneGeometryComponent key="plane" ref={this.addPlane} {...this.props}/>
    </div>;
  };
}
