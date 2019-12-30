import React from "react";
import * as _ from 'lodash';
// mousedebug
import PropTypes from "prop-types";

import * as THREE from "three";

export class AutoShooterControls extends React.Component {

    shootIntervalCallback;
    shootTimeInterval = 55;

    shootLastTime = 0;

    currentTestInstanceId = null;
    currentShooterDirection = new THREE.Vector3(0, 1, 0);

    updateTime = null;

    startShooting = () => {
        // console.log("shoot",this);
        if (!this.shootIntervalCallback) {
            this.shootIntervalCallback = setInterval(this.shootBullet, this.shootTimeInterval);
        }
    };

    stopShooting = () => {
        if (this.shootIntervalCallback) {
            clearInterval(this.shootIntervalCallback);
            this.shootIntervalCallback = null;
        }
    };


    initSound = () => {
        const {transform, availableService} = this.props;
        const _sound = availableService.audio.buildPositionalSound(this.props.selfSettings.soundLocation);
        _sound.setLoop(false);
        _sound.loop = false;
        transform.add(_sound);
        if (_sound.isPlaying) {
            _sound.stop();
        }
        this.sound = _sound;
        // console.log(_sound);
        // needs delay to play
    }


    shootBullet = () => {
        var shootStartTime = Date.now();
        const {instantiateFromPrefab, transform, destroyGameObjectById,bulletType, bulletSpeed} = this.props;
        const {position, rotation, scale} = transform;
        // console.log("startShooting",this.currentShooterDirection);
        const _position = position.clone();
        this.props.transform.getWorldDirection( this.currentShooterDirection );
        _position.addScaledVector(this.currentShooterDirection, 0);
        this.currentTestInstanceId = _.uniqueId(bulletType);

        instantiateFromPrefab(
            "PlayerBullet",
            this.currentTestInstanceId,
            {
                position: _position,
                rotation,
                scale
            },
            null,
          this.updateTime,
            {
                playerBulletGeometry:{
                    initialTimeBullet: this.updateTime,
                    moveRatio: 1,
                }
            }
        );

        setTimeout(() => {
            this.sound.isPlaying ? this.sound.stop() : null;
            this.sound.play();
        }, 50);
        var currentTime = Date.now();

       // console.log(this.shootTimeInterval - (currentTime - this.shootLastTime), currentTime - shootStartTime);
        this.shootLastTime = currentTime;
    }



    update = (time) => {
        this.updateTime=time;
    }


    start = () => {

        this.shootTimeInterval = this.props.shootTimeInterval || this.shootTimeInterval;

        this.initSound();
        this.startShooting();
    };

    onDestroy = ()=> {
        this.stopShooting();
    }


    render = () => null;
}

AutoShooterControls.propTypes = {
    auto: PropTypes.bool,
    bulletSpeed: PropTypes.number,
    shootTimeInterval: PropTypes.number,
    soundLocation: PropTypes.string,
    bulletType: PropTypes.string.isRequired,
    direction: PropTypes.string,
}
