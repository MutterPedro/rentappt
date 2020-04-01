import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";

import { userLogin, userSignUp, userListApartment } from "../../utils/api";
import { UserLogin, UserSignUp, UserListApartments } from "./actions";
import { CustomAction } from "../../types/action";
import { IUser } from "../../types/user";
import { IApartmentFilter } from "../../types/apartment";

function* loginUserWorker(
  action: CustomAction<{ email: string; password: string }>
) {
  try {
    const user = yield call(
      userLogin,
      action.payload.email,
      action.payload.password
    );

    toast.success("Login succeed, welcome!");
    yield put({ type: UserLogin.Success, payload: { user } });
  } catch (e) {
    yield put({
      type: UserLogin.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* loginUserSaga() {
  yield takeLatest(UserLogin.Request, loginUserWorker);
}

function* signUpUserWorker(action: CustomAction<IUser>) {
  try {
    const user = yield call(userSignUp, action.payload);

    toast.success("Sign Up succeed, welcome!");
    yield put({ type: UserSignUp.Success, payload: { user } });
  } catch (e) {
    yield put({
      type: UserSignUp.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* signUpUserSaga() {
  yield takeLatest(UserSignUp.Request, signUpUserWorker);
}

function* listApartmentsWorker(action: CustomAction<IApartmentFilter>) {
  try {
    const apartments = yield call(userListApartment, action.payload);

    yield put({ type: UserListApartments.Success, payload: { apartments } });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: UserListApartments.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* listApartmentsSaga() {
  yield takeLatest(UserListApartments.Request, listApartmentsWorker);
}
