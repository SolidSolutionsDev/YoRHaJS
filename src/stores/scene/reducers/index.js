import { initialState } from "../../initialState";
import * as _ from 'lodash';

export const mainReducer = (state = initialState, action) => {
  let _oldAssetLoadState;
  let reducerStorageTemporaryObject = {};
  let assetsLoadState;
  const {gameObjectId, transform, parentId} = action;
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
    case "INSTANTIATE_FROM_GO":
      reducerStorageTemporaryObject.scene = state.game.scene;
      reducerStorageTemporaryObject.gameObjects = reducerStorageTemporaryObject.scene.gameObjects.byId;
      reducerStorageTemporaryObject.state = state;
      if (gameObjectId) {
        reducerStorageTemporaryObject.gameObjectToClone = _.cloneDeep( reducerStorageTemporaryObject.gameObjects[gameObjectId]);
        if (transform) {
          reducerStorageTemporaryObject.gameObjectToClone.transform = {...reducerStorageTemporaryObject.gameObjects[gameObjectId].transform, ...transform};
        }
        reducerStorageTemporaryObject.newId = _.uniqueId(gameObjectId);
        reducerStorageTemporaryObject.state = {
          ...reducerStorageTemporaryObject.state,
          game: {
            ...reducerStorageTemporaryObject.state.game,
            scene: {
              ...reducerStorageTemporaryObject.state.game.scene,
              gameObjects: {
                byId: {
                    ...reducerStorageTemporaryObject.state.game.scene.gameObjects.byId,
                  [reducerStorageTemporaryObject.newId] : reducerStorageTemporaryObject.gameObjectToClone
                },
                allIds: [...reducerStorageTemporaryObject.state.game.scene.gameObjects.allIds, reducerStorageTemporaryObject.newId]
              },
            }
          }
        };
        if (parentId) {
          reducerStorageTemporaryObject.parent = reducerStorageTemporaryObject.state.game.scene.gameObjects.byId[parentId]
          reducerStorageTemporaryObject.parent.children= [...reducerStorageTemporaryObject.parent.children, reducerStorageTemporaryObject.newId  ];
        }
        else {
          reducerStorageTemporaryObject.parent = reducerStorageTemporaryObject.state.game.scene.children = [...reducerStorageTemporaryObject.parent = reducerStorageTemporaryObject.state.game.scene.children, reducerStorageTemporaryObject.newId]
        }
      }
      return reducerStorageTemporaryObject.state;
      /*
      {
        type: 'INSTANTIATE_FROM_GO',
        gameObjectId:"testShooter1",
        transform: {position: {x:0,y:0,z:10}}
      }
       */
    case "INSTANTIATE_FROM_PREFAB":
      return {
        ...state,
      };
    default:
      return state;
  }
};
