import { Controller, GET, POST, PUT, DELETE, PATCH } from 'digjoy';

import authorization from '../../middlewares/authorization';
import { Roles } from '../../constants/Roles';
import { listApartments, createNewApartment, updateApartment, deleteApartment } from '../../business/apartment';
import { SESSION } from '../../middlewares/authorization';
import {
  ListAvailableApartmentsValidator,
  IListAvailableApartments,
  IApartmentCreate,
  ApartmentCreateValidator,
  IApartmentUpdate,
  ApartmentUpdateValidator,
  IApartmentDelete,
  ApartmentDeleteValidator,
  IApartmentRent,
  ApartmentRentValidator,
} from './RealtorValidators';

@Controller('/realtor', authorization(Roles.Realtor))
export default class RealtorController {
  @GET('/apartments', ListAvailableApartmentsValidator)
  public listApartments(filter: IListAvailableApartments) {
    return listApartments(filter);
  }

  @POST('/apartment', ApartmentCreateValidator)
  public createApartment(data: IApartmentCreate) {
    return createNewApartment({ ...data, realtorId: data[SESSION], available: true });
  }

  @PUT('/apartment', ApartmentUpdateValidator)
  public updateApartment({ id, ...params }: IApartmentUpdate) {
    return updateApartment(id, params);
  }

  @DELETE('/apartment', ApartmentDeleteValidator)
  public deleteApartment({ id }: IApartmentDelete) {
    return deleteApartment(id);
  }

  @PATCH('/rent', ApartmentRentValidator)
  public setApartmentAsRent({ id, available }: IApartmentRent) {
    return updateApartment(id, { available });
  }
}
