import { initialState } from "../../initialState";

export const mainReducer = (state = initialState, action) => {
  let _oldAssetLoadState;
  let assetsLoadState;
  switch (action.type) {
    case "UPDATE_SCENE_PARAMETERS":
      return {
        ...state,
        ...action.parametersObject,
      };
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
    case "INSTANTIATE":

      return {
        ...state,
      };
    default:
      return state;
  }
};
