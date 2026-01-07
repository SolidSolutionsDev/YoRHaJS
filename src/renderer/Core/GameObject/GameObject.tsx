import React from "react";
import * as THREE from "three";

import * as GameComponentFactory from "../Factories/GameComponentFactory";
import ConnectedGameObject from "./index";

// Import types
import type { IGameObject } from "../../../types/GameObject";

//TODO: add available component here maybe using contexts

/** Props for GameObject component */
interface GameObjectProps {
    id: string;
    selfSettings?: {
        tags?: string[];
        components?: Record<string, unknown>;
        children?: string[];
    };
    prefabSettings?: {
        tags?: string[];
        components?: Record<string, unknown>;
        children?: string[];
    };
    transform?: {
        position?: { x?: number; y?: number; z?: number };
        rotation?: { x?: number; y?: number; z?: number };
        scale?: { x?: number; y?: number; z?: number };
    };
    enabled?: boolean;
    debug?: boolean;
    parent?: GameObject;
    availableService?: {
        physics?: {
            purgeTransformOfEventualBodies: (transform: THREE.Object3D) => void;
        };
        audio?: unknown;
        input?: unknown;
        animation?: unknown;
    };
    availableComponent?: {
        scene?: THREE.Scene;
        renderer?: THREE.WebGLRenderer;
    };
}

interface GameObjectState {
    parent: THREE.Object3D | null;
}

/** Extended Object3D with gameObject reference */
interface GameObjectTransform extends THREE.Object3D {
    gameObject?: GameObject;
    userData: {
        belongsToGameObject?: boolean;
        [key: string]: unknown;
    };
}

export class GameObject extends React.Component<GameObjectProps, GameObjectState> implements IGameObject {
    _type: "GameObject" = "GameObject";

    transform: GameObjectTransform = new THREE.Object3D() as GameObjectTransform;

    axesHelper = new THREE.AxesHelper(5);

    // the full components to be renderered. includes connect to redux and context react components.
    componentsDictionary: Record<string, React.ReactElement> = {};
    // the inside components scripts. they contain the update and destroy calls
    componentsScriptsDictionary: Record<string, { component: unknown; update: (time: number, deltaTime?: number) => void }> = {};

    childGameObjects: React.Component[] = [];

    state: GameObjectState = {
        parent: null
    };

    private _name: string;
    private _tags: string[];
    displayName: string;
    id: string;
    private unmounting = false;

    constructor(props: GameObjectProps) {
        super(props);
        const { id, selfSettings, prefabSettings } = props;

        this._name = id;

        this.transform.userData.belongsToGameObject = true;
        this._tags = selfSettings?.tags
            ? selfSettings.tags
            : prefabSettings?.tags
                ? prefabSettings.tags
                : [];

        this.displayName = id;
        this.id = id;

        this.updateTransform();

        this.transform.name = `${id}_transform`;

        this.transform.gameObject = this;

        this.transform.add(this.axesHelper);
    }

    updateTransform = (): void => {
        const { transform } = this.props;
        if (transform?.position) {
            this.transform.position.x =
                transform.position.x !== undefined
                    ? transform.position.x
                    : this.transform.position.x;
            this.transform.position.y =
                transform.position.y !== undefined
                    ? transform.position.y
                    : this.transform.position.y;
            this.transform.position.z =
                transform.position.z !== undefined
                    ? transform.position.z
                    : this.transform.position.z;
        }

        if (transform?.rotation) {
            this.transform.rotation.x =
                transform.rotation.x !== undefined
                    ? transform.rotation.x
                    : this.transform.rotation.x;
            this.transform.rotation.y =
                transform.rotation.y !== undefined
                    ? transform.rotation.y
                    : this.transform.rotation.y;
            this.transform.rotation.z =
                transform.rotation.z !== undefined
                    ? transform.rotation.z
                    : this.transform.rotation.z;
        }

        if (transform?.scale) {
            this.transform.scale.x =
                transform.scale.x !== undefined
                    ? transform.scale.x
                    : this.transform.scale.x;
            this.transform.scale.y =
                transform.scale.y !== undefined
                    ? transform.scale.y
                    : this.transform.scale.y;
            this.transform.scale.z =
                transform.scale.z !== undefined
                    ? transform.scale.z
                    : this.transform.scale.z;
        }
    };

