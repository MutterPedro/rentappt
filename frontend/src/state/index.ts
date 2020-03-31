import { combineReducers, StateFromReducersMapObject } from "redux";

import userReducer from "./users/reducer";
import * as userSaga from "./users/sagas";

export const rootReducer = combineReducers({
  userState: userReducer
});

export const sagas = Object.values(userSaga);

export type GlobalState = StateFromReducersMapObject<{
  userState: typeof userReducer;
}>;
