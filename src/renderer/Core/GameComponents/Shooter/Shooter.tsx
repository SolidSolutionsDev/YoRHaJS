import React from "react";
// @ts-ignore
import * as _ from "lodash";
import { Audio } from "three";
import {
  instantiateFromPrefab,
  updateGameObject
} from "../../../../stores/scene/actions";

interface ShooterProps {
  id: string;
  shootTimeInterval?: number;
  selfDestructTime?: number;
  shooting?: boolean;
  aroundBullets?: number;
  type?: string;
  bulletPrefab?: "PlayerBullet" | "EnemyBullet";
  transform: any;
  selfSettings: any;
  availableComponent: any;
  availableService: any;
  gameObject: any;
}

export class Shooter extends React.Component<ShooterProps> {
  shootTimeInterval = this.props.shootTimeInterval || 100;
  selfDestructTime = this.props.selfDestructTime || 2000;

  // new shoot logic
  bulletId = 0;
  shooting = this.props.shooting || false;
  aroundBullets = this.props.aroundBullets || 1;
  shootingStartTime: number | null = null;
  updateTime: number | null = null;
  type = this.props.type || "forward";
  bulletPrefab = this.props.bulletPrefab || "PlayerBullet";
  bulletComponentNameFromPrefabName = {
    EnemyBullet: "enemyBulletGeometry",
    PlayerBullet: "playerBulletGeometry"
  };
  bulletComponentName = this.bulletComponentNameFromPrefabName[
    this.bulletPrefab
  ];

  availableBullets: any[] = [];
  availableBulletsForUpdateCycle: any[] = [];
  movingBullets: any[] = [];

  sound: Audio | undefined;

  state = {};

  announceAvailableBullet = (bulletGameObject: any) => {
    this.availableBulletsForUpdateCycle.push(bulletGameObject);
  }

  garbageCollectBullets = () => {
    const filteredMovingBullets = this.movingBullets.filter(
      bullet => !this.availableBulletsForUpdateCycle.includes(bullet)
    );
    // console.log("announce",bulletGameObject,filteredMovingBullets.map((bullet)=>bullet.props.gameObject.props.id),this.movingBullets.map((bullet)=>bullet.props.gameObject.props.id));
    this.movingBullets = filteredMovingBullets;
    // console.log("garbageCollect",this.availableBulletsForUpdateCycle,this.availableBullets,this.movingBullets);
    while (this.availableBulletsForUpdateCycle.length) {
      this.availableBullets.unshift(this.availableBulletsForUpdateCycle.pop());
    }
  };


  shootForwardBullet = (time: number) => {
    if (this.shootingStartTime === null) return;

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

      const { transform, selfSettings, availableComponent } = this.props;
      const { scene } = availableComponent;
      const { moveRatio, displacementRatio } = selfSettings;
      const { position, rotation, scale } = transform;
      const bullet = this.availableBullets.pop();
      if (!bullet) continue;

      this.movingBullets.push(bullet);
      const currentBulletId = bullet.props.id;
      const currentBulletGameObjectId = bullet.props.gameObject.id;

      this.playBulletSound();
      scene.enqueueAction(
        updateGameObject(currentBulletGameObjectId, {
          transform: {
            position: position.clone(),
            rotation: rotation.clone(),
            scale: scale.clone()
          },
          components: {
            [currentBulletId]: {
              initTime: startTimeForThisBullet,
              bulletIndex,
              moveRatio,
              displacementRatio
              // shooterId: gameObject.id,
              // shooterTag: gameObject._tags[0],
            }
          }
        })
      );
    }