    componentDidUpdate(prevProps: GameObjectProps): void {
        const transformChanged = this._checkTransformChanged(prevProps);
        if (transformChanged) {
            return;
            // this.updateTransform(); // Note: unreachable code in original
        }
    }

    _checkTransformChanged = (prevProps: GameObjectProps): boolean => {
        const { transform } = this.props;
        return prevProps.transform !== transform;
    };

    registerComponent = (component: { component: unknown; update: (time: number, deltaTime?: number) => void }, _displayName: string): void => {
        this.componentsScriptsDictionary[_displayName] = component;
    };

    componentWillUnmount(): void {
        this.unmounting = true;
        this._onDestroy();
    }

    _onDestroy(): void {
        this.removeFromScene();
        this.unRegisterFromParent(this._name);
    }

    removeFromScene = (): void => {
        const scene = this.scene;
        const { availableService } = this.props;
        if (!scene) {
            return;
        }

        scene.remove(this.transform);
        if (availableService?.physics) {
            availableService.physics.purgeTransformOfEventualBodies(this.transform);
        }

        if (this.transform.parent) {
            const parent = this.transform.parent;
            parent.remove(this.transform);
        }
    };

    registerParent = (parent: THREE.Object3D): void => {
        this.setState({ parent: parent });
    };

    get scene(): THREE.Scene | null {
        return this._getScene();
    }

    _getScene = (): THREE.Scene | null => {
        const { parent } = this.state;

        if (!parent) {
            return null;
        }
        if (parent.type === "Scene") {
            return parent as THREE.Scene;
        }
        const gameObjectTransform = parent as GameObjectTransform;
        if (gameObjectTransform.gameObject) {
            return gameObjectTransform.gameObject._getScene();
        }
        return null;
    };

    getAllGameObject3DChildren = (object: THREE.Object3D = this.transform): THREE.Object3D[] => {
        let children: THREE.Object3D[] = [];
        children = children.concat(object);
        for (let i = 0; i < object.children.length; i++) {
            children = children.concat(
                this.getAllGameObject3DChildren(object.children[i])
            );
        }
        return children;
    };

    getComponent = (componentID: string): unknown =>
        this.componentsScriptsDictionary[componentID]?.component;

    getWrappedGameObject = (gameObject: any): GameObject =>
        gameObject._type === "GameObject"
            ? gameObject
            : this.getWrappedGameObject(gameObject);

    unRegisterChildGameObject = (gameObjectId: string): void => {
        this.childGameObjects = this.childGameObjects.filter((element: any) => {
            return element.props.id !== gameObjectId;
        });
    };

    unRegisterFromParent = (gameObjectId: string): void => {
        if (this.props.parent) {
            this.props.parent.unRegisterChildGameObject(gameObjectId);
        }
    };

    registerChildGameObject = (gameObject: IGameObject | null): void => {
        if (!gameObject) {
            return;
        }
        const _wrappedGameObject = (gameObject as any).transform
            ? gameObject
            : this.getWrappedGameObject(gameObject as any);
        this.transform.add(_wrappedGameObject.transform as THREE.Object3D);
        (_wrappedGameObject as any).registerParent(this.transform);
        this.childGameObjects.push(gameObject as any);
    };

    getChildGameObjectById = (wantedId: string, optionalParentGameObject: GameObject = this): IGameObject | null => {
        const _gameObject = optionalParentGameObject.childGameObjects.find(
            (childGameObject: any) =>
                this.getWrappedGameObject(childGameObject).id === wantedId
        );
        return _gameObject ? (_gameObject as any) : null;
    };

