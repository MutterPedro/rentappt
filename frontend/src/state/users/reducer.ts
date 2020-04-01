import { UserLogin, UserSignUp, UserListApartments } from "./actions";
import { IUser } from "../../types/user";
import { CustomAction } from "../../types/action";
import { IApartment } from "../../types/apartment";
import { getUserSession } from "../../utils/session";

interface State {
  loading: boolean;
  user: IUser | null;
  apartments: IApartment[];
  errorMessage?: string;
}
const initialState: State = {
  user: getUserSession(),
  apartments: [],
  loading: false
};

export default function userReducer(
  state: State = initialState,
  action: Partial<CustomAction<any>> = {}
): State {
  switch (action.type) {
    case UserSignUp.Request:
    case UserLogin.Request:
      return { ...state, user: null, loading: true, errorMessage: "" };
    case UserListApartments.Request:
      return { ...state, loading: true, apartments: [], errorMessage: "" };
    case UserSignUp.Success:
    case UserLogin.Success:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        errorMessage: ""
      };
    case UserListApartments.Success:
      return {
        ...state,
        loading: false,
        apartments: action.payload.apartments
      };
    case UserSignUp.Fail:
    case UserLogin.Fail:
      return {
        ...state,
        user: null,
        loading: false,
        errorMessage: action.payload.message
      };
    case UserListApartments.Fail:
      return {
        ...state,
        apartments: [],
        loading: false,
        errorMessage: action.payload.message
      };
    default:
      return state;
  }
}
