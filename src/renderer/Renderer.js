import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const THREE = require("three");

export class Renderer extends React.Component {

  
  renderer = new THREE.WebGLRenderer({
    antialias: this.props.antialias,
    shadowMap: true,
    alpha: this.props.alpha,
    preserveDrawingBuffer: true,
  });

  canvas = this.renderer.domElement;

  aspect = window.innerWidth / window.innerHeight;

  resizeFunctions = [];

  state = {};

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {assetsLoadState, loadedCallback } = this.props;

    if (prevProps.assetsLoadState !== assetsLoadState && loadedCallback) {
      loadedCallback(assetsLoadState);
    }
  }

  componentDidMount = () => {};

  init = () => {
    ReactDOM.findDOMNode(this).appendChild(this.canvas);
    this.setupRendererDefaults();
    this.setupCanvasDefaults();
    this.registerEventListeners();
    this.setState({ ready: true });

    window.THREE = THREE;
    this.onWindowResize();
  };

  update = () => {
    const { backgroundColor, availableComponent } = this.props;
    if (this.state.ready) {
      this.renderer.render(
        availableComponent.scene.scene,
        availableComponent.camera.getObject(),
      );
      // this.composer.render();

      this.renderer.setClearColor(backgroundColor,0);
    }
  };


  setupCanvasDefaults() {
    this.canvas.parentNode.style.position = "absolute";
    this.canvas.parentElement.style.heigh = "100%";
    this.canvas.parentElement.style.left = 0;
    this.canvas.parentElement.style.top = 0;
    this.canvas.parentElement.style.zIndex = -1;
  }


  setupRendererDefaults() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.renderReverseSided = true;
    this.renderer.shadowMap.renderSingleSided = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.renderer.setClearColor(0x544c41, 0.9);
    this.renderer.sortObjects = false;
  }

  registerEventListeners = () => {
    // document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    // document.addEventListener("touchend", this.onDocumentMouseDown, false);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  componentWillUnmount() {
    window.removeEventListener("resize",this.onWindowResize);
  }

  onWindowResize = (event) => {
    // const SCREEN_WIDTH = window.innerWidth;
    // const SCREEN_HEIGHT = window.innerHeight;
    if (!this.renderer.domElement.parentElement) {
      return;
    }

    const SCREEN_WIDTH = this.renderer.domElement.parentElement.clientWidth;
    const SCREEN_HEIGHT = this.renderer.domElement.parentElement.clientHeight;
    this.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.resizeFunctions.forEach((resizeFunction) => {
      resizeFunction();
    });
  };

  // // from https://stackoverflow.com/questions/45041158/resizing-canvas-webgl-to-fit-screen-width-and-heigh
  // resizeCanvasToDisplaySize(force) {
  //     const canvas = this.renderer.domElement;
  //     // look up the size the canvas is being displayed
  //     const width = canvas.clientWidth;
  //     const height = canvas.clientHeight;
  //
  //     // adjust displayBuffer size to match
  //     if (force || canvas.width !== width || canvas.height !== height) {
  //         // you must pass false here or three.js sadly fights the browser
  //         this.renderer.setSize(width, height, false);
  //         this.camera.aspect = width / height;
  //         this.camera.updateProjectionMatrix();
  //
  //         // update any render target sizes here
  //     }
  // }

  updateChildren = (time) => {
    this.updateCallbacksArray.forEach((update) => {
      update(time);
    });
  };

  subscribeResize = (onResizeFunction) => {
    this.resizeFunctions.push(onResizeFunction);
  };

  registerCameraComponent = (camera) => {
    this.camera = camera;
    this.initPostProcessing();
  };

  canvasWidth = () => this.canvas.width;

  canvasHeight = () => this.canvas.height;

  getAspect = () => this.aspect;

  camera;

  render = () => (
    <div
      key="renderer"
      id="renderer"
      className="scene"
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}

Renderer.propTypes = {
  availableWidth: PropTypes.number,
  availableHeight: PropTypes.number,
  assetsLoadState: PropTypes.object,
  // backgroundColor: PropTypes.string.isRequired,
  // availableComponent: PropTypes.object.isRequired,
};
