import React from "react";
import * as THREE from "three";

import * as GameComponentFactory from "../Factories/GameComponentFactory";
import ConnectedGameObject from "./index";

//TODO: add available component here maybe using contexts

  export class GameObject extends React.Component {
    _type = "GameObject";

    transform = new THREE.Object3D();

    axesHelper = new THREE.AxesHelper(5);

    // the full components to be renderered. includes connect to redux and context react components.
    componentsDictionary = {};
    // the inside components scripts. they contain the update and destroy calls
    componentsScriptsDictionary = {};

    childGameObjects = [];

    state = {
      parent:null,
    }

    componentWillMount = () => {
      const { id } = this.props;

      this.transform.userData.belongsToGameObject = true;

     this._name = id;
     this.displayName = id;
     this.id = id;

     this.updateTransform();

      this.transform.name = `${id}_transform`;

      this.transform.gameObject = this;

      this.transform.add(this.axesHelper);
    };

    componentWillReceiveProps(nextProps) {}

    registerComponent = (component, _displayName) => {
      this.componentsScriptsDictionary[_displayName] = component;
    };

    componentWillUnmount() {
      // console.log("gameobject will unmount", this.id);
      this.unmounting = true;
      this._onDestroy();
      Object.values(this.componentsScriptsDictionary).forEach((component) => component._onDestroy());
    }

    updateTransform = () => {
      const { transform } = this.props;
      if (transform && transform.position) {
        // this.transform.position.set(...transform.position);
        this.transform.position.x = transform.position && transform.position.x ? transform.position.x : this.transform.position.x;
        this.transform.position.y = transform.position && transform.position.y ? transform.position.y : this.transform.position.y;
        this.transform.position.z = transform.position && transform.position.z ? transform.position.z : this.transform.position.z;
      }

      if (transform && transform.rotation) {
        // this.transform.position.set(...transform.position);
        this.transform.rotation.x = transform.rotation && transform.rotation._x ? transform.rotation._x : this.transform.rotation.x;
        this.transform.rotation.y = transform.rotation && transform.rotation._y ? transform.rotation._y : this.transform.rotation.y;
        this.transform.rotation.z = transform.rotation && transform.rotation._z ? transform.rotation._z : this.transform.rotation.z;
      }

      if (transform && transform.scale) {
        // this.transform.position.set(...transform.position);
        this.transform.scale.x = transform.scale && transform.scale.x ? transform.scale.x : this.transform.scale.x;
        this.transform.scale.y = transform.scale && transform.scale.y ? transform.scale.y : this.transform.scale.y;
        this.transform.scale.z = transform.scale && transform.scale.z ? transform.scale.z : this.transform.scale.z;
      }
    }

    _onDestroy() {
      // console.log("_onDestroy", this._name);
      this.removeFromScene();
      this.unRegisterFromParent(this._name);
    }

    removeFromScene =()=> {
      const { scene } = this;
      const { availableService } = this.props;
      if (!scene) {
        return;
      }

      if (availableService.physics) {
        availableService.physics.purgeTransformOfEventualBodies(this.transform);
      }

      if(this.transform.parent) {
        const parent = this.transform.parent;
        parent.remove(this.transform);
      }
    };

    registerParent = (parent) => {
      this.setState({parent:parent})
    }

    get scene() {
      return this._getScene(this.transform);
    }

    _getScene = () => {
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

    getChildComponent = (componentID) => this.componentsScriptsDictionary[componentID];

    getWrappedGameObject = (gameObject) =>
      gameObject._type === "GameObject"
        ? gameObject
        : this.getWrappedGameObject(gameObject.getWrappedInstance());


    unRegisterChildGameObject = (gameObjectId) => {
      this.childGameObjects = this.childGameObjects.filter((element) => {
        return element.props.id !== gameObjectId;
      });
    }

    unRegisterFromParent = (gameObjectId) => {
      if(this.props.parent) {
        this.props.parent.unRegisterChildGameObject(gameObjectId);
      }
    };

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

    _update = (time) => {
      if (!this._isEnabled() && !this.unmounting) {
        this.transform.visible = false;
        return;
      }
      this.transform.visible= true;
      Object.values(this.componentsScriptsDictionary).forEach((component) => component.update(time));
      this.childGameObjects.forEach((gameObject) =>
        this.getWrappedGameObject(gameObject)._update(time),
      );
    };

    buildComponent = (componentId)=> {

      const { transform,debug, ...passThroughProps } = this.props;
      const GameObjectComponent = GameComponentFactory.create(componentId,this);
      GameObjectComponent.displayName = "Component_"+componentId;
      //console.log(this.id + " gameobject will build component " + componentId );

      return <GameObjectComponent
          {...passThroughProps}
          key={componentId}
          id={componentId}
          _parentId={this.id}
          gameObject={this}
          transform={this.transform}
          transformState={transform}
          scene={this.scene}
          registerComponent={this.registerComponent}
          registerChildGameObject={this.registerChildGameObject}
          getChildComponent={this.getChildComponent}
          getChildGameObjectByType={this.getChildGameObjectByType}
          getChildGameObjectsByType={this.getChildGameObjectsByType}
          getAllGameObject3DChildren={this.getAllGameObject3DChildren}

      />
    }

    buildGameComponentsDictionary = () => {
      const { selfSettings, prefabSettings}  = this.props;
      const selfGameObjectComponents = selfSettings && selfSettings.components ? selfSettings.components : {};
      const prefabGameObjectComponents = prefabSettings && prefabSettings.components ? prefabSettings.components : {};
      const compoundGameObjectComponents = {...prefabGameObjectComponents,...selfGameObjectComponents };

      // TODO: we need to save internally all generated components otherwise
      // as redux connect mounts and unmounts components, they will be reseted and re created
      // that means repeated threejs objects appearing
      const components = Object.keys(compoundGameObjectComponents)
          .reduce((accumulatorArray, componentId)=> {
            const component = this.componentsDictionary[componentId] || this.buildComponent(componentId);
            return  {...accumulatorArray, [componentId]:component};
          },{}
          );
      this.componentsDictionary = components;
    }


    buildChildGameObjects = () => {
      const { selfSettings, prefabSettings}  = this.props;
      const selfChildGameObjects = selfSettings && selfSettings.children ? selfSettings.children : [];
      const prefabChildGameObjects = prefabSettings && prefabSettings.children ? prefabSettings.children : [];
      const gameObjects = [...prefabChildGameObjects,...selfChildGameObjects]
              .map(gameObjectId=> {
                return <ConnectedGameObject ref={this.registerChildGameObject} parent={this} key={gameObjectId} id={gameObjectId} scene={this.scene}
                />} );
      return gameObjects;
    }

    render() {
      const { debug } = this.props;
      if (this.unmounting) {
        console.log(this.id, " GO IS UNMOUNTING ");
        return null;
      }
      this.axesHelper.visible = !!debug;
      this.buildGameComponentsDictionary();
      const _gameObjectComponents = Object.values(this.componentsDictionary);
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