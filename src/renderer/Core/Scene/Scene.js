import React from "react";
import * as THREE from "three";

import GameObject from "../GameObject";

import * as GameContext from "../../GameContext";

export class Scene extends React.Component {
  scene = new THREE.Scene();

  children = [];

  updateCallbacksArray = [];

  state = {
    // loaded: false,
  };

  init = () => {};



//TODO: replace enqueue and dequeue actions with thunks, sagas or observable
  enqueuedActionsArray = [];
  nonImmediateenqueuedActionsArray = [];
  nonImmediateenqueuedActionsInterval = 2000;
  lastDequeuedTime;
  enqueueAction = (action, options) => {
    if (options && options.nonImmediate) {
      this.nonImmediateenqueuedActionsArray.push(action);
      return;
    }
    this.enqueuedActionsArray.push(action);
  };

  update = time => {
    this.children.forEach(child => {
      child._update ? child._update(time) : null;
    });
    this.props.dequeueActions(this.enqueuedActionsArray);
    if (!this.lastDequeuedTime || (time-this.lastDequeuedTime > this.nonImmediateenqueuedActionsInterval)){
      this.lastDequeuedTime = time;
      this.props.dequeueActions(this.nonImmediateenqueuedActionsArray);
    }
  };

  registerUpdate = update => {
    // TODO REMOVE
    this.updateCallbacksArray.push(update);
  };

  registerChild = child => {
    // console.log("register child in parent", child);
    if (!child) {
      return;
    }
    const childGameObject = child;
    if (childGameObject.transform) {
      this.scene.add(childGameObject.transform);
    } else {
      this.scene.add(childGameObject);
    }
    childGameObject.registerParent(this.scene);
    this.children.push(childGameObject);
  };

  unRegisterChildGameObject = gameObjectId => {
    this.children = this.children.filter(element => {
      return element.props.id !== gameObjectId;
    });
  };

  buildChildGameObjects = () => {
    const { scene } = this.props;

    const _gameObjectProps = {
      ref: this.registerChild,
      addToScene: this.registerChild,
      registerUpdate: this.registerUpdate,
      parent: this
    };

    const gameObjects =
      scene && scene.children
        ? scene.children.map(gameObjectId => {
            return (
              <GameContext.Consumer key={gameObjectId + "_consumer"}>
                {context => {
                  return (
                    <GameObject
                      {...context}
                      {..._gameObjectProps}
                      key={gameObjectId}
                      id={gameObjectId}
                    />
                  );
                }}
              </GameContext.Consumer>
            );
          })
        : [];

    return gameObjects;
  };

  camera = {
    _main: null,
    setMain: component => {
      this.camera._main = component.camera;
      this.camera._mainComponent = component;
    },
    getMain: () => {
      return this.props.camera.main;
    },
    getAllCameras: () => {
      return this.props.camera.allCameras;
    },
    registerCamera: component => {
      this.props.registerCamera(component.props.gameObject.id);
    },
    removeCamera: gameObjectId => {
      this.props.removeCamera(gameObjectId);
    },
    setMainCamera: gameObjectId => {
      this.props.setMainCamera(gameObjectId);
    }
  };

  render = () => {
    const _gameObjects = this.buildChildGameObjects();

    return _gameObjects;
  };
}

Scene.propTypes = {};
