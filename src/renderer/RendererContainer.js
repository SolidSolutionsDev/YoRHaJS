import { connect } from "react-redux";
import { Renderer } from "./Renderer";
import { addObject } from "../new_renderer_stores/scene/actions";

const getAssetLoadState = (state) => {
  console.log(state);
  return state.mainReducer.engine.assetsLoadState;
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
