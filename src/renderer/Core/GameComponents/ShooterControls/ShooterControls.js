import React from "react";
import * as CANNON from "cannon";
import * as _ from 'lodash';
// mousedebug
import * as THREE from 'three';

export class ShooterControls extends React.Component {

    shootIntervalCallback;
    shootTimeInterval = 55;
    mouseDebugMesh;
    currentShooterDirection = new THREE.Vector3(0, 1, 0);
    fixedSpeed = 5;

    shootLastTime = 0;

    currentTestInstanceId = null;

    moveRatio = this.props.moveRatio || 0.3;

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
        const {instantiateFromPrefab, transform, destroyGameObjectById} = this.props;
        const {position, rotation, scale} = transform;
        // console.log("startShooting",this.currentShooterDirection);
        const _position = position.clone();
        _position.addScaledVector(this.currentShooterDirection, 7);
        this.currentTestInstanceId = _.uniqueId("bullet");
        instantiateFromPrefab(
            "PlayerBullet",
            this.currentTestInstanceId,
            {
                position: _position,
                rotation,
                scale,
            },null,
            shootStartTime
        );

        setTimeout(() => {
            this.sound.isPlaying ? this.sound.stop() : null;
            this.sound.play();
        }, 50);
        var currentTime = Date.now();

        console.log(this.shootTimeInterval - (currentTime - this.shootLastTime), currentTime - shootStartTime);
        this.shootLastTime = currentTime;
    }

    mouseLook = e => {
        // console.log('mouseLook',e);
        const _coords = e.detail.coordinates;
        this.coords = _coords;

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
            const {availableService} = this.props;
            const {physicsService} = availableService;
            // TODO: move this to physics service as lookAt function
            // Compute direction to target
            let lookAtVector = this.getPositionFromMouse(transform.physicsBody.position.z);

            this.currentShooterDirection = transform.physicsBody.lookAt(lookAtVector);

            // this can be used to make bullets or enemies follow player but disables gravity
            // currentShooterDirection.scale(fixedSpeed,transform.physicsBody.velocity);
        }
    }

    updateMovement = () => {
        // transform.rotation.y += 0.01;s
        if (this.state.activeLeft) this.moveLeft();
        if (this.state.activeRight) this.moveRight();
        if (this.state.activeUp) this.moveUp();
        if (this.state.activeDown) this.moveDown();
        if (this.state.activeLookUp) this.lookUp();
        if (this.state.activeLookDown) this.lookDown();
        if (this.state.activeLookLeft) this.lookLeft();
        if (this.state.activeLookRight) this.lookRight();
    }

    eventsMap = {
        moveleft: () => this.setState({activeLeft: true}),
        moveright: () => this.setState({activeRight: true}),
        moveup: () => this.setState({activeUp: true}),
        movedown: () => this.setState({activeDown: true}),
        moveleft_keyup: () => this.setState({activeLeft: false}),
        moveright_keyup: () => this.setState({activeRight: false}),
        moveup_keyup: () => this.setState({activeUp: false}),
        movedown_keyup: () => this.setState({activeDown: false}),
        lookup: () => this.setState({activeLookUp: true}),
        lookup_keyup: () => this.setState({activeLookUp: false}),
        lookdown: () => this.setState({activeLookDown: true}),
        lookdown_keyup: () => this.setState({activeLookDown: false}),
        lookleft: () => this.setState({activeLookLeft: true}),
        lookleft_keyup: () => this.setState({activeLookLeft: false}),
        lookright: () => this.setState({activeLookRight: true}),
        lookright_keyup: () => this.setState({activeLookRight: false}),
        shoot: this.startShooting,
        shoot_keyup: this.stopShooting,
        mousem: this.mouseLook
    };

    registerEvents = () => {
        Object.keys(this.eventsMap).forEach(event => {
            // console.log(`here ${event.toString()}`, this.eventsMap[event]);
            document.addEventListener(event, this.eventsMap[event]);
        });
    };

    // todo: convert this to gameObject?
    addMouseDebugMesh = () => {
        const {availableComponent} = this.props;
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: 0xfa7911});
        this.mouseDebugMesh = new THREE.Mesh(geometry, material);
        this.mouseDebugMesh.castShadow = true;
        availableComponent.scene.scene.add(this.mouseDebugMesh);
    }

    updateMouseLookDebugMesh = () => {
        const coords = this.getPositionFromMouse(3);
        this.mouseDebugMesh.position.set(coords.x, coords.y, coords.z);
    }

    // TODO: maybe this should be an inputService function?
    getPositionFromMouse = (targetZ = 0) => {

        const {availableComponent} = this.props;
        const camera = availableComponent.scene.camera._main;

        let vec = new THREE.Vector3(this.coords.x, this.coords.y, this.coords.z); // create once and reuse
        let pos = new THREE.Vector3(); // create once and reuse

        vec.unproject(camera);

        vec.sub(camera.position).normalize();

        let distance = (targetZ - camera.position.z) / vec.z;

        pos.copy(camera.position).add(vec.multiplyScalar(distance));
        return pos;
    }

    start = () => {
        this.registerEvents();
        // transform.add( this.mesh );
        this.addMouseDebugMesh();
        this.initSound();
    };

    update = () => {
        this.updateMovement();
        this.updateMouseLook();
    };

    render = () => null;
}
