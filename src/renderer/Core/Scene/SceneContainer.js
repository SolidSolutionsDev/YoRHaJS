import { connect } from "react-redux";
import { Scene } from "./Scene";
import {
  batchActions,
  registerCamera,
  removeCamera,
  setMainCamera
} from "../../../stores/scene/actions";
// const getObjects = (state) => {
//     return state.scene.objects;
// }

const mapStateToProps = state => ({
  // objects: getObjects(state),
  ...state.mainReducer,
  camera: state.mainReducer.scene.camera,
  gameObjects: state.mainReducer.gameObjects,
  prefabs: state.mainReducer.prefabs.byId
});

const mapDispatchToProps = dispatch => ({
  registerCamera: gameObjectId => {
    dispatch(registerCamera(gameObjectId));
  },
  removeCamera: gameObjectId => {
    dispatch(removeCamera(gameObjectId));
  },
  setMainCamera: gameObjectId => {
    dispatch(setMainCamera(gameObjectId));
  },
  dequeueActions: enqueuedActionsArray => {
    if (enqueuedActionsArray.length) {
      const actionsArray = enqueuedActionsArray.splice(0,enqueuedActionsArray.length); // this is used to empty the original array and save a copy
      dispatch(batchActions(actionsArray));
      // batch(() => {
      //   while (enqueuedActionsArray.length) {
      //     dispatch(enqueuedActionsArray.pop());
      //   }
      // });
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true
  }
)(Scene);
