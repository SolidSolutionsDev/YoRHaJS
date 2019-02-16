import { connect } from "react-redux";
import { Scene } from "./Scene";

// const getObjects = (state) => {
//     return state.scene.objects;
// }

const mapStateToProps = (state) => ({
  // objects: getObjects(state),
  ...state.mainReducer.game,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(Scene);
