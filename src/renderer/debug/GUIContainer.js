import { connect } from "react-redux";
import { GUI } from "./GUI";
import {
  updateSceneObject,
  updateShoe,
  updateShoeMaterial,
} from "../../new_renderer_stores/scene/actions/index";

const getApplicationState = (state) => {
  const _currentSelectedType =
    state.scene.user_shoes.byId[state.scene.current_selected_shoe].type;
  return {
    scene: {
      backgroundColor: state.scene.backgroundColor,
      debug: state.scene.debug,
      cameraAutoRotate: state.scene.cameraAutoRotate,
    },
    availableShoeColorSets:
      state.scene.shoes_types.byId[_currentSelectedType].options,
    availableShoeMaterials:
      state.scene.shoes_types.byId[_currentSelectedType].materials,
    currentShoeId: state.scene.current_selected_shoe,
    custom_shoe: {
      option:
        state.scene.user_shoes.byId[state.scene.current_selected_shoe].option,
    },
    custom_materials: {
      ...state.scene.user_shoes.byId[state.scene.current_selected_shoe].custom_materials,
    }
  };
};

const getTypeState = (state) => {
  const _currentSelectedType =
    state.scene.user_shoes.byId[state.scene.current_selected_shoe].type;
  return {
    availableShoeColorSets:
      state.scene.shoes_types.byId[_currentSelectedType].options,
    option:
      state.scene.user_shoes.byId[state.scene.current_selected_shoe].option,
  };
};

const mapStateToProps = (state) => ({
  applicationState: getApplicationState(state),
  typeState: getTypeState(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateSceneObject: (parameters) => {
    dispatch(updateSceneObject(parameters));
  },
  updateShoe: (id, parameters) => {
    dispatch(updateShoe(id, parameters));
  },
  updateShoeMaterial: (id, materialId, parameters) => {
    dispatch(updateShoeMaterial(id, materialId, parameters));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GUI);
