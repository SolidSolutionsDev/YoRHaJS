// import { defaultState } from "../defaultState";
import { initialState } from "../../../game/redux/initialState";

export const mainReducer = (state = initialState, action) => {
  let _parameters;
  let _oldAssetLoadState;
  let assetsLoadState;
  switch (action.type) {
    case "UPDATE_SHOE":
      _parameters = action.parameters.option
        ? { ...action.parameters, custom_materials: {} }
        : action.parameters;
      return {
        ...state,
        user_shoes: {
          ...state.user_shoes,
          byId: {
            ...state.user_shoes.byId,
            [action.id]: {
              ...state.user_shoes.byId[action.id],
              ..._parameters,
            },
          },
        },
      };
    /*
    {
      type: 'UPDATE_SHOE',
        id:"test1",
      parameters: {option:"landscape_seven"}
    }
    */
    case "UPDATE_SHOE_MATERIAL":
      return {
        ...state,
        user_shoes: {
          ...state.user_shoes,
          byId: {
            ...state.user_shoes.byId,
            [action.id]: {
              ...state.user_shoes.byId[action.id],
              custom_materials: {
                ...state.user_shoes.byId[action.id].custom_materials,
                [action.materialId]: action.parameters,
              },
            },
          },
        },
      };
    /*
    {
      type: 'UPDATE_SHOE_MATERIAL',
        id:"test1",
        materialId:"n_nabuk",
      parameters: {color:"0x00ff00"}
    }
    */
    case "UPDATE_SCENE_PARAMETERS":
      return {
        ...state,
        ...action.parametersObject,
      };
    /*
        {
          type: "UPDATE_SCENE_PARAMETERS",
          parametersObject: {
            unspecified_selectedObjectId: "test2"
          }
        }
      */
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
