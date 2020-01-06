import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import * as CANNON from "cannon";
import { destroyGameObjectById } from "../../../../stores/scene/actions";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PlayerBulletGeometry extends React.Component {
  cube;
  selfDestructTime = this.props.selfDestructTime || 2000;
  moveRatio = this.props.moveRatio || 0.03;
  displacementRatio = this.props.displacementRatio || 3;
  selfDestructing = false;
  shooter = null;
  active = true;
  zCoord = 6 + this.props.bulletIndex*1.3;

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

  selfDestructOld = () => {
    const { _parentId, availableComponent } = this.props;
    const { scene } = availableComponent;
    this.selfDestructing = true;
    scene.enqueueAction(destroyGameObjectById(_parentId), {
      nonImmediate: true
    });
    // destroyGameObjectById(_parentId);
    this.cube.visible = false;
  };

  start = time => {
    const {
      shooterId,
      gameObject,
      availableComponent,
      selfSettings
    } = this.props;
    const { scene } = availableComponent;
    this.initBulletGeometry();
    this.initPhysics();
    // const shooter = gameObject.getChildGameObjectsByTag(shooterTag, scene);
    const shooterById = gameObject.getChildGameObjectById(shooterId, scene);
    this.shooter = shooterById;
    this.shooter = this.shooter.getComponent(selfSettings.shooterComponentId);
    if (this.timeToEnd < time && !this.selfDestructing) {
      this.selfDestruct();
      this.active = false;
    }
  };

  // TODO: move this to physics?
  moveForwardManual = time => {
    const { transform } = this.props;
    const timePassed = time - this.props.initTime;

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

  inactivePosition = () => {
    const { transform } = this.props;
    const shooterTransform = this.shooter.props.transform;

    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      shooterTransform.rotation.z
    );

    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);

    transform.physicsBody.position.y = shooterTransform.position.y;
    transform.physicsBody.position.x = shooterTransform.position.x;
    transform.physicsBody.position.z = this.zCoord;
  };

  setActive = () => {
    this.active = true;
    this.selfDestructing = false;
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

PlayerBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired
};
