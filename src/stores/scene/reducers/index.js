import { initialState } from "../../initialState";

export const mainReducer = (state = initialState, action) => {
  let _parameters;
  let _oldAssetLoadState;
  let assetsLoadState;
  switch (action.type) {
    case "EMIT_LOADING_ASSET":
      _oldAssetLoadState = state.assetsLoadState ? state.assetsLoadState : {};
      assetsLoadState = {
        ..._oldAssetLoadState,
        [action.filename]: action.total,
      };
      return {
        ...state,
        assetsLoadState,
      };
    /*
        {
          type: "UPDATE_SCENE_PARAMETERS",
          parametersObject: {
            unspecified_selectedObjectId: "test2"
          }
        }
      */
    default:
      return state;
  }
};
