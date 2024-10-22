import { combineReducers, configureStore } from "@reduxjs/toolkit";
import profileReducer from "../reducers/profileReducer";
import addressReducer from "../reducers/addressReducer";

const rootReducer = combineReducers({
  profile: profileReducer,
  deliveryAddress: addressReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
