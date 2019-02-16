import { connect } from "react-redux";
import { Renderer } from "./Renderer";
import { addObject } from "../stores/scene/actions";

const getAssetLoadState = (state) => {
  return state.mainReducer.game.assetsLoadState;
}

const mapStateToProps = (state, ownProps) => {
  const { scene, camera } = ownProps.availableComponent;
  return {
    assetsLoadState: getAssetLoadState(state),
    ...state.mainReducer.game.renderer,
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(Renderer);