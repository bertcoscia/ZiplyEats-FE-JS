import { GET_PROFILE, RESET_PROFILE } from "../actions";

const initialState = {
  content: null
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        content: action.payload
      };
    case RESET_PROFILE:
      return {
        ...state,
        content: null
      };
    default:
      return state;
  }
};

export default profileReducer;
