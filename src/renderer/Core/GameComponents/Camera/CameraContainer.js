import { connect } from "react-redux";
import { Camera } from "./Camera";
import { updateSceneObject } from "../../../../stores/scene/actions";

const getAllowedPositions = (state) => state.mainReducer.engine.prefabs["dynamicCamera"].components.dynamicCameraManager.cameraAllowedPositions;

const mapStateToProps = (state) => ({
  allowedPositions: getAllowedPositions(state),
  ...state.mainReducer.engine.prefabs["dynamicCamera"].components.dynamicCameraManager,
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
