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

  update = () => {
    this.children.forEach((child) => {
      child._update ? child._update() : null;
    });
  };

  registerUpdate = (update) => {
    // TODO REMOVE
    this.updateCallbacksArray.push(update);
  };

  registerChild = (child) => {
    // console.log("register child in parent", child);
    if (!child) {
      return;
    }
    const childGameObject = child.getWrappedInstance();
    if (childGameObject.transform) {
      this.scene.add(childGameObject.transform);
    } else {
      this.scene.add(childGameObject);
    }
    childGameObject.registerParent(this.scene);
    this.children.push(childGameObject);
  };
  
  buildChildGameObjects = () => {
    const {
      scene
    } = this.props;

    const _gameObjectProps = {
      ref: this.registerChild,
      addToScene: this.registerChild,
      registerUpdate: this.registerUpdate,
    };

    const gameObjects = scene && scene.children ? scene.children
        .map(gameObjectId=> {
          return  <GameContext.Consumer key={gameObjectId+"_consumer"}>
            {(context) => { return ( <GameObject {...context} {..._gameObjectProps} key={gameObjectId} id={gameObjectId}/>) }  }
          </GameContext.Consumer>
            })
        : []

    return gameObjects;
  }

  cameraUtils = {
    registerCamera: (component) => {
      this.props.registerCamera(component.gameObject.id);
    },
    removeCamera: (gameObjectId) => {
      this.props.removeCamera(gameObjectId);
    },
    setMainCamera: (gameObjectId) => {
      this.props.setMainCamera(gameObjectId);
    }
  };

  render = () => {

    const _gameObjects = this.buildChildGameObjects();

    return _gameObjects;
  }
}

Scene.propTypes = {};
