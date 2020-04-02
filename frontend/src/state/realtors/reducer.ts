import {
  RealtorCreateApartment,
  RealtorDeleteApartment,
  RealtorListApartments,
  RealtorSetRentApartment,
  RealtorUpdateApartment
} from "./actions";
import { CustomAction } from "../../types/action";
import { IApartment } from "../../types/apartment";

interface State {
  loading: boolean;
  apartments: IApartment[];
  errorMessage?: string;
  reload: boolean;
}
const initialState: State = {
  apartments: [],
  loading: false,
  reload: true
};

export default function realtorReducer(
  state: State = initialState,
  action: Partial<CustomAction<any>> = {}
): State {
  switch (action.type) {
    case RealtorCreateApartment.Request:
    case RealtorDeleteApartment.Request:
    case RealtorUpdateApartment.Request:
    case RealtorSetRentApartment.Request:
      return { ...state, loading: true, errorMessage: "", reload: false };
    case RealtorListApartments.Request:
      return {
        ...state,
        loading: true,
        apartments: [],
        errorMessage: "",
        reload: false
      };
    case RealtorCreateApartment.Success:
    case RealtorDeleteApartment.Success:
    case RealtorUpdateApartment.Success:
    case RealtorSetRentApartment.Success:
      return {
        ...state,
        loading: false,
        errorMessage: "",
        reload: true
      };
    case RealtorListApartments.Success:
      return {
        ...state,
        loading: false,
        apartments: action.payload.apartments,
        reload: false
      };
    case RealtorCreateApartment.Fail:
    case RealtorDeleteApartment.Fail:
    case RealtorUpdateApartment.Fail:
    case RealtorSetRentApartment.Fail:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.message,
        reload: false
      };
    case RealtorListApartments.Fail:
      return {
        ...state,
        apartments: [],
        loading: false,
        errorMessage: action.payload.message,
        reload: false
      };
    default:
      return state;
  }
}
