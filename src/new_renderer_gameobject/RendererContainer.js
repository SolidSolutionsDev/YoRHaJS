import { connect } from "react-redux";
import { Renderer } from "./Renderer";
import { addObject } from "../stores/scene/actions";

const getAssetLoadState = (state) => {
  return state.scene.assetsLoadState;
}

const mapStateToProps = (state, ownProps) => {
  const { scene, camera } = ownProps.availableComponent;
  return {
    assetsLoadState: getAssetLoadState(state),
    ...state.scene,
    scene,
    camera,
  };
};

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
)(Renderer);
