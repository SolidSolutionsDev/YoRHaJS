import { connect } from "react-redux";
import { ShoeModel } from "./ShoeModel";
import { emitLoadingAsset } from "../../../../new_renderer_stores/scene/actions";

const getShoe = (state, ownProps) => state.scene.user_shoes.byId[ownProps.id];
const getShoeType = (state, ownProps) =>
  state.scene.shoes_types.byId[getShoe(state, ownProps).type];
const getShoeMaterialSet = (state, ownProps) =>
  state.scene.shoes_color_sets[getShoe(state, ownProps).option];
const getShoeColorOptions = (state) => state.scene.color_options;

const getIsSelected = (state, ownProps) =>
  ownProps.id === state.scene.current_selected_shoe;

const mapStateToProps = (state, ownProps) => {
  const shoeData = getShoe(state, ownProps);
  const shoeType = getShoeType(state, ownProps);
  return {
    objectInputData: shoeData,
    modelInputData: shoeData,
    normalizeSize: shoeType.normalizeSize,
    centerGeometry: shoeType.centerGeometry,
    assetURL: state.scene.assetsPath + shoeType.assetURL,
    isSelected: getIsSelected(state, ownProps),
    shoeData,
    shoeTypeData: getShoeType(state, ownProps),
    // shoeMaterialSet: getConvertedToColorsShoeMaterialSet(state, ownProps),
    shoeColorOptions: getShoeColorOptions(state),
    ...ownProps,
  };
};

const mapDispatchToProps = (dispatch) => ({
  emitLoadingAsset: (filename, total) => {
    dispatch(emitLoadingAsset(filename,total));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // null,
  null,
  { withRef: true },
)(ShoeModel);
