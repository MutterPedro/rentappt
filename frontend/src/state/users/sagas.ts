import { call, put, takeLatest } from "redux-saga/effects";

import { userLogin } from "../../utils/api";
import { UserLogin } from "./actions";
import { CustomAction } from "../../types/action";

function* loginUserWorker(
  action: CustomAction<{ email: string; password: string }>
) {
  try {
    const user = yield call(
      userLogin,
      action.payload.email,
      action.payload.password
    );

    yield put({ type: UserLogin.Success, payload: { user } });
  } catch (e) {
    yield put({
      type: UserLogin.Fail,
      payload: { message: e.data || e.message }
    });
  }
}

export function* loginUserSaga() {
  yield takeLatest(UserLogin.Request, loginUserWorker);
}
