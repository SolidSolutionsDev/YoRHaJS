import { connect } from "react-redux";
import { Scene } from "./Scene";
import { addObject} from "../../../stores/scene/actions";

// const getObjects = (state) => {
//     return state.scene.objects;
// }

const mapStateToProps = (state) => ({
  // objects: getObjects(state),
  ...state.mainReducer.game,
});

const mapDispatchToProps = (dispatch) => ({
  addObject: (parameters) => {
    dispatch(addObject(parameters));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(Scene);
