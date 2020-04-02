import {
  AdminCreateUser,
  AdminDeleteUser,
  AdminListUsers,
  AdminUpdateUser
} from "./actions";
import { CustomAction } from "../../types/action";
import { IUser } from "../../types/user";

interface State {
  loading: boolean;
  users: IUser[];
  errorMessage?: string;
  reload: boolean;
}
const initialState: State = {
  users: [],
  loading: false,
  reload: true
};

export default function realtorReducer(
  state: State = initialState,
  action: Partial<CustomAction<any>> = {}
): State {
  switch (action.type) {
    case AdminCreateUser.Request:
    case AdminDeleteUser.Request:
    case AdminUpdateUser.Request:
      return { ...state, loading: true, errorMessage: "", reload: false };
    case AdminListUsers.Request:
      return {
        ...state,
        loading: true,
        users: [],
        errorMessage: "",
        reload: false
      };
    case AdminCreateUser.Success:
    case AdminDeleteUser.Success:
    case AdminUpdateUser.Success:
      return {
        ...state,
        loading: false,
        errorMessage: "",
        reload: true
      };
    case AdminListUsers.Success:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        reload: false
      };
    case AdminCreateUser.Fail:
    case AdminDeleteUser.Fail:
    case AdminUpdateUser.Fail:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.message,
        reload: false
      };
    case AdminListUsers.Fail:
      return {
        ...state,
        users: [],
        loading: false,
        errorMessage: action.payload.message,
        reload: false
      };
    default:
      return state;
  }
}
