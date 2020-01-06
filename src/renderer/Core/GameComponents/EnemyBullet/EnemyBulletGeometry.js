import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import * as CANNON from "cannon";
import { destroyGameObjectById } from "../../../../stores/scene/actions";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class EnemyBulletGeometry extends React.Component {
  sphereMesh;
  selfDestructTime = 2000;
  moveRatio = this.props.moveRatio || 0.03;
  displacementRatio = this.props.displacementRatio || 3;

  selfDestructing = false;
  shooter = null;
  active = true;
  zCoord = 6 + this.props.bulletIndex * 1.3;

  initBulletGeometry = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xfa7911 : 0x290642 });
    opacity && (material.opacity = opacity);
    this.sphereMesh = new THREE.Mesh(geometry, material);
    this.sphereMesh.castShadow = true;
    this.sphereMesh.scale.set(0, 0, 0);
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
    this.updateTransform();
  };

  updateTransform = () => {
    const { gameObject, transform } = this.props;
    const transformValue = gameObject.props.transform;

    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      transformValue.rotation.z
    );

    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);
    this.initialPosition = transformValue.position.clone();
    this.initialPosition.x += worldForward.x * this.displacementRatio;
    this.initialPosition.y += worldForward.y * this.displacementRatio;
    transform.physicsBody.position.x = this.initialPosition.x;
    transform.physicsBody.position.y = this.initialPosition.y;
    transform.physicsBody.position.z = this.initialPosition.z;
  };

  selfDestruct = () => {
    this.selfDestructing = true;
    this.active = false;
    this.shooter.announceAvailableBullet(this);
  };

  setActive = () => {
    this.active = true;
    this.selfDestructing = false;
  };

  inactivePosition = () => {

    const { gameObject, transform } = this.props;
    const transformValue = gameObject.props.transform;

    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      transformValue.rotation.z
    );

    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);
    this.initialPosition = transformValue.position.clone();
    this.initialPosition.x += worldForward.x * this.displacementRatio;
    this.initialPosition.y += worldForward.y * this.displacementRatio;
    transform.physicsBody.position.x = this.initialPosition.x;
    transform.physicsBody.position.y = this.initialPosition.y;
    transform.physicsBody.position.z = this.zCoord;
  };


  start = time => {
    this.initBulletGeometry();
    this.initPhysics();
    this.initShooter();
    this.checkIfIsInactive(time);
  };

  checkIfIsInactive = time => {
    if (this.timeToEnd < time && !this.selfDestructing) {
      this.selfDestruct();
      this.active = false;
    }
  };

  initShooter = () => {
    const {
      shooterId,
      gameObject,
      availableComponent,
      selfSettings
    } = this.props;
    const { scene } = availableComponent;
    const shooterById = gameObject.getChildGameObjectById(shooterId, scene);
    this.shooter = shooterById;
    this.shooter = this.shooter.getComponent(selfSettings.shooterComponentId);
  };

  // TODO: move this to physics?
  moveForwardManual = time => {
    const { transform, gameObject } = this.props;
    const transformValue = gameObject.props.transform;
    const timePassed = time - this.props.initTime;


    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      transformValue.rotation.z
    );

    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);

    transform.physicsBody.position.y =
      this.initialPosition.y +
      (timePassed / 100) * this.moveRatio * worldForward.y;
    transform.physicsBody.position.x =
      this.initialPosition.x +
      (timePassed / 100) * this.moveRatio * worldForward.x;
  };

  update = time => {

    const { transform, initTime } = this.props;

    const isBulletStillWithTimeOfLife =
      time - this.props.initTime < this.selfDestructTime;

    this.timeToEnd =
      !this.timeToEnd || isBulletStillWithTimeOfLife
        ? this.props.initTime + this.selfDestructTime
        : this.timeToEnd;

    if (initTime !== -1 && this.timeToEnd > time) {
      this.setActive();
      this.updateTransform();
      if (this.sphereMesh.scale.x < 1 ){
        this.sphereMesh.scale.x += 0.1;
        this.sphereMesh.scale.y += 0.1;
        this.sphereMesh.scale.z += 0.1;
      }
    }

    if ((initTime === -1 || this.timeToEnd < time) && !this.selfDestructing) {
      this.selfDestruct();
    }

    if (!this.active) {
      this.inactivePosition();
      return;
    }

    if (transform.physicsBody) {
      this.moveForwardManual(time);
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
