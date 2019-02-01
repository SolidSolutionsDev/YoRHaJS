/* eslint-disable react/default-props-match-prop-types */
import React from "react";
// import PropTypes from 'prop-types'; // ES6
import Renderer from "./RendererContainer";
import Scene from "./core/Scene/SceneContainer";
import Camera from "./core/Camera/CameraContainer";

export class SceneLayout extends React.Component {
  frame = null;

  state = {
    renderer: null,
    camera: null,
    scene: null,
    ready: false,
    started: false,
  };

  updateCallbacksArray = [];

  availableComponent = {};

  addRenderer = (renderer) => {
    if (!renderer) {
      return;
    }
    this.setState({ renderer: renderer.getWrappedInstance() });
    this.availableComponent.renderer = renderer.getWrappedInstance();
    this.registerUpdate(this.availableComponent.renderer.update);
  };

  addCamera = (camera) => {
    if (!camera) {
      return;
    }
    this.setState({ camera: camera.getWrappedInstance() });
    this.availableComponent.camera = camera.getWrappedInstance();
    this.registerUpdate(this.availableComponent.camera.update);
  };

  addScene = (scene) => {
    if (!scene) {
      return;
    }
    this.setState({ scene: scene.getWrappedInstance() });
    this.availableComponent.scene = scene.getWrappedInstance();
    this.registerUpdate(this.availableComponent.scene.update);
  };

  start = () => {
    const { renderer, scene, camera } = this.state;
    renderer.init();
    scene.init();
    camera.init();
    this.animate();
  };

  animate = (time) => {
    if (this.unmounting) {
      return;
    }
    // this.transformControls.update();
    this.frame = requestAnimationFrame(this.animate);
    this.updateChildren(time);
  };

  registerUpdate = (update) => {
    this.updateCallbacksArray.push(update);
  };

  updateChildren = (time) => {
    this.updateCallbacksArray.forEach((update) => {
      update(time);
    });
  };

  componentWillUnmount = () => {
    this.unmounting = true;
    cancelAnimationFrame(this.frame);
    console.log("unmounting scene");
  };

  componentDidUpdate = () => {
    const { scene, camera, renderer, started, ready } = this.state;
    if (!started && ready) {
      this.start();
      return;
    }
    if (!ready && camera && renderer && scene) {
      this.setState({ ready: true });
    }
  };

  render = () => {
    if (this.unmounting) {
      return null;
    }
    const _propsList = {
      availableComponent: this.availableComponent,
      loadedCallback: this.props.loadedCallback,
    };
    return [
      <Renderer {..._propsList} ref={this.addRenderer} key="renderer" />,
      <Camera {..._propsList} ref={this.addCamera} key="camera" />,
      <Scene {..._propsList} ref={this.addScene} key="scene" />,
    ];
  };
}
