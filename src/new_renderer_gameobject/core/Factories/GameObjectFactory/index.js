import { connect } from "react-redux";
import { makeGameObject } from "../../HOC/GameObjectHOC";
import { addObject, updateSceneObject } from "../../../stores/scene/actions";


const getGameObjects = (state) => {
    return state.game.scene.gameObjects;
}

const getSelf = (state,id) => {
  return state.game.scene.gameObjects.byId[id];
}

const getPrefabs = (state) => {
  return state.engine.prefabs;
}

const mapStateToProps = (state,props) => ({
    objects: getGameObjects(state),
    selfSettings: getSelf(state,props.id),
    transform: getSelf(state,props.id).transform,
    prefabs: getPrefabs(state,props.id),
  ...state.game.scene,
});

const mapDispatchToProps = (dispatch) => ({
    // TODO : add here dispatch to use Instatiate https://docs.unity3d.com/ScriptReference/Object.Instantiate.html
 });

export const create = (id) => {
  let _gameObject = connect(
      mapStateToProps,
      mapDispatchToProps,
      null,
      { withRef: true },
  )(makeGameObject(id));
  return _gameObject;
};

//
// const _gameObjects = {
//   lightGroup: makeGameObject(LightGroupContainer, "lightGroup"),
//   default: makeGameObject(EmptyGameObject, "default"),
//   shoe: makeGameObject(ShoeModelContainer, "shoe"),
//   shoeGroup: makeGameObject(ShoeGroup, "shoeGroup"),
// };