    // total new bullets
    this.bulletId += bulletsToShootNow;
  };

  initBullets = () => {
    const bulletsToInit = Math.floor(
      this.selfDestructTime / this.shootTimeInterval
    );

    for (let bulletIndex = 1; bulletIndex <= bulletsToInit + 5; bulletIndex++) {
      const {
        transform,
        selfSettings,
        availableComponent,
        gameObject
      } = this.props;
      const { scene } = availableComponent;
      const { moveRatio, displacementRatio } = selfSettings;
      const { position, rotation, scale } = transform;
      const startTimeForThisBullet = -1; // to be inactive

      const angleChange = (2 * Math.PI) / this.aroundBullets;

      for (let i = 0; i < this.aroundBullets; i++) {
        const currentBulletId = _.uniqueId(this.bulletPrefab);
        const _rotation = rotation.clone();
        // _rotation.z += angleChange * i;
        _rotation._z = rotation._z + angleChange * i;

        scene.enqueueAction(
          instantiateFromPrefab(
            this.bulletPrefab,
            currentBulletId,
            {
              position,
              rotation: _rotation,
              scale
            },
            "",
            -1,
            {
              bulletMovement: {
                around: this.aroundBullets > 1,
                initTime: startTimeForThisBullet,
                bulletIndex,
                moveRatio,
                displacementRatio,
                shooterId: gameObject.id,
                shooterTag: gameObject._tags[0],
                shooterComponentId: this.props.id
              }
            }
          )
        );
      }
      // this.playBulletSound();
    }

    // total new bullets
    this.bulletId += bulletsToInit;
  };

  shootAroundBullet = (time: number) => {
    if (this.shootingStartTime === null) return;
    // compute how many bullets to shoot now to catch up time step
    const totalShotBulletsTime = this.bulletId * this.shootTimeInterval;
    const timePassedFromLastShot =
      time - (this.shootingStartTime + totalShotBulletsTime);
    const bulletsToShootNow = Math.floor(
      timePassedFromLastShot / this.shootTimeInterval
    );

    const { transform, selfSettings, availableComponent } = this.props;
    const { scene } = availableComponent;
    const { moveRatio, displacementRatio } = selfSettings;
    const { position, rotation, scale } = transform;


    const angleChange = (2 * Math.PI) / this.aroundBullets;

    for (let bulletIndex = 1; bulletIndex <= bulletsToShootNow; bulletIndex++) {
      const startTimeForThisBullet =
        this.shootingStartTime +
        totalShotBulletsTime +
        bulletIndex * this.shootTimeInterval;

      for (let i = 0; i < this.aroundBullets; i++) {
        const _rotation = rotation.clone();
        // _rotation.z += angleChange * i;
        _rotation._z = rotation._z + angleChange * i;

        const bullet = this.availableBullets.pop();
        if (!bullet) { return; }
        this.movingBullets.push(bullet);
        const currentBulletId = bullet.props.id;
        const currentBulletGameObjectId = bullet.props.gameObject.id;

        this.playBulletSound();
        scene.enqueueAction(
          updateGameObject(currentBulletGameObjectId, {
            transform: {
              position: position.clone(),
              rotation: _rotation.clone(),
              scale: scale.clone()
            },
            components: {
              [currentBulletId]: {
                initTime: startTimeForThisBullet,
                bulletIndex,
                moveRatio,
                displacementRatio,
                shooterComponentId: this.props.id
                // shooterId: gameObject.id,
                // shooterTag: gameObject._tags[0],
              }
            }
          })
        );
      }
    }

    // total new bullets
    this.bulletId += bulletsToShootNow;
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
    if (!this.sound) {
      return;
    }
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      this.sound && (this.sound.isPlaying ? this.sound.stop() : null) as any;
      this.sound && this.sound.play();
    }, 50);
  };

  initSound = () => {
    const { transform, availableService, selfSettings } = this.props;
    if (!selfSettings.soundLocation) {
      return;
    }
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
    // this.initBulletsFunction[this.type]();
    this.initBullets();
  };

  update = (time: number) => {
    this.updateTime = time;
    if (this.shooting) {
      this.garbageCollectBullets();
      this.shootAroundBullet(time);
    }
  };

  onDestroy = () => {
    this.stopShooting();
  };

  render = () => null;
}

