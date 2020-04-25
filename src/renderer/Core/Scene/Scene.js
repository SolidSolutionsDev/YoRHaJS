import React from "react";
import * as THREE from "three";
import * as _ from "lodash";

import GameObject from "../GameObject";

import * as GameContext from "../../GameContext";

export class Scene extends React.Component {
  scene = new THREE.Scene();

  childGameObjects = [];

  updateCallbacksArray = [];

  state = {
    // loaded: false,
  };

  init = () => {
    this.scene.gameObject = this;
  };



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

  update = ( time, deltaTime )=> {
    this.childGameObjects.forEach(child => {
      // eslint-disable-next-line no-unused-expressions
      child._update ? child._update(time, deltaTime) : null;
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
    this.childGameObjects.push(childGameObject);
  };

  unRegisterChildGameObject = gameObjectId => {
    this.childGameObjects = this.childGameObjects.filter(element => {
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
                      scene={this.scene}
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

  componentDidMount() {
   this.updateFog();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {fog} = this.props.scene;
    if (!_.isEqual(fog,prevProps.scene.fog)){
      this.scene.fog = new THREE.Fog( fog.color, fog.near, fog.far );

    }
  }

  updateFog = () => {
    const {fog} = this.props.scene;
    if (fog){
      this.scene.fog = new THREE.Fog( fog.color, fog.near, fog.far );
    }
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
