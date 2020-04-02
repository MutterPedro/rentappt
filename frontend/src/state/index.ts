import { combineReducers, StateFromReducersMapObject } from "redux";

import userReducer from "./users/reducer";
import realtorReducer from "./realtors/reducer";
import * as userSaga from "./users/sagas";
import * as realtorSaga from "./realtors/sagas";

export const rootReducer = combineReducers({
  userState: userReducer,
  realtorState: realtorReducer
});

export const sagas = [
  ...Object.values(userSaga),
  ...Object.values(realtorSaga)
];

export type GlobalState = StateFromReducersMapObject<{
  userState: typeof userReducer;
  realtorState: typeof realtorReducer;
}>;
