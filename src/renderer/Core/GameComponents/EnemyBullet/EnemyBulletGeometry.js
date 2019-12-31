import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import * as CANNON from "cannon";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class EnemyBulletGeometry extends React.Component {
  sphereMesh;
  selfDestructTime = 2000;
  moveRatio = this.props.moveRatio || 0.03;
  displacementRatio = this.props.displacementRatio || 3;
  worldForward ;

  initBulletGeometry = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xfa7911 });
    opacity && (material.opacity = opacity);
    this.sphereMesh = new THREE.Mesh(geometry, material);
    this.sphereMesh.castShadow = true;
    transform.add(this.sphereMesh);
  };

  initPhysics = () => {
    // TODO:move this to prefab and shared bullet physics component
    const { transform, gameObject, availableService } = this.props;

    availableService.physics.addNewSphereBody(
      gameObject.transform,
      {
        ...this.props,
        position: transform.position,
        rotation: transform.rotation,
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
    this.worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, this.worldForward);
    this.initialPosition = transform.position.clone();
    this.initialPosition.x += this.worldForward.x * this.displacementRatio;
    this.initialPosition.y += this.worldForward.y * this.displacementRatio;
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



    // console.log("bushooting 3", time,this.props);
    transform.physicsBody.position.y =
      this.initialPosition.y + (timePassed / 100) * this.moveRatio * this.worldForward.y;
    transform.physicsBody.position.x =
      this.initialPosition.x + (timePassed / 100) * this.moveRatio * this.worldForward.x;
  };

  update = time => {
    const { transform } = this.props;
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

EnemyBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired
};
