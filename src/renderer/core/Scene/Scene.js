import React from "react";
import * as THREE from "three";

import * as GameObjectFactory from "../Factories/GameObjectFactory";
// const LightGroupGameObject = GameObjectFactory.create("lightGroup");
// const ShoeGroupGameObject = GameObjectFactory.create("shoeGroup");

export class Scene extends React.Component {
  scene = new THREE.Scene();

  size = 10;

  children = [];

  updateCallbacksArray = [];

  cornerCubes = [];

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
    if (!child) {
      return;
    }
    if (child.transform) {
      this.scene.add(child.transform);
    } else {
      this.scene.add(child);
    }
    this.children.push(child);
  };


  buildChildGameObjects = () => {
    const {
      addObject,
      availableComponent,
      objects,
      // shoes,
      selectObject,
      selectCorner,
      // unspecified_selectedObjectId,
      // unspecified_selectedCornerId,
      // unspecified_viewerActive,
      // user_shoes,
      // shoes_types,
      // shoes_color_sets,
      // color_options,
      // current_selected_shoe,
        scene
    } = this.props;
    const _editorProps = {
      ref: this.registerChild,
      addObject,
      availableComponent,
      objects,
      // shoes,
      selectObject,
      selectCorner,
      addToScene: this.registerChild,
      registerUpdate: this.registerUpdate,
      // selectedObjectId: unspecified_selectedObjectId,
      // selectedCornerId: unspecified_selectedCornerId,
    };

    const _viewerProps = {
      ref: this.registerChild,
      objects,
    };

    const gameObjects = scene && scene.gameObjects ? scene.gameObjects.allIds
        .filter((gameObjectId)=> {console.log(gameObjectId); return !scene.gameObjects.byId[gameObjectId].parent})
        .map(gameObjectId=> {
          const GameObject = GameObjectFactory.create(gameObjectId);
          return <GameObject {..._editorProps} key={gameObjectId}/>} )
        : []

    return gameObjects;
  }

  render = () => {

    console.log(this.scene);

    const _gameObjects = this.buildChildGameObjects();

    return (
      <div
        id="scene"
        className="scene"
        style={{ width: "100%", height: "100%" }}
      >
        {_gameObjects}
      </div>
       /* {[
          <ShoeGroupGameObject key="ShoeGroupGameObject" {..._editorProps} {..._shoesProps}/>
          <LightGroupGameObject key="LightGroupGameObject" {..._editorProps} />
        ]}
        */
    );
  };
}

Scene.propTypes = {};
