import { IApartment, IApartmentFilter } from "../../types/apartment";
import { CustomAction } from "../../types/action";

export enum RealtorCreateApartment {
  Request = "REALTOR_CREATE_APARTMENT_REQUEST",
  Success = "REALTOR_CREATE_APARTMENT_SUCCESS",
  Fail = "REALTOR_CREATE_APARTMENT_FAIL"
}

export function realtorCreateApartmentAction(
  ap: IApartment
): CustomAction<IApartment> {
  return {
    type: RealtorCreateApartment.Request,
    payload: ap
  };
}

export enum RealtorUpdateApartment {
  Request = "REALTOR_UPDATE_APARTMENT_REQUEST",
  Success = "REALTOR_UPDATE_APARTMENT_SUCCESS",
  Fail = "REALTOR_UPDATE_APARTMENT_FAIL"
}

export function realtorUpdateApartmentAction(
  ap: Partial<IApartment>
): CustomAction<Partial<IApartment>> {
  return {
    type: RealtorUpdateApartment.Request,
    payload: ap
  };
}

export enum RealtorDeleteApartment {
  Request = "REALTOR_DELETE_APARTMENT_REQUEST",
  Success = "REALTOR_DELETE_APARTMENT_SUCCESS",
  Fail = "REALTOR_DELETE_APARTMENT_FAIL"
}

export function realtorDeleteApartmentAction(
  id: number
): CustomAction<{ id: number }> {
  return {
    type: RealtorDeleteApartment.Request,
    payload: { id }
  };
}

export enum RealtorListApartments {
  Request = "REALTOR_LIST_APARTMENT_REQUEST",
  Success = "REALTOR_LIST_APARTMENT_SUCCESS",
  Fail = "REALTOR_LIST_APARTMENT_FAIL"
}

export function realtorListApartmentsAction(
  filters: IApartmentFilter = {}
): CustomAction<IApartmentFilter> {
  return {
    type: RealtorListApartments.Request,
    payload: filters
  };
}

export enum RealtorSetRentApartment {
  Request = "REALTOR_SET_RENT_APARTMENT_REQUEST",
  Success = "REALTOR_SET_RENT_APARTMENT_SUCCESS",
  Fail = "REALTOR_SET_RENT_APARTMENT_FAIL"
}

export function realtorSetRentApartmentsAction(
  id: number
): CustomAction<{ id: number }> {
  return {
    type: RealtorSetRentApartment.Request,
    payload: { id }
  };
}
