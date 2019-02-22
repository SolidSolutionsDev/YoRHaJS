import React from "react";
import PropTypes from "prop-types";
// import  { SceneLayout } from '../SceneLayout';
// import ReactDOM from 'react-dom';

const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");

// const TransformControls = require('three-transformcontrols');

export class Camera extends React.Component {
  frustumSize = 12;

  camera;

  start = () => {
    const {availableComponent } = this.props;
    // this.camera = new THREE.OrthographicCamera(
    //   (this.frustumSize * renderer.getAspect()) / -2,
    //   (this.frustumSize * renderer.getAspect()) / 2,
    //   this.frustumSize / 2,
    //   this.frustumSize / -2,
    this.camera = new THREE.PerspectiveCamera();
    const { renderer } = availableComponent;
    this.controls = new OrbitControls(
      this.camera,
      renderer.renderer.domElement,
    );
    
    availableComponent.scene.camera.registerCamera(this);

    this.setDomElementReadyToEvents();
    this.controls.update();

    this.setCameraPosition();

    // this.controls.enableRotate = false;
    renderer.subscribeResize(this.cameraOnResize);
    // updateSceneObject({
    //   unspecified_cameraReady: true,
    // });

    this.cameraOnResize();
  };

  setDomElementReadyToEvents = ()=> {
    const { availableComponent } = this.props;
    const { renderer } = availableComponent;
    const element = renderer.renderer.domElement;
    element.style.pointerEvents = "all";
    element.style.userSelect = "all";
    element.style.webkitUserDrag = "auto";
  }

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
    if(mainCameraId === this.props.gameObject.id) {
      this.props.availableComponent.scene.camera.setMain(this);
    }
  }

  update = () => {
    const { cameraAutoRotate, cameraMinDistance, cameraPanLock } = this.props;
    this.controls.enablePan = !cameraPanLock;
    this.controls.autoRotate = cameraAutoRotate;
    this.controls.minDistance = cameraMinDistance || this.controls.minDistance;
    this.controls.update();
  };

  componentDidUpdate = () => {
    if(!this.camera) {
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
 
    const { cameraAngle, availableComponent, cameraAllowedPositions } = this.props;
    const { scene } = availableComponent;
    const cameraPositionData = cameraAllowedPositions[cameraAngle];

    // alert(cameraPositionData);
    if (!cameraPositionData) {

      // this.camera.position.set(10,10,10);
      // this.camera.lookAt(new THREE.Vector3());
      return;
    }

    this.camera.position.set(
      cameraPositionData.position.x,
      cameraPositionData.position.y,
      cameraPositionData.position.z,
    );

    this.camera.lookAt(scene.scene.position);

    // updateSceneObject({
    //   cameraAngle: "",
    // });
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
  availableComponent: PropTypes.object,
};
