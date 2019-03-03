import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import * as THREE from 'three';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

export class Renderer extends React.Component {
  renderer = new THREE.WebGLRenderer({
    antialias: this.props.antialias,
    shadowMap: true,
    alpha: this.props.alpha,
    preserveDrawingBuffer: true,
  });

  composer;

  canvas = this.renderer.domElement;

  aspect = window.innerWidth / window.innerHeight;

  resizeFunctions = [];

  state = {};

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {assetsLoadState, loadedCallback, availableComponent } = this.props;

    const prevScene= prevProps.availableComponent.scene;

    if (prevProps.assetsLoadState !== assetsLoadState && loadedCallback) {
      loadedCallback(assetsLoadState);
    }

    if (this.hasSceneOrCameraChanged(prevScene)) {
        this.setPostProcessing();
    }
  }

  hasSceneOrCameraChanged = (prevScene) => {
      const { availableComponent } = this.props;
      const {scene} = availableComponent;
      const _sceneChanged = scene.scene && (scene!== prevScene);
      const _cameraChanged = scene.camera && (!prevScene.camera && prevScene.camera !== scene.camera || prevScene.camera._main !== scene.camera._main ) ;

      const mainCameraReady = scene.camera._main;

      console.log("componentDidUpdate renderer","_sceneChanged:",_sceneChanged,
          "_cameraChanged:",_cameraChanged,
          "mainCameraReady:",mainCameraReady,);

     return _sceneChanged || _cameraChanged || (this.state.ready && mainCameraReady && !this.effectPass);
  }

  // TODO: improve this, add parameters on render redux state
    setPostProcessing =() => {
        const { availableComponent, postprocessing } = this.props;
        if (!postprocessing) {
          return;
        }
        if (!this.composer) {
          this.composer = new EffectComposer(this.renderer);
        }
        const {scene} = availableComponent;
        this.effectPass = new EffectPass(scene.camera._main, new BloomEffect());
        this.effectPass.renderToScreen = true;
        this.composer.reset();
        this.composer.addPass(new RenderPass(scene.scene, scene.camera._main));
        this.composer.addPass(this.effectPass);
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

  update = (time) => {
    const { backgroundColor, availableComponent,postprocessing } = this.props;
    const mainCameraReady = availableComponent.scene.camera._main;
    if (this.state.ready && mainCameraReady) {

      if (!postprocessing) {
        this.renderer.render(
          //TODO rename scene.scene to scene.transform
          availableComponent.scene.scene,
          availableComponent.scene.camera._main,
        );
      }
      else {
          // TODO: add post processing manager that reacts to redux state and make it optional between regular render
          this.effectPass || this.setPostProcessing();
          this.composer.render(time-this.timePreviousFrame);
      }
      this.timePreviousFrame= time;

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

  canvasWidth = () => this.canvas.width;

  canvasHeight = () => this.canvas.height;

  getAspect = () => this.aspect;

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
