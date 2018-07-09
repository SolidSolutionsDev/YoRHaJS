import React, {Component} from 'react';
import {ShooterGeometryComponent} from './ShooterGeometryComponent';

export default class Shooter extends Component {

  plane;
  planePhysics;

  addPlane = ( plane ) => {
    this.plane = plane;
    console.info( plane.component.mesh );
    this.plane.physicsObject = this.props.getPhysicsManager().
        addNewBoxBody( plane.component.mesh,
            this.props, plane.component );
  };

  render = () => {
    // return <div key="div">board</div>;
    return <div key="div">board
      <ShooterGeometryComponent key="shooter"
                                ref={this.addPlane} {...this.props}/>
    </div>;
  };
}
