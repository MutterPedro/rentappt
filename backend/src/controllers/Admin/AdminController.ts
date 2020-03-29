import { Controller, POST, PUT, DELETE, GET } from 'digjoy';

import authorization from '../../middlewares/authorization';
import { Roles } from '../../constants/Roles';
import { createNewUser, updateUser, deleteUser, listUser } from '../../business/user';
import {
  UserCreateValidator,
  IUserCreate,
  UserUpdateValidator,
  IUserUpdate,
  UserDeleteValidator,
  IUserDelete,
  UserListValidator,
  IUserList,
} from './AdminValidators';

@Controller('/admin', authorization(Roles.Admin))
export default class AdminController {
  @POST('/user', UserCreateValidator)
  public createUser(params: IUserCreate) {
    return createNewUser(params);
  }

  @PUT('/user', UserUpdateValidator)
  public updateUser({ id, ...params }: IUserUpdate) {
    return updateUser(id, params);
  }

  @DELETE('/user', UserDeleteValidator)
  public deleteUser({ id }: IUserDelete) {
    return deleteUser(id);
  }

  @GET('/users', UserListValidator)
  public listUsers(filter: IUserList) {
    return listUser(filter);
  }
}
