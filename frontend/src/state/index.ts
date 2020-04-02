import { combineReducers, StateFromReducersMapObject } from "redux";

import userReducer from "./users/reducer";
import realtorReducer from "./realtors/reducer";
import adminReducer from "./admins/reducer";
import * as userSaga from "./users/sagas";
import * as realtorSaga from "./realtors/sagas";
import * as adminSaga from "./admins/sagas";

export const rootReducer = combineReducers({
  userState: userReducer,
  realtorState: realtorReducer,
  adminState: adminReducer
});

export const sagas = [
  ...Object.values(userSaga),
  ...Object.values(realtorSaga),
  ...Object.values(adminSaga)
];

export type GlobalState = StateFromReducersMapObject<{
  userState: typeof userReducer;
  realtorState: typeof realtorReducer;
  adminState: typeof adminReducer;
}>;
