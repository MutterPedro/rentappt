import React, { useEffect, useState } from "react";
import {
  connect,
  MapStateToProps,
  MapDispatchToPropsNonObject
} from "react-redux";
import { Card, Loader, Radio } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { IUser } from "../../types/user";
import { IApartment, IApartmentFilter } from "../../types/apartment";
import { GlobalState } from "../../state";
import { userListApartmentsAction } from "../../state/users/actions";
import "./Apartments.css";
import Filters from "./Filters";
import ApartmentsList from "./ApartmentsList";
import ApartmentsMap from "./ApartmentsMap";
import { Roles } from "../../constants/Roles";
import {
  realtorListApartmentsAction,
  realtorDeleteApartmentAction,
  realtorUpdateApartmentAction,
  realtorSetRentApartmentsAction
} from "../../state/realtors/actions";

const Apartments = ({
  user,
  apartments,
  listApartments,
  editApartment,
  deleteApartment,
  rentApartment,
  loading,
  reload
}: StateProps & DispatchProps) => {
  const history = useHistory();
  const [filterState, setFilterState] = useState({
    size: 5,
    rooms: 5,
    price: 5
  });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!user) {
      history.push("/");
    }

    if (reload) {
      listApartments({}, user?.role);
    }
  }, [user, history, listApartments, reload]);

  const applyFilters = () => {
    const filter = {
      size: filterState.size < 5 ? filterState.size * 100 : undefined,
      rooms: filterState.rooms < 5 ? filterState.rooms : undefined,
      price: filterState.price < 5 ? filterState.price * 100 : undefined
    };

    listApartments(filter, user?.role);
  };

  return (
    <main className="apartments">
      <Card fluid>
        <Card.Header>
          <Filters
            loading={loading}
            applyFilters={applyFilters}
            onRate={(name, rate) =>
              setFilterState(prev => ({ ...prev, [name]: rate }))
            }
          />
        </Card.Header>
        <Card.Content>
          {loading ? (
            <Loader inline="centered" />
          ) : (
            <>
              <Radio
                toggle
                label="Map"
                checked={showMap}
                onChange={() => setShowMap(!showMap)}
              />
              {showMap ? (
                <ApartmentsMap apartments={apartments} />
              ) : (
                <ApartmentsList
                  apartments={apartments}
                  user={user}
                  edit={editApartment}
                  remove={deleteApartment}
                  rent={rentApartment}
                />
              )}
            </>
          )}
        </Card.Content>
      </Card>
    </main>
  );
};

interface StateProps {
  user: IUser | null;
  apartments: IApartment[];
  loading: boolean;
  reload: boolean;
}
const mapStateToProps: MapStateToProps<StateProps, {}, GlobalState> = ({
  userState,
  realtorState
}) => {
  const state =
    (userState?.user?.role || Roles.Client) >= Roles.Realtor
      ? realtorState
      : userState;
  return {
    user: userState.user,
    apartments: state.apartments,
    loading: state.loading,
    reload: realtorState.reload
  };
};

interface DispatchProps {
  listApartments: (filter?: IApartmentFilter, role?: Roles) => void;
  editApartment: (ap: IApartment) => void;
  deleteApartment: (id: number) => void;
  rentApartment: (id: number) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  {}
> = dispatch => {
  return {
    listApartments: (filter?: IApartmentFilter, role: Roles = Roles.Client) =>
      role >= Roles.Realtor
        ? dispatch(realtorListApartmentsAction(filter))
        : dispatch(userListApartmentsAction(filter)),
    deleteApartment: (id: number) => dispatch(realtorDeleteApartmentAction(id)),
    editApartment: (ap: IApartment) =>
      dispatch(realtorUpdateApartmentAction(ap)),
    rentApartment: (id: number) => dispatch(realtorSetRentApartmentsAction(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Apartments);
