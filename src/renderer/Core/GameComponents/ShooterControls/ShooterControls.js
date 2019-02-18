import React, { Component } from "react";

import PropTypes from "prop-types";
import * as THREE from "three";
import * as CANNON from "cannon";
import * as _ from 'lodash';

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

  lookDown = () => {
    const { transform } = this.props;
      transform.physicsBody.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          Math.PI/2
      );
  };
  lookUp = () => {
    const { transform } = this.props;
      transform.physicsBody.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          -Math.PI/2
      );
  };

  lookLeft = () => {
    const { transform } = this.props;
      transform.physicsBody.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          Math.PI
      );
  };
  lookRight = () => {
    const { transform } = this.props;
      transform.physicsBody.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          0
      );
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
    const {instantiateFromPrefab, transform} = this.props;
    const {position, rotation, scale} = transform;
    console.log("shoot");
    instantiateFromPrefab(
        "TestCube",
        _.uniqueId( "bullet" ),
        {
          position,
          rotation,
          scale,
        },
        );
  };

  mouseLook = e => {
    // console.log('mouseLook',e);
    const _coords = e.detail.coordinates;
    this.coords = _coords;
    // transform.lookAt(new THREE.Vector3(_coords.x,_coords.y,_coords.z ));
    //console.log(transform);
    // transform.physicsBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), _coords.z * 2);

 /*
    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      _coords.x * 2
    );
*/

    // transform.physicsBody.rotation.y += _coords.x * 0.002;
    // transform.physicsBody.rotation.x += _coords.y * 0.002;

      this.updateMouseLook();

      // var canvas = availableComponent.renderer.canvas;
      // vector.x = (vector.x + 1) / 2 * canvas.width;
      // vector.y = -(vector.y - 1) / 2 * canvas.height;

      this.updateMovement();
  };

  updateMouseLook = () => {
      const { transform, availableComponent,availableService } = this.props;
    if (this.coords) {
        const positionClone = transform.position.clone();

        let vector = positionClone.project(availableComponent.camera.camera);
        const _coordsVec3 = availableService.physics.Vec3(this.coords.x, this.coords.y, 0);
        const vectorVec3 = availableService.physics.Vec3(vector.x, vector.y, 0);
        // console.log("\nvector:",vector,"\n_coords:",_coords,"\nvectorVec3:",vectorVec3,"\n_coordsVec3:",_coordsVec3);
        transform.physicsBody.quaternion.setFromVectors( vectorVec3,_coordsVec3);
    }
  }

  updateMovement = () => {
      // transform.rotation.y += 0.01;s
      if (this.state.activeLeft) this.moveLeft();
      if (this.state.activeRight) this.moveRight();
      if (this.state.activeUp) this.moveUp();
      if (this.state.activeDown) this.moveDown();
      if (this.state.activeLookUp) this.lookUp();
      if (this.state.activeLookDown) this.lookDown();
      if (this.state.activeLookLeft) this.lookLeft();
      if (this.state.activeLookRight) this.lookRight();
  }

  eventsMap = {
    moveleft: () => this.setState({ activeLeft: true }),
    moveright: () => this.setState({ activeRight: true }),
    moveup: () => this.setState({ activeUp: true }),
    movedown: () => this.setState({ activeDown: true }),
    moveleft_keyup: () => this.setState({ activeLeft: false }),
    moveright_keyup: () => this.setState({ activeRight: false }),
    moveup_keyup: () => this.setState({ activeUp: false }),
    movedown_keyup: () => this.setState({ activeDown: false }),
    lookup: () => this.setState({ activeLookUp: true }),
    lookup_keyup: () => this.setState({ activeLookUp: false }),
    lookdown: () => this.setState({ activeLookDown: true }),
    lookdown_keyup: () => this.setState({ activeLookDown: false }),
    lookleft: () => this.setState({ activeLookLeft: true }),
    lookleft_keyup: () => this.setState({ activeLookLeft: false }),
    lookright: () => this.setState({ activeLookRight: true }),
    lookright_keyup: () => this.setState({ activeLookRight: false }),
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
    this.updateMovement();
    this.updateMouseLook();
  };

    render = () => null;
}

ShooterControls.propTypes = {};
