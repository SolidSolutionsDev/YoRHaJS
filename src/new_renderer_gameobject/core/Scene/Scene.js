import React from "react";
import * as THREE from "three";

import * as GameObjectFactory from "../Factories/GameObjectFactory";
const LightGroupGameObject = GameObjectFactory.create("lightGroup");
const ShoeGroupGameObject = GameObjectFactory.create("shoeGroup");

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

  render = () => {
    const {
      addObject,
      availableComponent,
      objects,
      shoes,
      selectObject,
      selectCorner,
      unspecified_selectedObjectId,
      unspecified_selectedCornerId,
      unspecified_viewerActive,
      user_shoes,
      shoes_types,
      shoes_color_sets,
      color_options,
      current_selected_shoe,
    } = this.props;
    const _editorProps = {
      ref: this.registerChild,
      addObject,
      availableComponent,
      objects,
      shoes,
      selectObject,
      selectCorner,
      addToScene: this.registerChild,
      registerUpdate: this.registerUpdate,
      selectedObjectId: unspecified_selectedObjectId,
      selectedCornerId: unspecified_selectedCornerId,
    };

    const _shoesProps = {
      user_shoes,
      shoes_types,
      shoes_color_sets,
      color_options,
      current_selected_shoe,
    };

    const _viewerProps = {
      ref: this.registerChild,
      unspecified_viewerActive,
      objects,
    };

    return (
      <div
        id="scene"
        className="scene"
        style={{ width: "100%", height: "100%" }}
      >
        {[
          <ShoeGroupGameObject key="ShoeGroupGameObject" {..._editorProps} {..._shoesProps}/>,
          <LightGroupGameObject key="LightGroupGameObject" {..._editorProps} />,
        ]}
      </div>
    );
  };
}

Scene.propTypes = {};
