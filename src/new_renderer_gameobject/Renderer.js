import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const THREE = require("three");

export class Renderer extends React.Component {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    shadowMap: true,
    alpha: true,
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
    this.registerEventListeners();
    // this.animate();

    this.setState({ ready: true });

    window.THREE = THREE;
    ReactDOM.findDOMNode(this).appendChild(this.canvas);
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
  backgroundColor: PropTypes.string.isRequired,
  availableComponent: PropTypes.object.isRequired,
};