import { Controller, POST, PUT, DELETE, GET, PATCH } from 'digjoy';

import { Roles } from '../../constants/Roles';
import { updateUser, deleteUser, updatePassword, loginUser, createNewUserWithLogin } from '../../business/user';
import { listApartments } from '../../business/apartment';
import {
  IUserCreate,
  UserCreateValidator,
  UserUpdateValidator,
  IUserUpdate,
  UserDeleteValidator,
  IUserDelete,
  UpdatePasswordValidator,
  IUpdatePassword,
  IUserLogin,
  UserLoginValidator,
  ListAvailableApartmentsValidator,
  IListAvailableApartments,
} from './UserValidators';

@Controller('/user')
export default class UserController {
  @POST('/', UserCreateValidator)
  public createUser(user: IUserCreate) {
    return createNewUserWithLogin({ ...user, role: Roles.Client });
  }

  @PUT('/', UserUpdateValidator)
  public updateUser(params: IUserUpdate) {
    return updateUser(params.id, params);
  }

  @DELETE('/', UserDeleteValidator)
  public deleteUser({ id }: IUserDelete) {
    return deleteUser(id);
  }

  @PATCH('/password', UpdatePasswordValidator)
  public updatePassword({ id, newPassword, oldPassword }: IUpdatePassword) {
    return updatePassword(id, oldPassword, newPassword);
  }

  @POST('/login', UserLoginValidator)
  login({ email, password }: IUserLogin) {
    return loginUser(email, password);
  }

  @GET('/apartments', ListAvailableApartmentsValidator)
  listAvailableApartments(filter: IListAvailableApartments) {
    return listApartments({ available: true, ...filter });
  }
}
