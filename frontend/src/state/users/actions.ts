import { CustomAction } from "../../types/action";
import { IUser } from "../../types/user";
import { IApartmentFilter } from "../../types/apartment";

export enum UserLogin {
  Request = "USER_LOGIN_REQUEST",
  Success = "USER_LOGIN_SUCCESS",
  Fail = "USER_LOGIN_FAIL"
}

export function userLoginAction(
  email: string,
  password: string
): CustomAction<{ email: string; password: string }> {
  return {
    type: UserLogin.Request,
    payload: { email, password }
  };
}

export enum UserSignUp {
  Request = "USER_SIGNUP_REQUEST",
  Success = "USER_SIGNUP_SUCCESS",
  Fail = "USER_SIGNUP_FAIL"
}

export function userSignUpAction(user: IUser): CustomAction<IUser> {
  return {
    type: UserSignUp.Request,
    payload: user
  };
}

export enum UserListApartments {
  Request = "USER_LIST_APARTMENTS_REQUEST",
  Success = "USER_LIST_APARTMENTS_SUCCESS",
  Fail = "USER _LIST_APARTMENTS_FAIL"
}

export function userListApartmentsAction(
  filters: IApartmentFilter = {}
): CustomAction<IApartmentFilter> {
  return {
    type: UserListApartments.Request,
    payload: filters
  };
}
