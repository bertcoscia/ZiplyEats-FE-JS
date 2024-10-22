import { SET_ADDRESS } from "../actions";

const initialState = {
  address: null
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESS:
      return { ...state, content: action.payload };
    default:
      return state;
  }
};

export default addressReducer;
