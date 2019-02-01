import { connect } from "react-redux";
import { Camera } from "./Camera";
import { updateSceneObject } from "../../../stores/scene/actions";

const getAllowedPositions = (state) => state.scene.cameraAllowedPositions;

const mapStateToProps = (state) => ({
  allowedPositions: getAllowedPositions(state),
  ...state.scene,
});

const mapDispatchToProps = (dispatch) => ({
  updateSceneObject: (parameters) => {
    dispatch(updateSceneObject(parameters));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(Camera);
