// import { initialScene } from "../../initialScene";
import {initialScene} from "../../initialSceneSolid";
import * as _ from "lodash";

const instantiateFromPrefabReducer = (state, action) => {
    let temp = {};
    temp.state = state;
    const {prefabId, newId, transform, parentId, components} = action;
    if (prefabId && newId) {
        if (temp.state.gameObjects.allIds.includes(newId)) {
            return temp.state;
        }
        const _transform = {
            ...state.prefabs.byId[prefabId].transform,
            ...transform
        };
        temp.newGameObject = {
            debug: false,
            prefab: prefabId,
            transform: _transform,
            parentId: parentId,
            components
        };
        temp.state = {
            ...temp.state,
            gameObjects: {
                byId: {
                    ...temp.state.gameObjects.byId,
                    [newId]: {
                        ...temp.newGameObject
                    }
                },
                allIds: [...temp.state.gameObjects.allIds, newId]
            }
        };
        if (parentId) {
            temp.parent = temp.state.gameObjects.byId[parentId];
            const _currentChildren = temp.parent.children || [];
            temp.parent.children = [..._currentChildren, newId];
        } else {
            temp.state.scenes[temp.state.game.activeScenes[0]].children = [
                ...temp.state.scenes[temp.state.game.activeScenes[0]].children,
                newId
            ];
        }
    }
    return temp.state;
};

