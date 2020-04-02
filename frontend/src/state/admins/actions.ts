import { CustomAction } from "../../types/action";
import { IUser } from "../../types/user";

export enum AdminCreateUser {
  Request = "ADMIN_CREATE_USER_REQUEST",
  Success = "ADMIN_CREATE_USER_SUCCESS",
  Fail = "ADMIN_CREATE_USER_FAIL"
}

export function adminCreateUserAction(user: IUser): CustomAction<IUser> {
  return {
    type: AdminCreateUser.Request,
    payload: user
  };
}

export enum AdminUpdateUser {
  Request = "ADMIN_UPDATE_USER_REQUEST",
  Success = "ADMIN_UPDATE_USER_SUCCESS",
  Fail = "ADMIN_UPDATE_USER_FAIL"
}

export function adminUpdateUserAction(user: IUser): CustomAction<IUser> {
  return {
    type: AdminUpdateUser.Request,
    payload: user
  };
}

export enum AdminListUsers {
  Request = "ADMIN_LIST_USERS_REQUEST",
  Success = "ADMIN_LIST_USERS_SUCCESS",
  Fail = "ADMIN_LIST_USERS_FAIL"
}

export function adminListUsersAction(): CustomAction<null> {
  return {
    type: AdminListUsers.Request,
    payload: null
  };
}

export enum AdminDeleteUser {
  Request = "ADMIN_DELETE_USER_REQUEST",
  Success = "ADMIN_DELETE_USER_SUCCESS",
  Fail = "ADMIN_DELETE_USER_FAIL"
}

export function adminDeleteUserAction(
  id: number
): CustomAction<{ id: number }> {
  return {
    type: AdminDeleteUser.Request,
    payload: { id }
  };
}
