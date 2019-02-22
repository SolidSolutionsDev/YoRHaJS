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
    case "INSTANTIATE_FROM_GAMEOBJ":
      temp.state = state;
      if (gameObjectId) {
        temp.gameObjectToClone = _.cloneDeep( temp.state.gameObjects.byId[gameObjectId]);
        if (transform) {
          temp.gameObjectToClone.transform = {...temp.state.gameObjects.byId[gameObjectId].transform, ...transform};
        }
        temp.newId = _.uniqueId(gameObjectId);
        temp.state = {
          ...temp.state,
          gameObjects: {
            byId: {
                ...temp.state.gameObjects.byId,
              [temp.newId] : temp.gameObjectToClone
            },
            allIds: [...temp.state.gameObjects.allIds, temp.newId]
          },
        };
        //this is not being used
        if (parentId) {
          temp.parent = temp.state.gameObjects.byId[parentId];
          const _currentChildren = temp.parent.children || [];
          temp.parent.children= [..._currentChildren, temp.newId  ];
        }
        else {
          temp.state.scene.children = [...temp.state.scene.children, temp.newId]
        }
      }
      return temp.state;
    case "INSTANTIATE_FROM_PREFAB":
      temp.state = state;
      if (prefabId && newId) {
        temp.newGameObject = {
            debug:true,
            prefab:prefabId,
            transform
          },
          temp.state = {
            ...temp.state,
            gameObjects: {
              byId: {
                ...temp.state.gameObjects.byId,
                [newId] : temp.newGameObject
              },
              allIds: [...temp.state.gameObjects.allIds, newId]
            },
          };
          //this is not being used
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
    case "REGISTER_CAMERA":
      temp.camera =  _.cloneDeep(state.scene.camera);
      if(!state.gameObjects.byId[action.cameraId]) {
        alert("CAMERA ID NOT FOUND");
        return state;
      }
      temp.camera.allCameras = [...temp.camera.allCameras, action.cameraId];
      temp.camera.main = temp.camera.main ? temp.camera.main : action.cameraId;
      temp.scene = {...state.scene, camera: temp.camera};
      temp.state = {...state, scene: temp.scene};
      return temp.state;
    case "REMOVE_CAMERA":
      if(!state.scene.camera.allCameras.includes(action.cameraId)) {
        return state;
      }
      temp.camera = _.cloneDeep(state.scene.camera);
      temp.camera.allCameras = temp.camera.allCameras.filter((cameraId)=>{return cameraId !== action.cameraId});
      if(temp.camera.main == action.cameraId) {
        temp.camera.main = temp.camera.allCameras[0] ? temp.camera.allCameras[0] : null;
      }
      temp.scene = {...state.scene, camera: temp.camera};
      temp.state = {...state, scene: temp.scene};
     return temp.state;
    case "SET_MAIN_CAMERA":
      if(!state.scene.camera.allCameras.includes(action.cameraId)) {
        return state;
      }
      temp.camera = _.cloneDeep(state.scene.camera);
      temp.camera.main = action.cameraId;
      temp.scene = {...state.scene, camera: temp.camera};
      temp.state = {...state, scene: temp.scene};
      return temp.state;
    default:
      return state;
  }
};
