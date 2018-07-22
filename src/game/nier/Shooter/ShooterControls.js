import React, {Component} from 'react';

import PropTypes from 'prop-types';
import * as THREE from 'three';

export class ShooterControls extends React.Component {

  moveRatio = this.props.moveRatio || 0.3;

  moveLeft = () =>
  {
    console.log('moveLeft');
    this.props.pivot.position.x-=this.moveRatio;
  }

  moveRight = () =>
  {
    console.log('moveRight');
    this.props.pivot.position.x+=this.moveRatio;
  }

  moveUp = () =>
  {
    console.log('moveUp');
    this.props.pivot.position.y+=this.moveRatio;
  }

  moveDown = () =>
  {
    console.log('moveDown');
    this.props.pivot.position.y-=this.moveRatio;
  }

  mouseLook = (e) => {
    console.log('mouseLook',e);
    const _coords = e.detail.coordinates;
    this.props.pivot.lookAt(new THREE.Vector3(_coords.x,_coords.y,_coords.z ));
  }

  eventsMap = {
    moveleft: this.moveLeft,
    moveright:this.moveRight,
    moveup:this.moveUp,
    movedown:this.moveDown,
    shoot:null,
    mousem:this.mouseLook
  }

  registerEvents = () => {
    Object.keys(this.eventsMap).forEach(
        (event)=> {
          console.log(`here ${event.toString()}`,this.eventsMap[event]);
        document.addEventListener(event,this.eventsMap[event])});
  }

  componentWillMount = () => {
this.registerEvents();
    // this.props.pivot.add( this.mesh );
  };

  update = () => {
    // this.props.pivot.rotation.y += 0.01;
  };

  render()
    {
      // Wraps the input component in a container, without mutating it. Good!
      return null;
    }
}

ShooterControls.propTypes = {
};