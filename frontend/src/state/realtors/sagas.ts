import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";

import { CustomAction } from "../../types/action";
import { IApartmentFilter, IApartment } from "../../types/apartment";
import {
  userListApartment,
  realtorCreateApartment,
  realtorDeleteApartment,
  realtorSetApartmentAsRent,
  realtorUpdateApartment
} from "../../utils/api";
import {
  RealtorListApartments,
  RealtorCreateApartment,
  RealtorDeleteApartment,
  RealtorSetRentApartment,
  RealtorUpdateApartment
} from "./actions";

function* listApartmentsWorker(action: CustomAction<IApartmentFilter>) {
  try {
    const apartments = yield call(userListApartment, action.payload, "realtor");

    yield put({ type: RealtorListApartments.Success, payload: { apartments } });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: RealtorListApartments.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* listApartmentsSaga() {
  yield takeLatest(RealtorListApartments.Request, listApartmentsWorker);
}

function* createApartmentWorker(action: CustomAction<IApartment>) {
  try {
    const apartment = yield call(realtorCreateApartment, action.payload);

    toast.success(`Apartment created successfully!`);
    yield put({ type: RealtorCreateApartment.Success, payload: { apartment } });
  } catch (e) {
    yield put({
      type: RealtorCreateApartment.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* createApartmentSaga() {
  yield takeLatest(RealtorCreateApartment.Request, createApartmentWorker);
}

function* deleteApartmentWorker(action: CustomAction<{ id: number }>) {
  try {
    yield call(realtorDeleteApartment, action.payload.id);

    toast.success(`Apartment deleted successfully!`);
    yield put({ type: RealtorDeleteApartment.Success });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: RealtorDeleteApartment.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* deleteApartmentSaga() {
  yield takeLatest(RealtorDeleteApartment.Request, deleteApartmentWorker);
}

function* rentApartmentWorker(action: CustomAction<{ id: number }>) {
  try {
    debugger;
    yield call(realtorSetApartmentAsRent, action.payload.id);

    toast.success(`Apartment set as rent successfully!`);
    yield put({ type: RealtorSetRentApartment.Success });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: RealtorSetRentApartment.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* rentApartmentSaga() {
  yield takeLatest(RealtorSetRentApartment.Request, rentApartmentWorker);
}

function* updateApartmentWorker(action: CustomAction<IApartment>) {
  try {
    yield call(realtorUpdateApartment, action.payload);

    toast.success(`Apartment updated successfully!`);
    yield put({ type: RealtorUpdateApartment.Success });
  } catch (e) {
    toast.error(e.response?.data || e.message);
    yield put({
      type: RealtorUpdateApartment.Fail,
      payload: { message: e.response?.data || e.message }
    });
  }
}

export function* updateApartmentSaga() {
  yield takeLatest(RealtorUpdateApartment.Request, updateApartmentWorker);
}
