import { connect } from "react-redux";
import { GameObject } from "./GameObject";

const getGameObjects = state => {
  // console.log("child test0",state.mainReducer.scene.gameObjects);
  return state.mainReducer.gameObjects;
};

const getSelf = (state, id) => {
  return state.mainReducer.gameObjects.byId[id];
};

const getSelfPrefab = (state, id) => {
  const _prefabId = getSelf(state, id).prefab;
  if (!_prefabId) {
    return null;
  }
  const _prefab = getPrefabs(state).byId[_prefabId];
  return _prefab;
};

const getPrefabs = state => {
  return state.mainReducer.prefabs;
};

const mapStateToProps = (state, props) => ({
  ...props,
  objects: getGameObjects(state),
  selfSettings: getSelf(state, props.id),
  transform: getSelf(state, props.id)
    ? getSelf(state, props.id).transform
    : undefined,
  debug: getSelf(state, props.id) ? getSelf(state, props.id).debug : undefined,
  prefabs: getPrefabs(state),
  prefabSettings: getSelfPrefab(state, props.id)
  // ...state.mainReducer.scene,
});

//const mapDispatchToProps = (dispatch) => ({
// TODO : add here dispatch to use Instatiate https://docs.unity3d.com/ScriptReference/Object.Instantiate.html
//});

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
  null,
  null,
  { withRef: true }
)(GameObject);
