import React from "react";
import PropTypes from "prop-types";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const THREE = require("three");

export class Camera extends React.Component {
  frustumSize = 12;

  camera;

  start = () => {
    const { availableComponent, updateSelf } = this.props;
    // this.camera = new THREE.OrthographicCamera(
    //   (this.frustumSize * renderer.getAspect()) / -2,
    //   (this.frustumSize * renderer.getAspect()) / 2,
    //   this.frustumSize / 2,
    //   this.frustumSize / -2,
    this.camera = new THREE.PerspectiveCamera();
    const { renderer } = availableComponent;
    this.controls = new OrbitControls(
      this.camera,
      renderer.renderer.domElement
    );

    availableComponent.scene.camera.registerCamera(this);

    this.setDomElementReadyToEvents();
    this.controls.update();

    this.setCameraPosition();

    // this.controls.enableRotate = false;
    renderer.subscribeResize(this.cameraOnResize);
    // updateSceneObject({
    updateSelf({ cameraReady: true });
    // });

    this.cameraOnResize();

    document.addEventListener("camera_change", this.randomTravel);
  };

  setDomElementReadyToEvents = () => {
    const { availableComponent } = this.props;
    const { renderer } = availableComponent;
    const element = renderer.renderer.domElement;
    element.style.pointerEvents = "all";
    element.style.userSelect = "all";
    element.style.webkitUserDrag = "auto";
  };

  getObject = () => this.camera;

  orthographicResize = () => {
    const { availableComponent } = this.props;
    const aspect = availableComponent.renderer.getAspect();

    this.camera.aspect = 0.5 * aspect;
    // this.camera.updateProjectionMatrix();

    this.camera.left = (-this.frustumSize * aspect) / 2;
    this.camera.right = (this.frustumSize * aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;

    this.camera.updateProjectionMatrix();
  };

  perspectiveResize = () => {
    const { availableComponent } = this.props;
    const aspect = availableComponent.renderer.getAspect();

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  };

  cameraOnResize = () => {
    if (this.camera.type === "OrthographicCamera") {
      this.orthographicResize();
    } else {
      this.perspectiveResize();
    }
  };

  checkIfIsMain = () => {
    const mainCameraId = this.props.availableComponent.scene.camera.getMain();
    if (mainCameraId === this.props.gameObject.id) {
      this.props.availableComponent.scene.camera.setMain(this);
    }
  };

  update = () => {
    const { cameraAutoRotate, cameraMinDistance, cameraPanLock } = this.props;
    this.controls.enablePan = !cameraPanLock;
    this.controls.autoRotate = cameraAutoRotate;
    this.controls.minDistance = cameraMinDistance || this.controls.minDistance;
    this.controls.update();
  };

  //TODO: check why this is being called on every state update
  componentDidUpdate = () => {
    if (!this.camera) {
      return;
    }
    this.checkIfIsMain();
    this.setCameraPosition();
  };

  componentWillUnmount = () => {
    if (this.controls) {
      this.controls.dispose();
    }
  };

  setCameraPosition = () => {
    const {
      updateSelf,
      cameraAngle,
      availableComponent,
      cameraAllowedPositions,
      animatedTransformations,
      availableService
    } = this.props;
    const { scene } = availableComponent;
    const cameraPositionData = cameraAllowedPositions[cameraAngle];

    // alert(cameraPositionData);
    if (!cameraPositionData) {
      // this.camera.position.set(10,10,10);
      // this.camera.lookAt(new THREE.Vector3());
      return;
    }

    if (!animatedTransformations) {
      this.camera.position.set(
        cameraPositionData.position.x,
        cameraPositionData.position.y,
        cameraPositionData.position.z
      );

      this.camera.lookAt(scene.scene.position);
    } else {
      availableService.animation.travelTo(
        this.camera,
        cameraPositionData.position,
        6000,
        {
          target: scene.scene.position,
          easing: availableService.animation.Easing.Exponential.Out
        }
      );
    }

    updateSelf({
      cameraAngle: ""
    });
  };

  randomTravel = () => {
    const {
      updateSelf,
      cameraAngle,
      availableComponent,
      cameraAllowedPositions,
      availableService,
      animatedTransformations
    } = this.props;
    const { scene } = availableComponent;
    availableService.animation.travelTo(
      this.camera,
      new THREE.Vector3(
        60 - 120 * Math.random(),
        60 - 120 * Math.random(),
        60 - 120 * Math.random()
      ),
      1000,
      {
        target: scene.scene.position,
        easing: availableService.animation.Easing.Exponential.Out
      }
    );
  };

  componentWillUnmount = () => {
    if (this.controls) {
      this.controls.dispose();
    }
  };

  controls;

  render = () => null;
}

Camera.propTypes = {
  scene: PropTypes.object,
  renderer: PropTypes.object,
  cameraAllowedPositions: PropTypes.object,
  cameraAngle: PropTypes.string,
  cameraAutoRotate: PropTypes.bool,
  cameraPanLock: PropTypes.bool,
  cameraMinDistance: PropTypes.number,
  availableComponent: PropTypes.object
};
