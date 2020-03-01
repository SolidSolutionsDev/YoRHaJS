import React from "react";
import PropTypes from "prop-types";

import * as CANNON from "cannon";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class BulletMovement extends React.Component {
  selfDestructTime = this.props.selfDestructTime || 2000;
  moveRatio = this.props.moveRatio || 0.03;
  displacementRatio = this.props.displacementRatio || 3;
  selfDestructing = false;
  shooter = null;
  active = true;
  zCoord = 6 + this.props.bulletIndex * 1.3;

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

  start = time => {
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
    const { transform, gameObject, selfSettings } = this.props;
    const { around, debug } = selfSettings;
    const shooterTransform = this.shooter.props.transform;

    const transformValue = gameObject.props.transform;

    let rotationZ = shooterTransform.rotation.z;

    const localForward = new CANNON.Vec3(0, 1, 0); // correct?
    const worldForward = new CANNON.Vec3();
    transform.physicsBody.vectorToWorldFrame(localForward, worldForward);

    transform.physicsBody.position.y = shooterTransform.position.y;
    transform.physicsBody.position.x = shooterTransform.position.x;

    if (around) {
      transform.physicsBody.position.x +=
        worldForward.x * this.displacementRatio;
      transform.physicsBody.position.y +=
        worldForward.y * this.displacementRatio;
      rotationZ += transformValue.rotation.z;
    }

    transform.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      rotationZ
    );

    transform.physicsBody.position.z = this.zCoord;
    if (!debug) {
      transform.visible = false;
    }
  };

  setActive = () => {
    this.active = true;
    this.selfDestructing = false;
    this.props.transform.visible = true;
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

BulletMovement.propTypes = {
  transform: PropTypes.object.isRequired
};
