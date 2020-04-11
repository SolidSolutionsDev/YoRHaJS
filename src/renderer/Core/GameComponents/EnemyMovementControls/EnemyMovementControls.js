import React from "react";
import * as CANNON from "cannon";
import * as _ from "lodash";
// mousedebug
import * as THREE from "three";
import {Vector2} from "three";

export class EnemyMovementControls extends React.Component {
    shootIntervalCallback;
    shootTimeInterval = 70;
    mouseDebugMesh;
    currentShooterDirection = new THREE.Vector3(0, 1, 0);
    updateTime = 0;

    shootLastTime = 0;

    currentTestInstanceId = null;

    moveRatio = this.props.moveRatio || 0.3;
    rotationSpeed = this.props.rotationSpeed || 0;
    type = this.props.type || "rotate";

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
        const {transform} = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            Math.PI / 2
        );
    };
    lookUp = () => {
        const {transform} = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            -Math.PI / 2
        );
    };

    lookLeft = () => {
        const {transform} = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            Math.PI
        );
    };
    lookRight = () => {
        const {transform} = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            0
        );
    };
    moveLeft = () => {
        const {transform} = this.props;
        // console.log('moveLeft');
        // this.activeMovements.left=true;
        transform.physicsBody.position.x -= this.moveRatio;
        // let forwardVector = new CANNON.Vec3(-1, 0, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveRight = () => {
        const {transform} = this.props;
        // console.log('moveRight');
        transform.physicsBody.position.x += this.moveRatio;
        // let forwardVector = new CANNON.Vec3(1,0, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveUp = () => {
        const {transform} = this.props;
        // console.log('moveUp');
        transform.physicsBody.position.y += this.moveRatio;

        // let forwardVector = new CANNON.Vec3(0, 1, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveDown = () => {
        const {transform} = this.props;
        // console.log('moveDown',transform.physicsBody);
        transform.physicsBody.position.y -= this.moveRatio;
        // let forwardVector = new CANNON.Vec3(0, -1, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    startShooting = () => {
        // console.log("shoot",this);
        if (!this.shootIntervalCallback) {
            this.shootIntervalCallback = setInterval(
                this.shootBullet,
                this.shootTimeInterval
            );
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
        const _sound = availableService.audio.buildPositionalSound(
            this.props.selfSettings.soundLocation
        ).sound;
        _sound.setLoop(false);
        _sound.loop = false;
        transform.add(_sound);
        if (_sound.isPlaying) {
            _sound.stop();
        }
        this.sound = _sound;
        // console.log(_sound);
        // needs delay to play
    };

    mouseLook = e => {
        this.coords = e.detail.coordinates;

        this.updateMouseLookDebugMesh();

        this.updateMouseLook();

        this.updateMovement();
    };

    updateMouseLook = () => {
        const {transform, availableComponent} = this.props;

        if (!availableComponent.scene.camera._main) {
            return;
        }

        if (this.coords) {
            // TODO: move this to physics service as lookAt function
            // Compute direction to target
            let lookAtVector = this.getPositionFromMouse(
                transform.physicsBody.position.z
            );

            this.currentShooterDirection = transform.physicsBody.lookAt(lookAtVector);

            // this can be used to make bullets or enemies follow player but disables gravity
            // currentShooterDirection.scale(fixedSpeed,transform.physicsBody.velocity);
        }
    };

    getShooter = () => {
        const {
            gameObject,
            availableComponent
        } = this.props;
        const {scene} = availableComponent;
        const shooterById = gameObject.getChildGameObjectByTag("playerShooter", scene);
        return shooterById;
    }

    updateFollowPlayerEnemy = (time, deltaTime) => {
        const {transform} = this.props;

        // player world position
        const vPlayerPositionRelativeToWorld = new THREE.Vector3().copy(this.shooter.transform.position);

        // player position relative to enemy transform - includes rotation of the transform
        const vPlayerPositionRelativeToLocalEnemyPositionAndRotation = transform.worldToLocal(vPlayerPositionRelativeToWorld);

        const distancePlayerToEnemy = vPlayerPositionRelativeToLocalEnemyPositionAndRotation.length();

        const translateValue = .1;
        const maxDistanceBetweenPlayerAndEnemy = 5;
        if (distancePlayerToEnemy > maxDistanceBetweenPlayerAndEnemy) {
            transform.translateY(translateValue);
        }

        vPlayerPositionRelativeToLocalEnemyPositionAndRotation.normalize();

        // get angle to rotate
        const maxRotateValue = .05;
        const rotationToLookAtPlayer = Math.asin(vPlayerPositionRelativeToLocalEnemyPositionAndRotation.x);
        const rotateAbsoluteValue = Math.min(Math.abs(rotationToLookAtPlayer), maxRotateValue);
        const orientedRotationValue =  -Math.sign(rotationToLookAtPlayer) * rotateAbsoluteValue;

        transform.rotateZ( orientedRotationValue );
    };

    updateAutoRotateEnemy = (time, deltaTime) => {
        this.props.transform.rotation.z += this.rotationSpeed * (0.02 * deltaTime) / 10;
    };

    updateType = {
        follow: this.updateFollowPlayerEnemy,
        rotate: this.updateAutoRotateEnemy,
    }

    start = () => {
        this.shooter = this.getShooter();
    };

    update = (time, deltaTime) => {
        // this.updateMovement();
        // this.updateMouseLook();
        this.updateType[this.type](time, deltaTime);
    };

    render = () => null;
}
