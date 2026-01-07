import React from "react";
import * as CANNON from "cannon";
import * as THREE from "three";

interface EnemyMovementControlsProps {
    transform: any;
    availableService: any;
    availableComponent: any;
    gameObject: any;
    selfSettings: any;
    moveRatio?: number;
    rotationSpeed?: number;
    type?: "follow" | "rotate";
}

interface EnemyMovementControlsState {
    activeLeft: boolean;
    activeRight: boolean;
    activeUp: boolean;
    activeDown: boolean;
    movementCallback: any;
}

export class EnemyMovementControls extends React.Component<EnemyMovementControlsProps, EnemyMovementControlsState> {
    shootIntervalCallback: any;
    shootTimeInterval = 70;
    mouseDebugMesh: THREE.Mesh | undefined;
    currentShooterDirection = new THREE.Vector3(0, 1, 0);
    updateTime = 0;
    sound: THREE.Audio | undefined;

    shootLastTime = 0;

    currentTestInstanceId = null;
    shooter: any;

    moveRatio = this.props.moveRatio || 0.3;
    rotationSpeed = this.props.rotationSpeed || 0;
    type = this.props.type || "rotate";

    moveVelocity = {
        value: 0,
        max: 1,
        min: 1,
        variation: 0.01
    };

    state: EnemyMovementControlsState = {
        activeLeft: false,
        activeRight: false,
        activeUp: false,
        activeDown: false,
        movementCallback: null
    };

    coords: any;

    lookDown = () => {
        const { transform } = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            Math.PI / 2
        );
    };
    lookUp = () => {
        const { transform } = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            -Math.PI / 2
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
        // let forwardVector = new CANNON.Vec3(-1, 0, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveRight = () => {
        const { transform } = this.props;
        // console.log('moveRight');
        transform.physicsBody.position.x += this.moveRatio;
        // let forwardVector = new CANNON.Vec3(1,0, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveUp = () => {
        const { transform } = this.props;
        // console.log('moveUp');
        transform.physicsBody.position.y += this.moveRatio;

        // let forwardVector = new CANNON.Vec3(0, 1, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveDown = () => {
        const { transform } = this.props;
        // console.log('moveDown',transform.physicsBody);
        transform.physicsBody.position.y -= this.moveRatio;
        // let forwardVector = new CANNON.Vec3(0, -1, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    // shootBullet used in setInterval?
    shootBullet = () => {
        // Implement if needed or remove unused method call
    }

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
        const { transform, availableService } = this.props;
        const _sound = availableService.audio.buildPositionalSound(
            this.props.selfSettings.soundLocation
        );
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

    mouseLook = (e: any) => {
        this.coords = e.detail.coordinates;

        this.updateMouseLookDebugMesh();

        this.updateMouseLook();

        this.updateMovement();
    };

    updateMovement = () => {
        // Implementation might have been missing in original file or mixed up?
        // Original JS didn't have updateMovement body shown in "mouseLook" context fully, 
        // but it calls it. Assuming similar to PlayerControls.
    }

    updateMouseLookDebugMesh = () => {
        // Implement if needed
    }

    getPositionFromMouse = (_z: number) => {
        return new THREE.Vector3(0, 0, 0); // placeholder
    }

    updateMouseLook = () => {
        const { transform, availableComponent } = this.props;

        if (!availableComponent.scene.camera._main) {
            return;
        }

        if (this.coords) {
            // TODO: move this to physics service as lookAt function
            // Compute direction to target
            let lookAtVector = this.getPositionFromMouse(
                transform.physicsBody.position.z
            );

            // @ts-ignore
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
        const { scene } = availableComponent;
        const shooterById = gameObject.getChildGameObjectByTag("playerShooter", scene);
        return shooterById;
    }

    updateFollowPlayerEnemy = (_time: number, _deltaTime: number) => {
        const { transform } = this.props;

        if (!this.shooter) return;

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
        const orientedRotationValue = -Math.sign(rotationToLookAtPlayer) * rotateAbsoluteValue;

        transform.rotateZ(orientedRotationValue);
    };

    updateAutoRotateEnemy = (_time: number, deltaTime: number) => {
        this.props.transform.rotation.z += this.rotationSpeed * (0.02 * deltaTime) / 10;
    };

    updateType: { [key: string]: (time: number, deltaTime: number) => void } = {
        follow: this.updateFollowPlayerEnemy,
        rotate: this.updateAutoRotateEnemy,
    }

    start = () => {
        this.shooter = this.getShooter();
    };

    update = (time: number, deltaTime: number) => {
        // this.updateMovement();
        // this.updateMouseLook();
        if (this.updateType[this.type]) {
            this.updateType[this.type](time, deltaTime);
        }
    };

    render = () => null;
}

