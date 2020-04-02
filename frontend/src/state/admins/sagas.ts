import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";

import { CustomAction } from "../../types/action";
import {
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} from "../../utils/api";
import {
  AdminListUsers,
  AdminCreateUser,
  AdminUpdateUser,
  AdminDeleteUser
} from "./actions";
import { IUser } from "../../types/user";

function* listUsersWorker() {
  try {
    const users = yield call(adminListUsers);

    yield put({ type: AdminListUsers.Success, payload: { users } });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: AdminListUsers.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* listUsersSaga() {
  yield takeLatest(AdminListUsers.Request, listUsersWorker);
}

function* createUserWorker(action: CustomAction<IUser>) {
  try {
    yield call(adminCreateUser, action.payload);

    toast.success("User created successfully!");
    yield put({ type: AdminCreateUser.Success });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: AdminCreateUser.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* createUserSaga() {
  yield takeLatest(AdminCreateUser.Request, createUserWorker);
}

function* updateUserWorker(action: CustomAction<IUser>) {
  try {
    yield call(adminUpdateUser, action.payload);

    toast.success("User updated successfully!");
    yield put({ type: AdminUpdateUser.Success });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: AdminUpdateUser.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* updateUserSaga() {
  yield takeLatest(AdminUpdateUser.Request, updateUserWorker);
}

function* deleteUserWorker(action: CustomAction<{ id: number }>) {
  try {
    yield call(adminDeleteUser, action.payload.id);

    toast.success("User deleted successfully!");
    yield put({ type: AdminDeleteUser.Success });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: AdminDeleteUser.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* deleteUserSaga() {
  yield takeLatest(AdminDeleteUser.Request, deleteUserWorker);
}
