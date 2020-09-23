import {connect} from "react-redux";
import {Renderer} from "./Renderer";

const getAssetLoadState = state => {
    return state.mainReducer.game.assetsLoadState;
};

const mapStateToProps = (state, ownProps) => {
    return {
        assetsLoadState: getAssetLoadState(state),
        ...state.mainReducer.game.renderer
    };
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(
    Renderer
);
