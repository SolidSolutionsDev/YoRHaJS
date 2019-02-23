import React from "react";
import * as CANNON from "cannon";
import * as _ from 'lodash';
// mousedebug
import * as THREE from 'three';

export class ShooterControls extends React.Component {

    mouseDebugMesh;

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
    };

    moveRight = () => {

        const {transform} = this.props;
        // console.log('moveRight');
        transform.physicsBody.position.x += this.moveRatio;
    };

    moveUp = () => {

        const {transform} = this.props;
        // console.log('moveUp');
        transform.physicsBody.position.y += this.moveRatio;
    };

    moveDown = () => {

        const {transform} = this.props;
        // console.log('moveDown',transform.physicsBody);
        // transform.position.y-=this.moveRatio;
        transform.physicsBody.position.y -= this.moveRatio;
        // //   transform.physicsBody.angularDamping = 0;
        //   transform.physicsBody.linearFactor.x =0;
        //   transform.physicsBody.linearFactor.z =0;
        //   transform.physicsBody.linearFactor.y =0;
        //   transform.physicsBody.velocity.y += 1;
    };

    shoot = () => {
        const {instantiateFromPrefab, transform} = this.props;
        const {position, rotation, scale} = transform;
        console.log("shoot");
        instantiateFromPrefab(
            "TestCube",
            _.uniqueId("bullet"),
            {
                position,
                rotation,
                scale,
            },
        );
    };

    mouseLook = e => {
        // console.log('mouseLook',e);
        const _coords = e.detail.coordinates;
        this.coords = _coords;

        this.updateMouseLookDebugMesh();

        this.updateMouseLook();

        this.updateMovement();
    };

    updateMouseLook = () => {
        const {transform, availableComponent, availableService} = this.props;

        if (!availableComponent.scene.camera._main) {
            return;
        }

        if (this.coords) {

            // TODO: move this to physics service as lookAt function
            // Compute direction to target
            let lookAtVector = this.getPositionFromMouse(transform.physicsBody.position.z);
            // convert THREE Vector3 to CANNON Vec3
            lookAtVector = new CANNON.Vec3(lookAtVector.x, lookAtVector.y, lookAtVector.z)

            // normalized shooter direction from the lookAt object position
            let currentShooterDirection = new CANNON.Vec3();
            currentShooterDirection = lookAtVector.vsub(transform.physicsBody.position);
            currentShooterDirection.z = 0;
            currentShooterDirection.normalize();

            let forwardVector = new CANNON.Vec3(0, 1, 0);

            // Get the rotation between the forward vector and the direction vector
            transform.physicsBody.quaternion.setFromVectors(forwardVector, currentShooterDirection);
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
        shoot: this.shoot,
        mousem: this.mouseLook
    };

    registerEvents = () => {
        Object.keys(this.eventsMap).forEach(event => {
            // console.log(`here ${event.toString()}`, this.eventsMap[event]);
            document.addEventListener(event, this.eventsMap[event]);
        });
    };

    addMouseDebugMesh = () => {
        const {availableComponent} = this.props;
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00});
        this.mouseDebugMesh = new THREE.Mesh(geometry, material);
        console.log(this.props)
        availableComponent.scene.scene.add(this.mouseDebugMesh);
    }

    updateMouseLookDebugMesh = () => {
        const coords = this.getPositionFromMouse(3);
        this.mouseDebugMesh.position.set(coords.x, coords.y, coords.z);
    }

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
    };

    update = () => {
        this.updateMovement();
        this.updateMouseLook();
    };

    render = () => null;
}
