import React from "react";
import * as _ from "lodash";
import { Vector3 } from "three";

export class Shooter extends React.Component {
  shootTimeInterval = this.props.shootTimeInterval || 100;

  // new shoot logic
  bulletId = 0;
  shooting = this.props.shooting || false;
  shootingStartTime = null;
  updateTime = null;
  type = this.props.type || "forward";

  state = {};

  shootAroundBullet = time => {
    // compute how many bullets to shoot now to catch up time step
    const totalShotBulletsTime = this.bulletId * this.shootTimeInterval;
    const timePassedFromLastShot =
      time - (this.shootingStartTime + totalShotBulletsTime);
    const bulletsToShootNow = Math.floor(
      timePassedFromLastShot / this.shootTimeInterval
    );

    for (let bulletIndex = 1; bulletIndex <= bulletsToShootNow; bulletIndex++) {
      const startTimeForThisBullet =
        this.shootingStartTime +
        totalShotBulletsTime +
        bulletIndex * this.shootTimeInterval;

      const { instantiateFromPrefab, transform, selfSettings } = this.props;
      const { moveRatio, displacementRatio, bulletPrefab,aroundBullets } = selfSettings;
      const { position, rotation, scale } = transform;

      const angleChange = (2 * Math.PI) / aroundBullets;

      for (let i = 0; i < aroundBullets; i++) {
        const currentBulletId = _.uniqueId("bullet");

        const _rotation = rotation.clone();
        // _rotation.z += angleChange * i;
        _rotation._z = rotation._z + angleChange * i;
        instantiateFromPrefab(
          bulletPrefab || "PlayerBullet",
          currentBulletId,
          {
            position,
            rotation: _rotation,
            scale
          },
          null,
          null,
          {
            playerBulletGeometry: {
              initTime: startTimeForThisBullet,
              bulletIndex,
              moveRatio,
              displacementRatio
            }
          }
        );
      }
      this.playBulletSound();
    }

    // total new bullets
    this.bulletId += bulletsToShootNow;
  };

  shootForwardBullet = time => {
    // compute how many bullets to shoot now to catch up time step
    const totalShotBulletsTime = this.bulletId * this.shootTimeInterval;
    const timePassedFromLastShot =
      time - (this.shootingStartTime + totalShotBulletsTime);
    const bulletsToShootNow = Math.floor(
      timePassedFromLastShot / this.shootTimeInterval
    );

    for (let bulletIndex = 1; bulletIndex <= bulletsToShootNow; bulletIndex++) {
      const startTimeForThisBullet =
        this.shootingStartTime +
        totalShotBulletsTime +
        bulletIndex * this.shootTimeInterval;

      const { instantiateFromPrefab, transform, selfSettings } = this.props;
      const { moveRatio, displacementRatio, bulletPrefab } = selfSettings;
      const { position, rotation, scale } = transform;
      const currentBulletId = _.uniqueId("bullet");

      instantiateFromPrefab(
        bulletPrefab || "PlayerBullet",
        currentBulletId,
        {
          position,
          rotation,
          scale
        },
        null,
        null,
        {
          playerBulletGeometry: {
            initTime: startTimeForThisBullet,
            bulletIndex,
            moveRatio,
            displacementRatio
          }
        }
      );
      this.playBulletSound();
    }

    // total new bullets
    this.bulletId += bulletsToShootNow;
  };

  shootFunction = {
    around: this.shootAroundBullet,
    forward: this.shootForwardBullet
  };

  startShooting = () => {
    if (this.shooting) {
      return;
    }
    this.shooting = true;
    this.bulletId = 0;
    this.shootingStartTime = this.updateTime;
  };

  stopShooting = () => {
    this.shooting = false;
  };

  playBulletSound = () => {
    setTimeout(() => {
      this.sound.isPlaying ? this.sound.stop() : null;
      this.sound.play();
    }, 50);
  };

  initSound = () => {
    const { transform, availableService, selfSettings } = this.props;
    const _sound = availableService.audio.buildPositionalSound(
      selfSettings.soundLocation
    );
    _sound.setLoop(false);
    _sound.loop = false;
    transform.add(_sound);
    if (_sound.isPlaying) {
      _sound.stop();
    }
    this.sound = _sound;
  };

  start = () => {
    this.initSound();
  };

  update = time => {
    this.updateTime = time;
    if (this.shooting) {
      this.shootFunction[this.type](time);
    }
  };

  onDestroy = () => {
    this.stopShooting();
  };

  render = () => null;
}