export const mainReducer = (state = initialScene, action) => {
    let _oldAssetLoadState;
    let temp = {};
    let assetsLoadState;
    const {gameObjectId, transform, parentId, instantiationTime} = action;
    switch (action.type) {
        case "UPDATE_GAME_PARAMETERS":
            return {
                ...state,
                game: {
                    ...state.game,
                    ...action.parametersObject
                }
            };
        case "UPDATE_SCENE_PARAMETERS":
            return {
                ...state,
                scene: {
                    ...state.scene,
                    ...action.parametersObject
                }
            };
        case "UPDATE_GAMEOBJECT_PARAMETERS":
            temp.state = state;
            if (!state.gameObjects.byId[action.gameObjectId]) {
                console.log("gameobject not found:" + action.gameObjectId);
                return temp.state;
            }
            temp.gameObject = _.cloneDeep(
                state.gameObjects.byId[action.gameObjectId]
            );
            temp.components = temp.gameObject.components || {};
            if (action.gameObjectParameters.components) {
                temp.actionComponents = action.gameObjectParameters.components;
                temp.components = Object.keys(temp.actionComponents).reduce(
                    (accumulator, componentId) => ({
                        ...accumulator,
                        [componentId]: {
                            ...temp.components[componentId],
                            ...temp.actionComponents[componentId]
                        }
                    }),
                    {
                        ...temp.components
                    }
                );
            }
            temp.gameObject = {
                ...temp.gameObject,
                ...action.gameObjectParameters,
                components: {
                    ...temp.components
                }
            };
            temp.state = {
                ...state,
                gameObjects: {
                    ...temp.state.gameObjects,
                    byId: {
                        ...temp.state.gameObjects.byId,
                        [action.gameObjectId]: temp.gameObject
                    }
                }
            };
            return temp.state;
        //TODO: flatter the state (gameComponents at the same level as gameObjects)
        case "UPDATE_COMPONENT_PARAMETERS":
            temp.state = state;
            if (!state.gameObjects.byId[action.gameObjectId]) {
                console.log("gameobject not found:" + action.gameObjectId);
                return temp.state;
            }
            temp.gameObject = _.cloneDeep(
                state.gameObjects.byId[action.gameObjectId]
            );
            temp.components = temp.gameObject.components || {};
            temp.gameObject = {
                ...temp.gameObject,
                components: {
                    ...temp.components,
                    [action.gameComponentId]: {
                        ...temp.components[action.gameComponentId],
                        ...action.componentParameters
                    }
                }
            };
            temp.state = {
                ...state,
                gameObjects: {
                    ...temp.state.gameObjects,
                    byId: {
                        ...temp.state.gameObjects.byId,
                        [action.gameObjectId]: temp.gameObject
                    }
                }
            };
            return temp.state;
        case "EMIT_LOADING_ASSET":
            _oldAssetLoadState = state.assetsLoadState ? state.assetsLoadState : {};
            assetsLoadState = {
                ..._oldAssetLoadState,
                [action.filename]: action.total
            };
            return {
                ...state,
                assetsLoadState
            };
        // TODO: refactor this and prefab as they share same logic with var name changes (attention to newId)
        case "INSTANTIATE_FROM_GAMEOBJ":
            temp.state = state;
            if (gameObjectId) {
                temp.gameObjectToClone = _.cloneDeep(
                    temp.state.gameObjects.byId[gameObjectId]
                );
                if (transform) {
                    temp.gameObjectToClone.transform = {
                        ...temp.state.gameObjects.byId[gameObjectId].transform,
                        ...transform
                    };
                }
                if (instantiationTime) {
                    temp.gameObjectToClone.instantiationTime = instantiationTime;
                }
                temp.newId = _.uniqueId(gameObjectId);
                temp.state = {
                    ...temp.state,
                    gameObjects: {
                        byId: {
                            ...temp.state.gameObjects.byId,
                            [temp.newId]: temp.gameObjectToClone
                        },
                        allIds: [...temp.state.gameObjects.allIds, temp.newId]
                    }
                };
                //this is not being used
                if (parentId) {
                    temp.parent = temp.state.gameObjects.byId[parentId];
                    const _currentChildren = temp.parent.children || [];
                    temp.parent.children = [..._currentChildren, temp.newId];
                } else {
                    temp.state.scene.children = [
                        ...temp.state.scene.children,
                        temp.newId
                    ];
                }
            }
            return temp.state;
        case "INSTANTIATE_FROM_PREFAB":
            return instantiateFromPrefabReducer(state, action);
        case "REGISTER_CAMERA":
            if (!state.gameObjects.byId[action.cameraId]) {
                alert("CAMERA ID NOT FOUND");
                return state;
            }
            temp.allCameras = [...state.game.allCameras, action.cameraId];
            temp.scenes = _.cloneDeep(state.scenes);
            Object.keys(temp.scenes).forEach(sceneId => {
                temp.scenes[sceneId].camera.main = temp.scenes[sceneId].camera.main
                    ? temp.scenes[sceneId].camera.main
                    : action.cameraId;
            });
            temp.game = {...state.game, allCameras: temp.allCameras};
            temp.state = {...state, scenes: temp.scenes, game: temp.game};
            return temp.state;
        case "REMOVE_CAMERA":
            if (!state.scene.camera.allCameras.includes(action.cameraId)) {
                return state;
            }
            temp.allCameras = _.cloneDeep(state.game.allCameras);
            temp.allCameras = temp.allCameras.filter(cameraId => {
                return cameraId !== action.cameraId;
            });
            temp.scenes = _.cloneDeep(state.scenes);
            temp.scenes = Object.keys(temp.scenes).forEach(sceneId => {
                if (temp.scenes[sceneId].camera.main === action.cameraId) {
                    temp.scenes[sceneId].camera.main = temp.allCameras[0]
                        ? temp.allCameras[0]
                        : null;
                }
            });

            temp.game = {...state.game, allCameras: temp.allCameras};
            temp.state = {...state, scenes: temp.scenes, game: temp.game};
            return temp.state;
        case "SET_MAIN_CAMERA":
            if (!state.game.allCameras.includes(action.cameraId)) {
                return state;
            }
            temp.camera = _.cloneDeep(state.scenes[action.sceneId].camera);
            temp.camera.main = action.cameraId;
            temp.scenes = {
                ...state.scenes,
                [action.sceneId]: {
                    ...state.scenes[action.sceneId],
                    camera: temp.camera
                }
            };
            temp.state = {...state, scenes: {...temp.scenes}};
            return temp.state;
        case "DESTROY_GAMEOBJECT_BYID":
            temp.gameObjects = _.cloneDeep(state.gameObjects);
            temp.scene = _.cloneDeep(state.scene);
            if (!Object.keys(temp.gameObjects.byId).includes(gameObjectId)) {
                console.log("GameObject does not exist ", gameObjectId);
                return state;
            }
            let _parent;
            if (Object.keys(temp.gameObjects.byId).includes(action.gameObjectId)) {
                if (action.parentId) {
                    const _parentId = action.parentId;
                    _parent = temp.gameObjects.byId[_parentId];
                } else {
                    _parent = temp.scene;
                }
                _parent.children = _parent.children.filter(childrenId => {
                    return childrenId !== action.gameObjectId;
                });
                delete temp.gameObjects.byId[action.gameObjectId];
                temp.gameObjects.allIds = temp.gameObjects.allIds.filter(id => {
                    return id !== action.gameObjectId;
                });
                temp.gameObjects = {
                    ...state.gameObjects,
                    byId: temp.gameObjects.byId,
                    allIds: temp.gameObjects.allIds
                };
            }

            temp.state = {
                ...state,
                gameObjects: temp.gameObjects,
                scene: temp.scene
            };
            return temp.state;
        default:
            return state;
    }
};
