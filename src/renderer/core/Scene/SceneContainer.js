import { connect } from "react-redux";
import { Scene } from "./Scene";
import { addObject, updateSceneObject } from "../../../new_renderer_stores/scene/actions";

// const getObjects = (state) => {
//     return state.scene.objects;
// }

const mapStateToProps = (state) => ({
  // objects: getObjects(state),
  ...state.scene,
});

const mapDispatchToProps = (dispatch) => ({
  addObject: (parameters) => {
    dispatch(addObject(parameters));
  },
  selectObject: (id) => {
    dispatch(
      updateSceneObject({
        unspecified_selectedObjectId: id,
        unspecified_selectedCornerId: null,
      }),
    );
  },
  selectCorner: (selectedCornerId) => {
    dispatch(
      updateSceneObject({
        unspecified_selectedCornerId: selectedCornerId,
      }),
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(Scene);