    getChildGameObjectByTag = (wantedTag: string, optionalParentGameObject: GameObject = this): IGameObject | null => {
        const _gameObject = optionalParentGameObject.childGameObjects.find(
            (childGameObject: any) =>
                this.getWrappedGameObject(childGameObject)._tags.find(
                    (tag: string) => tag === wantedTag
                )
        );
        return _gameObject ? (_gameObject as any) : null;
    };

    getChildGameObjectsByTag = (wantedTag: string, optionalParentGameObject: GameObject = this): GameObject[] => {
        const _gameObjects = optionalParentGameObject.childGameObjects
            .filter((childGameObject: any) =>
                this.getWrappedGameObject(childGameObject)._tags.find(
                    (tag: string) => tag === wantedTag
                )
            )
            .map((gameObject: any) => gameObject);
        return (_gameObjects as GameObject[]) || [];
    };

    _isEnabled = (): boolean => {
        const { enabled } = this.props;
        if (enabled === undefined || enabled) {
            return true;
        }
        return false;
    };

    _update = (time: number, deltaTime?: number): void => {
        if (!this._isEnabled() && !this.unmounting) {
            this.transform.visible = false;
            return;
        }
        this.transform.visible = true;
        Object.values(this.componentsScriptsDictionary).forEach(component =>
            component.update(time, deltaTime)
        );
        this.childGameObjects.forEach((gameObject: any) =>
            this.getWrappedGameObject(gameObject)._update(time, deltaTime)
        );
    };

    buildComponent = (componentId: string): React.ReactElement => {
        const { transform, debug, ...passThroughProps } = this.props;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const GameObjectComponent = (GameComponentFactory as any).create(componentId, this);
        if (GameObjectComponent) {
            GameObjectComponent.displayName = "Component_" + componentId;
        }

        return (
            <GameObjectComponent
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
                getChildComponent={this.getComponent}
                getChildGameObjectById={this.getChildGameObjectById}
                getChildGameObjectByTag={this.getChildGameObjectByTag}
                getChildGameObjectsByTag={this.getChildGameObjectsByTag}
                getAllGameObject3DChildren={this.getAllGameObject3DChildren}
            />
        );
    };

    buildGameComponentsDictionary = (): void => {
        const { selfSettings, prefabSettings } = this.props;
        const selfGameObjectComponents =
            selfSettings?.components ? selfSettings.components : {};
        const prefabGameObjectComponents =
            prefabSettings?.components
                ? prefabSettings.components
                : {};
        const compoundGameObjectComponents = {
            ...prefabGameObjectComponents,
            ...selfGameObjectComponents
        };

        const components = Object.keys(compoundGameObjectComponents).reduce(
            (accumulatorArray: Record<string, React.ReactElement>, componentId: string) => {
                const component =
                    this.componentsDictionary[componentId] ||
                    this.buildComponent(componentId);
                return { ...accumulatorArray, [componentId]: component };
            },
            {}
        );
        this.componentsDictionary = components;
    };

    buildChildGameObjects = (): React.ReactElement[] => {
        const { selfSettings, prefabSettings, availableService } = this.props;
        const selfChildGameObjects =
            selfSettings?.children ? selfSettings.children : [];
        const prefabChildGameObjects =
            prefabSettings?.children ? prefabSettings.children : [];
        const gameObjects = [
            ...prefabChildGameObjects,
            ...selfChildGameObjects
        ].map((gameObjectId: string) => {
            return (
                <ConnectedGameObject
                    ref={this.registerChildGameObject as any}
                    parent={this}
                    key={gameObjectId}
                    id={gameObjectId}
                    scene={this.scene}
                    availableService={availableService}
                />
            );
        });
        return gameObjects;
    };

    render(): React.ReactNode {
        const { debug } = this.props;
        if (this.unmounting) {
            console.log(this.id, " GO IS UNMOUNTING ");
            return null;
        }
        this.axesHelper.visible = !!debug;
        this.buildGameComponentsDictionary();
        const _gameObjectComponents = Object.values(this.componentsDictionary);
        const _childGameObjects = this.buildChildGameObjects();
        return [
            ..._gameObjectComponents,
            ..._childGameObjects
        ];
    }
}
