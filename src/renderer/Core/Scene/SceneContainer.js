import { connect } from "react-redux";
import { Scene } from "./Scene";

// const getObjects = (state) => {
//     return state.scene.objects;
// }

const mapStateToProps = (state) => ({
  // objects: getObjects(state),
  ...state.mainReducer,
  gameObjects: state.mainReducer.gameObjects,
  prefabs: state.mainReducer.prefabs.byId,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(Scene);
