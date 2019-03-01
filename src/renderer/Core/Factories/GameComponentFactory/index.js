import { connect } from "react-redux";
import { makeGameComponent } from "../../HOC/GameComponentHOC";
import {
  instantiateFromGameObject,
  instantiateFromPrefab,
  destroyGameObjectInstanceById,
} from "../../../../stores/scene/actions";

import {components} from "../../GameComponents";

const getSelf = (state,id,parentId) => {
  return state.mainReducer.gameObjects.byId[parentId].components ? state.mainReducer.gameObjects.byId[parentId].components[id]: {};
}

const getSelfPrefab = (state, id,parentId) => {
  const _prefabId = state.mainReducer.gameObjects.byId[parentId].prefab;
  if (!_prefabId) {
    return {};
  }
  const _prefab = getPrefabs(state).byId[_prefabId];
  return _prefab.components && _prefab.components[id] ? _prefab.components[id] : {};
}

const getPrefabs = (state) => {
  return state.mainReducer.prefabs;
}

const mapDispatchToProps = (dispatch) => ({
  instantiateFromGameObject: (gameObjectId, transform, parentId) => {
    dispatch(instantiateFromGameObject(gameObjectId, transform, parentId));
  },
  instantiateFromPrefab: (prefabId, newId, transform, parentId) => {
    dispatch(instantiateFromPrefab(prefabId, newId, transform, parentId));
  },
  destroyGameObjectInstanceById: (gameObjectId) => {
    dispatch(destroyGameObjectInstanceById(gameObjectId));
  },
});


const mapStateToProps = (state,props) => ({
  ...props,
  gameObjects : state.mainReducer.gameObjects.byId,
  prefabs : state.mainReducer.prefabs,
  selfSettings: {...getSelfPrefab(state,props.id,props._parentId), ...getSelf(state,props.id,props._parentId)},
});

export const create = (type) => {
  let component = components[type];
  if (!component) {
    alert(`Requested component '${type}' is non-existant!`);
  }
  else {
    component = makeGameComponent(component,type);
    component = connect(
        mapStateToProps,
        mapDispatchToProps,
        null,
        { withRef: true },
    )(component);
  }
  return component;
};
