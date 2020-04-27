import React from "react";
import * as CANNON from "cannon";
import * as _ from "lodash";
// mousedebug
import * as THREE from "three";
import {kernelConstants} from "../../../../stores/constants";
import PropTypes from "prop-types";
import {CSSLabelTo3D} from "../CSSLabelTo3D/CSSLabelTo3D";

// character control menu
export class RPGBattlePlayerControls extends React.Component {

  availableCommands = kernelConstants.menuCommands;
  defaultCommandIndex = 0;

  updateTime= 0;
  startActiveMenuMovementTime= 0;
  activeTimesMenuMoved = 0;

  state = {
    selectedCommand: this.defaultCommand,
    activeLeft: false,
    activeRight: false,
    activeUp: false,
    activeDown: false,
    movementCallback: null
  };

  menuChangeOptionInterval = 500;
  menuDiv;
  cssGameComponent;


  moveLeft = () => {
    const { transform } = this.props;
    // console.log('moveLeft');
    // this.activeMovements.left=true;
    transform.physicsBody.position.x -= this.moveRatio * this.deltaUpdate;
    // let forwardVector = new CANNON.Vec3(-1, 0, 0);
    // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
  };

  moveRight = () => {
    const { transform } = this.props;
    // console.log('moveRight');
    transform.physicsBody.position.x += this.moveRatio * this.deltaUpdate;
    // let forwardVector = new CANNON.Vec3(1,0, 0);
    // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
  };

  moveUp = () => {
    this.defaultCommandIndex--;
    if (this.defaultCommandIndex < 0 ) {
      this.defaultCommandIndex = Object.keys(this.availableCommands).length -1;
    }
  };

  moveDown = () => {
    this.defaultCommandIndex++;
    if (this.defaultCommandIndex > Object.keys(this.availableCommands).length +1 ) {
      this.defaultCommandIndex = 0;
    }
  };

  startShooting = () => {
    this.props.gameObject.getComponent("shooter").startShooting();
  };

  stopShooting = () => {
    this.props.gameObject.getComponent("shooter").stopShooting();
  };

  resetMenuMovement = () => {
    this.activeTimesMenuMoved = 0;
    this.startActiveMenuMovementTime = this.updateTime;
  };

  eventsMap = {
    moveLeft: () => { this.resetMenuMovement();this.setState({ activeLeft: true });},
    moveRight: () => { this.resetMenuMovement();this.setState({ activeRight: true });},
    moveUp: () => { this.resetMenuMovement();this.setState({ activeUp: true });},
    moveDown: () => { this.resetMenuMovement();this.setState({ activeDown: true });},
    moveLeft_keyup: () => this.setState({ activeLeft: false }),
    moveRight_keyup: () => this.setState({ activeRight: false }),
    moveUp_keyup: () => this.setState({ activeUp: false }),
    moveDown_keyup: () => this.setState({ activeDown: false }),
    shoot: this.startShooting,
    shoot_keyup: this.stopShooting,
    mouseM: this.mouseLook
  };

  updateMenuMovement = () => {
    // transform.rotation.y += 0.01;s
    if (this.state.activeLeft) this.moveLeft();
    if (this.state.activeRight) this.moveRight();
    if (this.state.activeUp) this.moveUp();
    if (this.state.activeDown) this.moveDown();
    // if (this.state.activeLookUp) this.lookUp();
    // if (this.state.activeLookDown) this.lookDown();
    // if (this.state.activeLookLeft) this.lookLeft();
    // if (this.state.activeLookRight) this.lookRight();
  };

  updateMenu = (time) => {
    const {activeLeft, activeRight, activeUp, activeDown} = this.state;
    if (activeLeft || activeRight || activeUp || activeDown){
      // compute how many bullets to shoot now to catch up time step
      const totalTimesMenuChangedSinceActivated = this.activeTimesMenuMoved * this.menuChangeOptionInterval;
      const timePassedFromLastMenuMovement =
          time - (this.startActiveMenuMovementTime + totalTimesMenuChangedSinceActivated);
      const menuMovementsToDoNow = Math.floor(
          timePassedFromLastMenuMovement / this.menuChangeOptionInterval
      );
      for (let menuChangeIndex = 0 ; menuChangeIndex <= menuMovementsToDoNow;menuChangeIndex++) {
        this.updateMenuMovement();
        this.activeTimesMenuMoved++;
      }
    }
  };

  registerEvents = () => {
    Object.keys(this.eventsMap).forEach(event => {
      // console.log(`here ${event.toString()}`, this.eventsMap[event]);
      document.addEventListener(event, this.eventsMap[event]);
    });
  };

  //
  // // todo: convert this to gameObject?
  // addMouseDebugMesh = () => {
  //   const { availableComponent } = this.props;
  //   const geometry = new THREE.SphereGeometry(1, 32, 32);
  //   const material = new THREE.MeshBasicMaterial({ color: 0xfa7911 });
  //   this.mouseDebugMesh = new THREE.Mesh(geometry, material);
  //   this.mouseDebugMesh.castShadow = true;
  //   availableComponent.scene.scene.add(this.mouseDebugMesh);
  // };
  //
  // updateMouseLookDebugMesh = () => {
  //   const coords = this.getPositionFromMouse(3);
  //   this.mouseDebugMesh.position.set(coords.x, coords.y, coords.z);
  // };
  //
  // // TODO: maybe this should be an inputService function?
  // getPositionFromMouse = (targetZ = 0) => {
  //   const { availableComponent } = this.props;
  //   const camera = availableComponent.scene.camera._main;
  //
  //   let vec = new THREE.Vector3(this.coords.x, this.coords.y, this.coords.z); // create once and reuse
  //   let pos = new THREE.Vector3(); // create once and reuse
  //
  //   vec.unproject(camera);
  //
  //   vec.sub(camera.position).normalize();
  //
  //   let distance = (targetZ - camera.position.z) / vec.z;
  //
  //   pos.copy(camera.position).add(vec.multiplyScalar(distance));
  //   return pos;
  // };


  initMenuDiv = () => {
    this.menuDiv = document.createElement("div");
    this.menuDiv.className = "battle-player-controls";
    this.attachMenu(this.menuDiv);
  };

  updateMenuUI = () => {
    if (!this.cssGameComponent) {
      this.attachMenu(this.menuDiv);
    }
    this.menuDiv.innerHTML = `Character Battle Controls UI test: ${this.updateTime}`;
  };

  attachMenu = (menuDiv) => {
    const { gameObject } = this.props;
    console.log(gameObject);
    this.cssGameComponent = gameObject.getComponent(
        "cssLabelTo3d"
    );
    this.cssGameComponent.attachDiv(menuDiv);
  };

  start = () => {
    this.initMenuDiv();
    this.registerEvents();
    // transform.add( this.mesh );
    // this.addMouseDebugMesh();
  };

  update = ( time, deltaTime ) => {
    this.deltaUpdate = deltaTime/10;
    this.updateTime = time;
    this.updateMenu(time);
    this.updateMenuUI();
    // this.updateMenuMovement();
    // this.updateMouseLook();
  };
}

