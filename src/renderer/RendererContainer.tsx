import { connect } from "react-redux";
import { Renderer } from "./Renderer";
import { RootState } from "../types/Store";

interface AppState {
  mainReducer: RootState;
}

const getAssetLoadState = (state: AppState) => {
  return state.mainReducer.assetsLoadState;
};

const mapStateToProps = (state: AppState) => {
  return {
    assetsLoadState: getAssetLoadState(state),
    ...state.mainReducer.game.renderer
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  Renderer
);
