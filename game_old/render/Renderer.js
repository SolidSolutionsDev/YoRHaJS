import React, { Component } from "react";
import ReactDOM from "react-dom";

import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";

import { Scene } from "./Scene";
import { DynamicCameraPrefab } from "../logic/prefabs/DynamicCameraPrefab";

import { PhysicsService } from "../logic/PhysicsService";
// import {GameDirector} from '../logic/GameDirector';

import { AudioService } from "./AudioService";

// import { Controls } from './Controls';

export class Renderer extends Component {
  physicsService;
  registeredUpdates = [];
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  ui = {};
  canvas = this.renderer.domElement;
  sceneParameters = {};
  state = {
    loadedUI: false
  };

  componentDidMount() {
    ReactDOM.findDOMNode(this).appendChild(this.canvas);
    this.setupRendererDefaults();
    this.setupCanvasDefaults();
    this.setupResize();
    this.renderLoop();
  }

  setupResize() {
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.resize();
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.renderer.setSize(this.canvas.width, this.canvas.height);
  };

  renderLoop = timeRenderLoopWasCalled => {
    if (this.physicsService) {
      this.physicsService.update(timeRenderLoopWasCalled);
    }

    if (this.gameDirector) {
      this.gameDirector.update(timeRenderLoopWasCalled);
    }
    this.updateChildren(timeRenderLoopWasCalled, this.children);
    this.renderer.render(this.scene, this.camera);
    TWEEN.update(timeRenderLoopWasCalled);
    requestAnimationFrame(this.renderLoop);
  };

  updateChildren = (timeRenderLoopWasCalled, children) => {
    if (children === undefined) {
      return;
    }
    children.forEach(child => {
      child.update ? child.update(timeRenderLoopWasCalled) : null;
      child.children
        ? this.updateChildren(timeRenderLoopWasCalled, child.children)
        : null;
    });
  };

  setupRendererDefaults() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.renderReverseSided = true;
    this.renderer.shadowMap.renderSingleSided = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.renderer.setClearColor(0x544c41, 0.9);
    this.renderer.sortObjects = false;
  }

  setupCanvasDefaults() {
    this.canvas.style.position = "absolute";
    this.canvas.style.left = 0;
    this.canvas.style.top = 0;
    this.canvas.style.top = 0;
    this.canvas.style.zIndex = -1;
  }

  setCamera = camera => {
    if (!camera) {
      return;
    }
    this.cameraComponent = camera;
    this.camera = camera.mesh;
    this.children.push(camera);
    this.initAudio();
  };

  initAudio = () => {
    if (this.camera && this.audioService) {
      this.camera.add(this.audioService.listener);

      const _sound = this.audioService.buildPositionalSound(
        this.cameraComponent.attribs.cameraSoundPath
      );
      this.cameraComponent.initCameraSound(_sound);
    }
  };

  setScene = scene => {
    if (!scene) {
      return;
    }
    this.scene = scene.scene;
    this.children.push(scene);
  };

  setControls = controls => {
    if (!controls) {
      return;
    }
    controls.init(this.camera, this.renderer.domElement);
    this.controls = controls;
    this.children.push(controls);
  };

  setUI = ui => {
    if (!ui) {
      return;
    }
    //ui.init();
    this.ui = ui;

    console.log("renderer setUI", this.ui);
    // console.log( "renderer setUI 2", this.ui.params );
    this.sceneParameters = ui ? ui.params : {};

    if (!this.state.loadedUI) {
      this.setState({ loadedUI: true });
    }
  };

  setPhysics = physicsService => {
    this.physicsService = physicsService;
  };

  getPhysicsService = () => {
    return this.physicsService;
  };

  setAudioService = audioService => {
    this.audioService = audioService;
    this.initAudio();
  };

  getAudioService = () => {
    return this.audioService;
  };

  render() {
    let _children = [];
    this.children = [];
    // _children.push( <DatGui pipeUpdate={this.pipeUpdated} flareTipUpdated={this.flareTipUpdated}
    //                         ref={ui => this.setUI( ui )} key="testForUpdate4"></DatGui> );
    _children.push(
      <AudioService
        ref={audioService => this.setAudioService(audioService)}
        key="audioService"
      />
    );
    _children.push(
      <DynamicCameraPrefab
        ref={camera => this.setCamera(camera)}
        key="dynamicCamera"
      />
    );
    _children.push(
      <PhysicsService
        ref={physicsService => this.setPhysics(physicsService)}
        key="physicsService"
      />
    );

    _children.push(
      <Scene
        getPhysicsService={this.getPhysicsService}
        getGameDirector={this.getGameDirector}
        getAudioService={this.getAudioService}
        parameters={this.sceneParameters}
        ref={scene => this.setScene(scene)}
        key="testForUpdate2"
      />
    );
    // _children.push( <Controls ref={controls => this.setControls( controls )} key="testForUpdate3"></Controls> );

    return <div className="scene">{_children} </div>;
  }
}
