import React, { Component } from "react";

import * as THREE from "three";
import * as GameComponentFactory from "../Factories/GameComponentFactory";

//TODO: add available component here maybe using contexts

export function makeGameObject(id) {
  return class extends React.Component {
    _type = "GameObject";

    transform = new THREE.Object3D();

    axesHelper = new THREE.AxesHelper(5);

    components = {};

    childGameObjects = [];

    componentWillMount = () => {
      const { transform, id } = this.props;

     this._name = id;
     this.displayName = id;
     this.id = id;

      if (transform && transform.position) {
        this.transform.position.set(...transform.position);
      }
      this.transform.name = `${id}_transform`;

      this.transform.gameObject = this;

      this.transform.add(this.axesHelper);
    };

    componentWillReceiveProps(nextProps) {}

    registerComponent = (component, _displayName) => {
      this.components[_displayName] = component;
    };

    componentWillUnmount() {
      console.log("gameObject will unmount", this);
      this.unmounting = true;
      this._onDestroy();
      Object.values(this.components).forEach((component) => component._onDestroy());
    }

    _onDestroy() {
      console.log("_onDestroy", this._name);
      this.removeFromScene();
    }

    removeFromScene =()=> {
      const { scene } = this;
      if (!scene) {
        return;
      }
      scene.remove(this.transform);
    };

    get scene() {
      return this._getScene(this.transform);
    }

    _getScene = (object) => {
      const { parent } = object;
      if (!parent) {
        console.log("no scene parent found");
        return null;
      }
      if (parent.type === "Scene") {
        // console.log(`found scene`,parent);
        return parent;
      }
      return this._getScene(parent);
    }

    getAllGameObject3DChildren = (object = this.transform) => {
      let children = [];
      children = children.concat(object);
      for (let i = 0; i < object.children.length; i++) {
        children = children.concat(
          this.getAllGameObject3DChildren(object.children[i]),
        );
      }
      return children;
    };

    getChildComponent = (componentID) => this.components[componentID];

    getWrappedGameObject = (gameObject) =>
      gameObject._type === "GameObject"
        ? gameObject
        : this.getWrappedGameObject(gameObject.getWrappedInstance());

    registerChildGameObject = (gameObject) => {
      if (!gameObject) {
        return;
      }
      const _wrappedGameObject = this.getWrappedGameObject(gameObject);
      this.transform.add(_wrappedGameObject.transform);
      this.childGameObjects.push(gameObject);
    };

    getChildGameObjectByType = (name) => {
      const _gameObject = this.childGameObjects.find(
        (childGameObject) => this.getWrappedGameObject(childGameObject)._name === name,
      );
      return _gameObject || null;
    };

    getChildGameObjectsByType = (name) => {
      const _gameObjects = this.childGameObjects.filter(
        (childGameObject) => this.getWrappedGameObject(childGameObject)._name === name,
      );
      return _gameObjects || [];
    };

    _isEnabled = () => {
      const { enabled } = this.props;
      if (enabled === undefined || enabled) {
        return true;
      }
      return false;
    };

    _update = () => {
      if (!this._isEnabled() && !this.unmounting) {
        this.transform.visible = false;
        return;
      }
      this.transform.visible= true;
      Object.values(this.components).forEach((component) => component.update());
      this.childGameObjects.forEach((gameObject) =>
        this.getWrappedGameObject(gameObject)._update(),
      );
    };

    buildGameComponents = () => {
      const { transform,debug, ...passThroughProps } = this.props;
      const {objects, selfSettings, prefabs}  = this.props;
      const components = selfSettings && selfSettings.components ? Object.keys( selfSettings.components)
          .map(componentId=> {
            const GameObjectComponent = GameComponentFactory.create(componentId,this);
            return <GameObjectComponent
                key={componentId}
                id={componentId}
                _parentId={this.id}
                gameObject={this}
                {...passThroughProps}
                transform={this.transform}
                scene={this.scene}
                registerComponent={this.registerComponent}
                registerChildGameObject={this.registerChildGameObject}
                getChildComponent={this.getChildComponent}
                getChildGameObjectByType={this.getChildGameObjectByType}
                getChildGameObjectsByType={this.getChildGameObjectsByType}
                getAllGameObject3DChildren={this.getAllGameObject3DChildren}

            />
          }
          ) : [];
      return components;

    }

    render() {
      const { debug } = this.props;
      if (this.unmounting) {
        return null;
      }
      this.axesHelper.visible = !!debug;
      const _gameObjectComponents = this.buildGameComponents();
      return (
        [
          ..._gameObjectComponents,
          ...this.childGameObjects
        ]
      );
    }
  };


/*
import React from "react";
import * as ComponentFactory from "../../Factories/GameComponentFactory";

const ObjectLoaderMeshComponent = ComponentFactory.create("objectLoader");
const ShoeManagerComponent = ComponentFactory.create(
  "shoeController",
);
// const TransformUpdateComponent = ComponentFactory.create("transformUpdate");

export class ShoeModel extends React.Component {
  render = () => (
    <div>
      {[
        <ObjectLoaderMeshComponent key="objectloadershoe" {...this.props} />,
        <ShoeManagerComponent key="shoemanager" {...this.props}/>,
      ]}
    </div>
  );
}

*/