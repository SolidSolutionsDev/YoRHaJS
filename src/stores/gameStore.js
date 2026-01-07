import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { initialScene } from './initialScene';
import * as _ from 'lodash';

/**
 * Zustand Game Store
 * Replaces Redux for state management while maintaining Unity-like GameObject architecture
 */
export const useGameStore = create(
    devtools(
        (set, get) => ({
            // ===== STATE =====
            gameObjects: initialScene.gameObjects,
            scene: initialScene.scene,
            prefabs: initialScene.prefabs,
            assetsLoadState: {},

            // ===== SCENE ACTIONS =====
            updateSceneParameters: (parametersObject) =>
                set((state) => ({
                    scene: {
                        ...state.scene,
                        ...parametersObject,
                    },
                })),

            // ===== GAMEOBJECT ACTIONS =====
            updateGameObjectParameters: (gameObjectId, gameObjectParameters) =>
                set((state) => {
                    if (!state.gameObjects.byId[gameObjectId]) {
                        console.log('gameobject not found');
                        return state;
                    }

                    const gameObject = _.cloneDeep(state.gameObjects.byId[gameObjectId]);
                    let components = gameObject.components || {};

                    if (gameObjectParameters.components) {
                        const actionComponents = gameObjectParameters.components;
                        components = Object.keys(actionComponents).reduce(
                            (accumulator, componentId) => ({
                                ...accumulator,
                                [componentId]: {
                                    ...components[componentId],
                                    ...actionComponents[componentId],
                                },
                            }),
                            {
                                ...components,
                            }
                        );
                    }

                    const updatedGameObject = {
                        ...gameObject,
                        ...gameObjectParameters,
                        components: {
                            ...components,
                        },
                    };

                    return {
                        gameObjects: {
                            ...state.gameObjects,
                            byId: {
                                ...state.gameObjects.byId,
                                [gameObjectId]: updatedGameObject,
                            },
                        },
                    };
                }),

            updateComponentParameters: (
                gameObjectId,
                gameComponentId,
                componentParameters
            ) =>
                set((state) => {
                    if (!state.gameObjects.byId[gameObjectId]) {
                        console.log('gameobject not found');
                        return state;
                    }

                    const gameObject = _.cloneDeep(state.gameObjects.byId[gameObjectId]);
                    const components = gameObject.components || {};

                    const updatedGameObject = {
                        ...gameObject,
                        components: {
                            ...components,
                            [gameComponentId]: {
                                ...components[gameComponentId],
                                ...componentParameters,
                            },
                        },
                    };

                    return {
                        gameObjects: {
                            ...state.gameObjects,
                            byId: {
                                ...state.gameObjects.byId,
                                [gameObjectId]: updatedGameObject,
                            },
                        },
                    };
                }),

            // ===== INSTANTIATION ACTIONS =====
            instantiateFromPrefab: (
                prefabId,
                newId,
                transform = null,
                parentId = null,
                components = null
            ) =>
                set((state) => {
                    if (!prefabId || !newId) return state;
                    if (state.gameObjects.allIds.includes(newId)) return state;

                    const newGameObject = {
                        debug: false,
                        prefab: prefabId,
                        transform,
                        parentId: parentId,
                        components,
                    };

                    let updatedScene = state.scene;
                    let updatedGameObjects = {
                        byId: {
                            ...state.gameObjects.byId,
                            [newId]: newGameObject,
                        },
                        allIds: [...state.gameObjects.allIds, newId],
                    };

                    if (parentId) {
                        const parent = updatedGameObjects.byId[parentId];
                        const currentChildren = parent.children || [];
                        updatedGameObjects.byId[parentId] = {
                            ...parent,
                            children: [...currentChildren, newId],
                        };
                    } else {
                        updatedScene = {
                            ...state.scene,
                            children: [...state.scene.children, newId],
                        };
                    }

                    return {
                        gameObjects: updatedGameObjects,
                        scene: updatedScene,
                    };
                }),

            instantiateFromGameObject: (
                gameObjectId,
                transform = null,
                parentId = null,
                instantiationTime = null
            ) =>
                set((state) => {
                    if (!gameObjectId) return state;

                    const gameObjectToClone = _.cloneDeep(
                        state.gameObjects.byId[gameObjectId]
                    );

                    if (transform) {
                        gameObjectToClone.transform = {
                            ...state.gameObjects.byId[gameObjectId].transform,
                            ...transform,
                        };
                    }

                    if (instantiationTime) {
                        gameObjectToClone.instantiationTime = instantiationTime;
                    }

                    const newId = _.uniqueId(gameObjectId);

                    let updatedScene = state.scene;
                    let updatedGameObjects = {
                        byId: {
                            ...state.gameObjects.byId,
                            [newId]: gameObjectToClone,
                        },
                        allIds: [...state.gameObjects.allIds, newId],
                    };

                    if (parentId) {
                        const parent = updatedGameObjects.byId[parentId];
                        const currentChildren = parent.children || [];
                        updatedGameObjects.byId[parentId] = {
                            ...parent,
                            children: [...currentChildren, newId],
                        };
                    } else {
                        updatedScene = {
                            ...state.scene,
                            children: [...state.scene.children, newId],
                        };
                    }

                    return {
                        gameObjects: updatedGameObjects,
                        scene: updatedScene,
                    };
                }),

            destroyGameObjectById: (gameObjectId) =>
                set((state) => {
                    if (!state.gameObjects.allIds.includes(gameObjectId)) {
                        console.log('GameObject does not exist ', gameObjectId);
                        return state;
                    }

                    const gameObjects = _.cloneDeep(state.gameObjects);
                    const scene = _.cloneDeep(state.scene);

                    let parent;
                    if (gameObjects.byId[gameObjectId].parentId) {
                        const parentId = gameObjects.byId[gameObjectId].parentId;
                        parent = gameObjects.byId[parentId];
                    } else {
                        parent = scene;
                    }

                    parent.children = parent.children.filter(
                        (childrenId) => childrenId !== gameObjectId
                    );

                    delete gameObjects.byId[gameObjectId];
                    gameObjects.allIds = gameObjects.allIds.filter(
                        (id) => id !== gameObjectId
                    );

                    return {
                        gameObjects: {
                            ...state.gameObjects,
                            byId: gameObjects.byId,
                            allIds: gameObjects.allIds,
                        },
                        scene: scene,
                    };
                }),

            // ===== CAMERA ACTIONS =====
            registerCamera: (cameraId) =>
                set((state) => {
                    if (!state.gameObjects.byId[cameraId]) {
                        alert('CAMERA ID NOT FOUND');
                        return state;
                    }

                    const camera = _.cloneDeep(state.scene.camera);
                    camera.allCameras = [...camera.allCameras, cameraId];
                    camera.main = camera.main ? camera.main : cameraId;

                    return {
                        scene: { ...state.scene, camera },
                    };
                }),

            removeCamera: (cameraId) =>
                set((state) => {
                    if (!state.scene.camera.allCameras.includes(cameraId)) {
                        return state;
                    }

                    const camera = _.cloneDeep(state.scene.camera);
                    camera.allCameras = camera.allCameras.filter(
                        (id) => id !== cameraId
                    );

                    if (camera.main === cameraId) {
                        camera.main = camera.allCameras[0] ? camera.allCameras[0] : null;
                    }

                    return {
                        scene: { ...state.scene, camera },
                    };
                }),

            setMainCamera: (cameraId) =>
                set((state) => {
                    if (!state.scene.camera.allCameras.includes(cameraId)) {
                        return state;
                    }

                    const camera = _.cloneDeep(state.scene.camera);
                    camera.main = cameraId;

                    return {
                        scene: { ...state.scene, camera },
                    };
                }),

            // ===== ASSET LOADING =====
            emitLoadingAsset: (filename, total) =>
                set((state) => ({
                    assetsLoadState: {
                        ...state.assetsLoadState,
                        [filename]: total,
                    },
                })),
        }),
        {
            name: 'YoRHa-Game-Store',
        }
    )
);
