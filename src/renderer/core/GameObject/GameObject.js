import React, { Component } from "react";

import * as THREE from "three";
import * as GameComponentFactory from "../Factories/GameComponentFactory";
import ConnectedGameObject from "./index";

//TODO: add available component here maybe using contexts

  export class GameObject extends React.Component {
    _type = "GameObject";

    transform = new THREE.Object3D();

    axesHelper = new THREE.AxesHelper(5);

    components = {};

    childGameObjects = [];

    state = {
      parent:null,
    }

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

    registerParent = (parent) => {
      this.setState({parent:parent})
    }

    get scene() {
      return this._getScene(this.transform);
    }

    _getScene = (object) => {
      const { parent } = this.state;

      if (!parent) {
        return null;
      }
      if (parent.type === "Scene") {
        return parent;
      }
      return parent.gameObject._getScene(parent);
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
      const _wrappedGameObject = gameObject.transform ? gameObject : this.getWrappedGameObject(gameObject);
      this.transform.add(_wrappedGameObject.transform);
      _wrappedGameObject.registerParent(this.transform);
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
      console.log("component",this.props);
      const components = selfSettings && selfSettings.components ? Object.keys( selfSettings.components)
          .map(componentId=> {
            const GameObjectComponent = GameComponentFactory.create(componentId,this);
            GameObjectComponent.displayName = "Component_"+componentId;
            return <GameObjectComponent
                {...passThroughProps}
                key={componentId}
                id={componentId}
                _parentId={this.id}
                gameObject={this}
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


    buildChildGameObjects = () => {
      const { transform,debug, ...passThroughProps } = this.props;
      const {objects, selfSettings, prefabs}  = this.props;
      const gameObjects = selfSettings && selfSettings.children ? selfSettings.children
              .map(gameObjectId=> {
                return <ConnectedGameObject ref={this.registerChildGameObject} parent={this} key={gameObjectId} id={gameObjectId} scene={this.scene}
                />} )
          : []
      return gameObjects;
    }

    render() {
      const { debug } = this.props;
      if (this.unmounting) {
        return null;
      }
      this.axesHelper.visible = !!debug;
      const _gameObjectComponents = this.buildGameComponents();
      const _childGameObjects = this.buildChildGameObjects();
      return (
        [
          ..._gameObjectComponents,
          ..._childGameObjects,
          // ...this.childGameObjects
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