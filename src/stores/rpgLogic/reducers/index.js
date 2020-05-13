import {initialScene} from "../../initialSceneSolid";

export const mainReducer = (state = initialScene, action) => {
    let _oldAssetLoadState;
    let temp = {};
    let assetsLoadState;
    const {gameObjectId, transform, parentId, instantiationTime} = action;
    switch (action.type) {
        case "UPDATE_GAME_PARAMETERS":
            return {
                ...state,
                game: {
                    ...state.game,
                    ...action.parametersObject
                }
            };
    }
}