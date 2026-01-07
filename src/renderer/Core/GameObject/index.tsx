import { connect } from "react-redux";
import { GameObject } from "./GameObject";
import { RootState } from "../../../types/Store";

interface AppState {
  mainReducer: RootState;
}

const getGameObjects = (state: AppState) => {
  // console.log("child test0",state.mainReducer.scene.gameObjects);
  return state.mainReducer.gameObjects;
};

const getSelf = (state: AppState, id: string) => {
  return state.mainReducer.gameObjects.byId[id];
};

const getSelfPrefab = (state: AppState, id: string) => {
  const self = getSelf(state, id);
  const _prefabId = self ? self.prefab : null;
  if (!_prefabId) {
    return null;
  }
  const _prefab = getPrefabs(state).byId[_prefabId];
  return _prefab;
};

const getPrefabs = (state: AppState) => {
  return state.mainReducer.prefabs;
};

const mapStateToProps = (state: AppState, props: any) => ({
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
  { forwardRef: true }
)(GameObject);
