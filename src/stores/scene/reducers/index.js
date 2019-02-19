import { initialState } from "../../initialState";
import * as _ from 'lodash';

export const mainReducer = (state = initialState, action) => {
  let _oldAssetLoadState;
  let temp = {};
  let assetsLoadState;
  const {gameObjectId, prefabId, newId, transform, parentId} = action;
  switch (action.type) {
    case "UPDATE_SCENE_PARAMETERS":
      return {
        ...state,
        ...action.parametersObject,
      };
    case "EMIT_LOADING_ASSET":
      _oldAssetLoadState = state.assetsLoadState ? state.assetsLoadState : {};
      assetsLoadState = {
        ..._oldAssetLoadState,
        [action.filename]: action.total,
      };
      return {
        ...state,
        assetsLoadState,
      };
      // TODO: refactor this and prefab as they share same logic with var name changes (attention to newId)
      // TODO FIRST: restructure state so we don't need this quantity of nesting
    case "INSTANTIATE_FROM_GAMEOBJ":
      temp.state = state;
      temp.scene = state.scene;
      temp.gameObjects = temp.scene.gameObjects.byId;
      if (gameObjectId) {
        temp.gameObjectToClone = _.cloneDeep( temp.gameObjects[gameObjectId]);
        if (transform) {
          temp.gameObjectToClone.transform = {...temp.gameObjects[gameObjectId].transform, ...transform};
        }
        temp.newId = _.uniqueId(gameObjectId);
        temp.state = {
          ...temp.state,
          scene: {
            ...temp.state.scene,
            gameObjects: {
              byId: {
                  ...temp.state.scene.gameObjects.byId,
                [temp.newId] : temp.gameObjectToClone
              },
              allIds: [...temp.state.scene.gameObjects.allIds, temp.newId]
            },
          }
        };
        if (parentId) {
          temp.parent = temp.state.scene.gameObjects.byId[parentId];
          const _currentChildren = temp.parent.children || [];
          temp.parent.children= [..._currentChildren, temp.newId  ];
        }
        else {
          temp.state.scene.children = [...temp.state.scene.children, temp.newId]
        }
      }
      return temp.state;
      /*
      {
        type: 'INSTANTIATE_FROM_GAMEOBJ',
        gameObjectId:"testShooter1",
        transform: {position: {x:0,y:0,z:10}}
      }
      {
        type: 'INSTANTIATE_FROM_GAMEOBJ',
        gameObjectId:"testCubeGameObject1",
        transform: {position: {x:0,y:0,z:10}},
        parentId: "testShooter1"
      }
       */
    case "INSTANTIATE_FROM_PREFAB":
      temp.state = state;
      temp.scene = state.scene;
      temp.gameObjects = temp.scene.gameObjects.byId;
      if (prefabId && newId) {
        temp.newGameObject = {
            debug:true,
            prefab:prefabId,
            transform
          },
          temp.state = {
            ...temp.state,
            scene: {
              ...temp.state.scene,
              gameObjects: {
                byId: {
                  ...temp.state.scene.gameObjects.byId,
                  [newId] : temp.newGameObject
                },
                allIds: [...temp.state.scene.gameObjects.allIds, newId]
              },
            }
          };
          if (parentId) {
            temp.parent = temp.state.scene.gameObjects.byId[parentId];
            const _currentChildren = temp.parent.children || [];
            temp.parent.children= [..._currentChildren, newId  ];
          }
          else {
            temp.state.scene.children = [...temp.state.scene.children, newId]
          }
        }
      return temp.state;
      /*
         {
        type: 'INSTANTIATE_FROM_PREFAB',
        prefabId:"TestCube",
        transform: {position: {x:0,y:0,z:10}},
        parentId: "testShooter1",
        newId: "teste"
      }
       */
    default:
      return state;
  }
};
