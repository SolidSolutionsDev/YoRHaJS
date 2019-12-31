import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import * as CANNON from "cannon";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PlayerBulletGeometry extends React.Component {
  cube;
  selfDestructTime = 2000;
  moveRatio = this.props.moveRatio || 0.03;
  displacementRatio = this.props.displacementRatio || 3;

  initBulletGeometry = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.BoxGeometry(1, 3, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xf8f9e7 });
    opacity && (material.opacity = opacity);
    // material.transparent = true;
    this.cube = new THREE.Mesh(geometry, material);
    transform.add(this.cube);
  };

  initPhysics = () => {
    const { transform, gameObject, availableService } = this.props;

    availableService.physics.addNewBoxBody(
      gameObject.transform,
      {
        ...this.props,
        position: transform.position,
        collisionFilterGroup: 1,
        // linearFactor: new CANNON.Vec3(1, 1, 0),
        // angularFactor: new CANNON.Vec3(0, 0, 0),
        type: "static"
      },
      this
    );
    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      gameObject.transform.rotation.z
    );


    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);
    this.initialPosition = transform.position.clone();
    this.initialPosition.x += worldForward.x *this.displacementRatio;
    this.initialPosition.y += worldForward.y *this.displacementRatio;
    transform.physicsBody.position.x = this.initialPosition.x;
    transform.physicsBody.position.y = this.initialPosition.y;
  };

  selfDestruct = () => {
    const { destroyGameObjectById, _parentId } = this.props;
    destroyGameObjectById(_parentId);
    this.currentTestInstanceId = null;
  };

  start = () => {
    this.initBulletGeometry();
    this.initPhysics();
  };


  // TODO: move this to physics?
  moveForwardManual = time => {
    const { transform } = this.props;
    const timePassed = time - this.props.initTime;


    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);

    // console.log("bushooting 3", time,this.props);
    transform.physicsBody.position.y =
      this.initialPosition.y + (timePassed / 100) * this.moveRatio * worldForward.y;
    transform.physicsBody.position.x =
      this.initialPosition.x + (timePassed / 100) * this.moveRatio * worldForward.x;
  };

  update = time => {
    const { transform, gameObject } = this.props;
    if (transform.physicsBody) {
      this.moveForwardManual(time);
    }
    this.timeToEnd = !this.timeToEnd
      ? time + this.selfDestructTime
      : this.timeToEnd;
    if (this.timeToEnd < time) {
      this.selfDestruct();
    }
  };

  onDestroy = () => {};

  render() {
    return null;
  }
}

PlayerBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired
};
