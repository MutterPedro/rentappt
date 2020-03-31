import { CustomAction } from "../../types/action";

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
