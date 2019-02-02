/* eslint-disable react/default-props-match-prop-types */
import React from "react";
// import PropTypes from 'prop-types'; // ES6
import Renderer from "./RendererContainer";
import Scene from "./core/Scene/SceneContainer";
import Camera from "./core/Camera/CameraContainer";
import {PhysicsService} from "./PhysicsService";
import {AudioService} from "./AudioService";
import {AnimationService} from "./AnimationService";

export class Game extends React.Component {
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

  addGameComponent = (gameComponent) => {
    if (!gameComponent) {
      return;
    }
    this.setState({[gameComponent.props.id]: gameComponent.getWrappedInstance() });
    this.availableComponent[gameComponent.props.id] = gameComponent.getWrappedInstance();
    this.registerUpdate(this.availableComponent[gameComponent.props.id].update);
  };
  //
  // addRenderer = (renderer) => {
  //   if (!renderer) {
  //     return;
  //   }
  //   this.setState({ renderer: renderer.getWrappedInstance() });
  //   this.availableComponent.renderer = renderer.getWrappedInstance();
  //   this.registerUpdate(this.availableComponent.renderer.update);
  // };
  //
  // addCamera = (camera) => {
  //   if (!camera) {
  //     return;
  //   }
  //   this.setState({ camera: camera.getWrappedInstance() });
  //   this.availableComponent.camera = camera.getWrappedInstance();
  //   this.registerUpdate(this.availableComponent.camera.update);
  // };
  //
  // addScene = (scene) => {
  //   if (!scene) {
  //     return;
  //   }
  //   this.setState({ scene: scene.getWrappedInstance() });
  //   this.availableComponent.scene = scene.getWrappedInstance();
  //   this.registerUpdate(this.availableComponent.scene.update);
  // };
  //
  // addPhysics = (physics) => {
  //   if (!physics) {
  //     return;
  //   }
  //   this.setState({ physics: physics.getWrappedInstance() });
  //   this.availableComponent.physics = physics.getWrappedInstance();
  //   this.registerUpdate(this.availableComponent.physics.update);
  // };

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

    this.updateChildren(time);
    // this.transformControls.update();
    this.frame = requestAnimationFrame(this.animate);
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
      <Renderer {..._propsList} ref={this.addGameComponent} key="renderer" id="renderer" />,
      <Camera {..._propsList} ref={this.addGameComponent} key="camera" id="camera" />,
      <Scene {..._propsList} ref={this.addGameComponent} key="scene" id="scene" />,
      <PhysicsService {..._propsList} ref={this.addGameComponent} key="physics" id="physics" />,
      <AudioService {..._propsList} ref={this.addGameComponent} key="audio" id="audio" />,
      <AnimationService {..._propsList} ref={this.addGameComponent} key="animation" id="animation" />,
    ];
  };
}
