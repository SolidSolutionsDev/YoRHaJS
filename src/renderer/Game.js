/* eslint-disable react/default-props-match-prop-types */
import React from "react";
import PropTypes from 'prop-types'; // ES6

import Renderer from "./RendererContainer";
import Scene from "./Core/Scene/SceneContainer";
import Camera from "./Core/GameComponents/Camera/CameraContainer";
import {PhysicsService} from "./Services/PhysicsService";
import {AudioService} from "./Services/AudioService";
import {AnimationService} from "./Services/AnimationService";
import {InputService} from "./Core/InputService";

import * as GameContext from "./GameContext";

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
  availableService = {};

  addGameService= (gameService) => {
    if (!gameService) {
      return;
    }
    // console.log(gameService);
    this.setState({[gameService.props.id]: gameService });
    this.availableService[gameService.props.id] = gameService;
    this.registerUpdate(this.availableService[gameService.props.id].update);
  };

  addGameComponent = (gameComponent,alias) => {
    if (!gameComponent) {
      return;
    }

    const componentPropretyName = alias ? alias : gameComponent.props.id;
    // console.log(gameComponent);
    this.setState({[componentPropretyName]: gameComponent.getWrappedInstance() });
    this.availableComponent[componentPropretyName] = gameComponent.getWrappedInstance();
    this.registerUpdate(this.availableComponent[componentPropretyName].update);
  };

  start = () => {
    const { renderer, scene, camera } = this.state;
    renderer.init();
    scene.init();
    camera.init();
    this.animate();
    this.setState({started:true})
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
      update && update(time);
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
    // TODO: convert to "react context"
    const _propsList = {
      availableComponent: this.availableComponent,
      availableService: this.availableService,
      game:this,
      loadedCallback: this.props.loadedCallback,
    };

    const t= "a";

    return (
      <GameContext.Provider value={{..._propsList}}>
        <Renderer {..._propsList} ref={this.addGameComponent} key="renderer" id="renderer" />,
        <Camera {..._propsList} ref={this.addGameComponent} key="camera" id="camera" />,
        <Scene {..._propsList} ref={this.addGameComponent} key="scene" id="scene" />,
        <PhysicsService {..._propsList} ref={this.addGameService} key="physics" id="physics" />,
        <AudioService {..._propsList} ref={this.addGameService} key="audio" id="audio" />,
        <AnimationService {..._propsList} ref={this.addGameService} key="animation" id="animation" />,
        <InputService ref={this.addGameService} key="input" id="input"/>,
    </GameContext.Provider>
    );
  };
}

Game.propTypes = {
  loadedCallback: PropTypes.func,
};
