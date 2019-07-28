import { initialScene } from "../../initialScene";
import * as _ from 'lodash';

export const mainReducer = (state = initialScene, action) => {
  let _oldAssetLoadState;
  let temp = {};
  let assetsLoadState;
  const {gameObjectId, prefabId, newId, transform, parentId,instantiationTime} = action;
  switch (action.type) {
    case "UPDATE_SCENE_PARAMETERS":
      return {
        ...state,
        scene: {
        ...state.scene,
        ...action.parametersObject,
        }
      };
      case "UPDATE_GAMEOBJECT_PARAMETERS":
      temp.state = state;
      if(!state.gameObjects.byId[action.gameObjectId]) {
        console.log("gameobject not found");
        return temp.state;
      }
      temp.gameObject = _.cloneDeep(state.gameObjects.byId[action.gameObjectId]);
      temp.gameObject = {
        ...temp.gameObject,
        ...action.gameObjectParameters,
      };
      temp.state = {...state,
        gameObjects: {
          ...temp.state.gameObjects,
          byId: {
            ...temp.state.gameObjects.byId,
            [action.gameObjectId]:temp.gameObject}
          }
        }
      return temp.state;
      //TODO: flatter the state (gameComponents at the same level as gameObjects)
      case "UPDATE_COMPONENT_PARAMETERS":
      temp.state = state;
      if(!state.gameObjects.byId[action.gameObjectId]) {
        console.log("gameobject not found");
        return temp.state;
      }
      temp.gameObject = _.cloneDeep(state.gameObjects.byId[action.gameObjectId]);
      temp.components = temp.gameObject.components || {};
      temp.gameObject = {
        ...temp.gameObject,
        components: {
          ...temp.components,
          [action.gameComponentId] : {
          ...temp.components[action.gameComponentId],
          ...action.componentParameters
          },
        },
      };
      temp.state = {...state,
        gameObjects: {
          ...temp.state.gameObjects,
          byId: {
            ...temp.state.gameObjects.byId,
            [action.gameObjectId]:temp.gameObject}
          }
        }
      return temp.state;
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
        if (instantiationTime) {
          temp.gameObjectToClone.instantiationTime = instantiationTime;
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
          if(temp.state.gameObjects.allIds.includes(newId)) {
            console.log("NewId already exists!");
            return temp.state;
          }
          temp.newGameObject = {
            debug:false,
            prefab:prefabId,
            transform,
            parentId: parentId,
          };
          temp.state = {
            ...temp.state,
            gameObjects: {
              byId: {
                ...temp.state.gameObjects.byId,
                [newId] : {
                  ...temp.newGameObject,
                },
              },
              allIds: [...temp.state.gameObjects.allIds, newId]
            },
          };
          if (parentId) {
             temp.parent = temp.state.gameObjects.byId[parentId];
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
      if(temp.camera.main === action.cameraId) {
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
    case "DESTROY_GAMEOBJECT_BYID":
      temp.gameObjects = _.cloneDeep(state.gameObjects);
      temp.scene = _.cloneDeep(state.scene);
      if(!temp.gameObjects.allIds.includes(gameObjectId)) {
        console.log("GameObject does not exist ", gameObjectId);
        return state;
      }
      let _parent;
      if(temp.gameObjects.allIds.includes(action.gameObjectId)) {
        if(temp.gameObjects.byId[action.gameObjectId].parentId) {
          const _parentId = temp.gameObjects.byId[action.gameObjectId].parentId;
            _parent = temp.gameObjects.byId[_parentId];

        }
        else {
          _parent = temp.scene;
        }
        _parent.children = _parent.children.filter((childrenId) => {
          return childrenId !== action.gameObjectId
        });
        delete temp.gameObjects.byId[action.gameObjectId];
        temp.gameObjects.allIds = temp.gameObjects.allIds.filter((id)=>{return id !== action.gameObjectId});
        temp.gameObjects = {...state.gameObjects, byId: temp.gameObjects.byId, allIds: temp.gameObjects.allIds };
      }

      temp.state = {...state, gameObjects: temp.gameObjects, scene:temp.scene};
      return temp.state;
    default:
      return state;
  }
};
