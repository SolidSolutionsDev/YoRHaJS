import React from "react";
import * as THREE from "three";

import GameObject from "../GameObject";
// const LightGroupGameObject = GameObjectFactory.create("lightGroup");
// const ShoeGroupGameObject = GameObjectFactory.create("shoeGroup");

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
      availableComponent,
      availableService,
      game,
      scene
    } = this.props;
  
    const _editorProps = {
      ref: this.registerChild,
      availableComponent,
      availableService ,
      game,
      addToScene: this.registerChild,
      registerUpdate: this.registerUpdate,
    };

    const gameObjects = scene && scene.children ? scene.children
        .map(gameObjectId=> {
          return <GameObject {..._editorProps} key={gameObjectId} id={gameObjectId}/>} )
        : []

    return gameObjects;
  }

  render = () => {

    const _gameObjects = this.buildChildGameObjects();

    return _gameObjects;
  }
}

Scene.propTypes = {};
