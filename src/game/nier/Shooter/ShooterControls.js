import React, {Component} from 'react';

import PropTypes from 'prop-types';
import * as THREE from 'three';
import * as CANNON from 'cannon';

export class ShooterControls extends React.Component {

  moveRatio = this.props.moveRatio || 0.3;

  moveVelocity = {
    value:0,
      max:1,
      min:1,
      variation:0.01
  };

  state = {
      activeLeft:false,
      activeRight:false,
      activeUp:false,
      activeDown:false,
      movementCallback:null
  }

  moveLeft = () =>
  {
    // console.log('moveLeft');
    // this.activeMovements.left=true;
    this.props.pivot.physicsBody.position.x-=this.moveRatio;
  }

  moveRight = () =>
  {
    // console.log('moveRight');
    this.props.pivot.physicsBody.position.x+=this.moveRatio;
  }

  moveUp = () =>
  {
    // console.log('moveUp');
    this.props.pivot.physicsBody.position.y+=this.moveRatio;
  }

  moveDown = () =>
  {
    // console.log('moveDown',this.props.pivot.physicsBody);
    // this.props.pivot.position.y-=this.moveRatio;
      this.props.pivot.physicsBody.position.y-=this.moveRatio;
    // //   this.props.pivot.physicsBody.angularDamping = 0;
    //   this.props.pivot.physicsBody.linearFactor.x =0;
    //   this.props.pivot.physicsBody.linearFactor.z =0;
    //   this.props.pivot.physicsBody.linearFactor.y =0;
    //   this.props.pivot.physicsBody.velocity.y += 1;
  }

  shoot = () => {
    console.log('shoot');
  }

  mouseLook = (e) => {
    // console.log('mouseLook',e);
    const _coords = e.detail.coordinates;
    // this.props.pivot.lookAt(new THREE.Vector3(_coords.x,_coords.y,_coords.z ));
      //console.log(this.props.pivot);
      // this.props.pivot.physicsBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), _coords.z * 2);
      this.props.pivot.physicsBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), _coords.x * 2);
      // this.props.pivot.physicsBody.rotation.y += _coords.x * 0.002;
      // this.props.pivot.physicsBody.rotation.x += _coords.y * 0.002;
  }

  eventsMap = {
    moveleft: ()=>this.setState({activeLeft:true}),
    moveright:()=>this.setState({activeRight:true}),
    moveup:()=>this.setState({activeUp:true}),
    movedown:()=>this.setState({activeDown:true}),
    moveleft_keyup: ()=>this.setState({activeLeft:false}),
    moveright_keyup:()=>this.setState({activeRight:false}),
    moveup_keyup:()=>this.setState({activeUp:false}),
    movedown_keyup:()=>this.setState({activeDown:false}),
    shoot:this.shoot,
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
      if (this.state.activeLeft) this.moveLeft();
      if (this.state.activeRight) this.moveRight();
      if (this.state.activeUp) this.moveUp();
      if (this.state.activeDown) this.moveDown();
  };

  render()
    {
      // Wraps the input component in a container, without mutating it. Good!
      return null;
    }
}

ShooterControls.propTypes = {
};