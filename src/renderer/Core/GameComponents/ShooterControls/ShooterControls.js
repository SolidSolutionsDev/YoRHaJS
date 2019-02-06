import React, { Component } from "react";

import PropTypes from "prop-types";
import * as THREE from "three";
import * as CANNON from "cannon";

export class ShooterControls extends React.Component {
  moveRatio = this.props.moveRatio || 0.3;

  moveVelocity = {
    value: 0,
    max: 1,
    min: 1,
    variation: 0.01
  };

  state = {
    activeLeft: false,
    activeRight: false,
    activeUp: false,
    activeDown: false,
    movementCallback: null
  };

  moveLeft = () => {

    const { transform } = this.props;
    // console.log('moveLeft');
    // this.activeMovements.left=true;
    transform.physicsBody.position.x -= this.moveRatio;
  };

  moveRight = () => {

    const { transform } = this.props;
    // console.log('moveRight');
    transform.physicsBody.position.x += this.moveRatio;
  };

  moveUp = () => {

    const { transform } = this.props;
    // console.log('moveUp');
    transform.physicsBody.position.y += this.moveRatio;
  };

  moveDown = () => {

    const { transform } = this.props;
    // console.log('moveDown',transform.physicsBody);
    // transform.position.y-=this.moveRatio;
    transform.physicsBody.position.y -= this.moveRatio;
    // //   transform.physicsBody.angularDamping = 0;
    //   transform.physicsBody.linearFactor.x =0;
    //   transform.physicsBody.linearFactor.z =0;
    //   transform.physicsBody.linearFactor.y =0;
    //   transform.physicsBody.velocity.y += 1;
  };

  shoot = () => {
    console.log("shoot");
  };

  mouseLook = e => {
    const { transform } = this.props;
    // console.log('mouseLook',e);
    const _coords = e.detail.coordinates;
    // transform.lookAt(new THREE.Vector3(_coords.x,_coords.y,_coords.z ));
    //console.log(transform);
    // transform.physicsBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), _coords.z * 2);
    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      _coords.x * 2
    );
    // transform.physicsBody.rotation.y += _coords.x * 0.002;
    // transform.physicsBody.rotation.x += _coords.y * 0.002;
  };

  eventsMap = {
    moveleft: () => this.setState({ activeLeft: true }),
    moveright: () => this.setState({ activeRight: true }),
    moveup: () => this.setState({ activeUp: true }),
    movedown: () => this.setState({ activeDown: true }),
    moveleft_keyup: () => this.setState({ activeLeft: false }),
    moveright_keyup: () => this.setState({ activeRight: false }),
    moveup_keyup: () => this.setState({ activeUp: false }),
    movedown_keyup: () => this.setState({ activeDown: false }),
    shoot: this.shoot,
    mousem: this.mouseLook
  };

  registerEvents = () => {
    Object.keys(this.eventsMap).forEach(event => {
      // console.log(`here ${event.toString()}`, this.eventsMap[event]);
      document.addEventListener(event, this.eventsMap[event]);
    });
  };

  start = () => {
    this.registerEvents();
    // transform.add( this.mesh );
  };

  update = () => {
    // transform.rotation.y += 0.01;
    if (this.state.activeLeft) this.moveLeft();
    if (this.state.activeRight) this.moveRight();
    if (this.state.activeUp) this.moveUp();
    if (this.state.activeDown) this.moveDown();
  };

    render = () => null;
}

ShooterControls.propTypes = {};
