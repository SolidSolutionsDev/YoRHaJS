import { connect } from "react-redux";
import { LightGroup } from "./LightGroup";
import { emitLoadingAsset } from "../../../../new_renderer_stores/scene/actions";

const getModel = (state) => {
  const { scene } = state;
  const { lights } = scene;
  return lights;
};

const mapStateToProps = (state, ownProps) => {
  const lightsData = getModel(state);
  return {
    assetURL: state.scene.assetsPath + lightsData.assetURL,
    ...ownProps,
  };
};

const mapDispatchToProps = (dispatch) => ({
  emitLoadingAsset: (filename, total) => {
    dispatch(emitLoadingAsset(filename, total));
  },
});

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
  null,
  null,
  { withRef: true },
)(LightGroup);
