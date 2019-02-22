import { connect } from "react-redux";
import { Scene } from "./Scene";
import {
  registerCamera,
  removeCamera,
  setMainCamera,
} from "../../../stores/scene/actions";
// const getObjects = (state) => {
//     return state.scene.objects;
// }

const mapStateToProps = (state) => ({
  // objects: getObjects(state),
  ...state.mainReducer,
  camera: state.mainReducer.scene.camera,
  gameObjects: state.mainReducer.gameObjects,
  prefabs: state.mainReducer.prefabs.byId,
});

const mapDispatchToProps = (dispatch) => ({
  registerCamera: (gameObjectId) => {
    dispatch(registerCamera(gameObjectId));
  },
  removeCamera: (gameObjectId) => {
    dispatch(removeCamera(gameObjectId));
  },
  setMainCamera: (gameObjectId) => {
    dispatch(setMainCamera(gameObjectId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(Scene);
