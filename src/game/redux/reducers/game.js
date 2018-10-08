import {
  GAME_LOAD,
  GAME_START,
  GAME_END,
  RESTART,
  SHOOT,
  DESTROY,
  HIT,
  TOGGLE_PAUSE,
  CAMERA_CHANGE,
  CHANGE_LEVEL
} from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case GAME_LOAD:
      return state;
    case GAME_START:
      return state;
    case GAME_END:
      return state;
    case RESTART:
      return state;
    case SHOOT:
      return state;
    case DESTROY:
      return state;
    case HIT:
      return state;
    case TOGGLE_PAUSE:
      return state;
    case CAMERA_CHANGE:
      return state;
    case CHANGE_LEVEL:
      return state;
    default:
      return state;
  }
};
