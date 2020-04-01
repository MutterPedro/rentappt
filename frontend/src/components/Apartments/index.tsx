import React, { useEffect, useState } from "react";
import {
  connect,
  MapStateToProps,
  MapDispatchToPropsNonObject
} from "react-redux";
import {
  Item,
  Card,
  List,
  Rating,
  Button,
  Icon,
  Loader
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { IUser } from "../../types/user";
import { IApartment, IApartmentFilter } from "../../types/apartment";
import { GlobalState } from "../../state";
import { userListApartmentsAction } from "../../state/users/actions";
import "./Apartments.css";

const Apartments = ({
  user,
  apartments,
  listApartments,
  loading
}: StateProps & DispatchProps) => {
  const history = useHistory();
  const [filterState, setFilterState] = useState({
    size: 5,
    rooms: 5,
    price: 5
  });

  useEffect(() => {
    if (!user) {
      history.push("/");
    }

    listApartments();
  }, [user, history, listApartments]);

  const applyFilters = () => {
    const filter = {
      size: filterState.size < 5 ? filterState.size * 100 : undefined,
      rooms: filterState.rooms < 5 ? filterState.rooms : undefined,
      price: filterState.price < 5 ? filterState.price * 100 : undefined
    };

    listApartments(filter);
  };

  return (
    <main className="apartments">
      <Card fluid>
        <Card.Header>
          <List horizontal size="medium" className="filters">
            <List.Header as="h4">Filters:</List.Header>
            <List.Item>
              <List.Content>Size</List.Content>
              <Rating
                disabled={loading}
                icon="star"
                defaultRating={5}
                maxRating={5}
                onRate={(_evt, { rating }) =>
                  setFilterState(prev => ({ ...prev, size: Number(rating) }))
                }
              />
            </List.Item>
            <List.Item>
              <List.Content>Rooms</List.Content>
              <Rating
                disabled={loading}
                icon="star"
                defaultRating={5}
                maxRating={5}
                onRate={(_evt, { rating }) =>
                  setFilterState(prev => ({ ...prev, rooms: Number(rating) }))
                }
              />
            </List.Item>
            <List.Item>
              <List.Content>Rent Price</List.Content>
              <Rating
                disabled={loading}
                icon="star"
                defaultRating={5}
                maxRating={5}
                onRate={(_evt, { rating }) =>
                  setFilterState(prev => ({ ...prev, price: Number(rating) }))
                }
              />
            </List.Item>
            <List.Item>
              <Button
                icon
                basic
                color="blue"
                floated="right"
                onClick={applyFilters}
              >
                <Icon name="filter" />
              </Button>
            </List.Item>
          </List>
        </Card.Header>
        {loading ? (
          <Loader inline="centered" />
        ) : (
          <Card.Content>
            <Item.Group divided>
              {apartments.map(ap => (
                <Item key={ap.id}>
                  <Item.Image rounded src="https://picsum.photos/100/100" />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="a">{ap.name}</Item.Header>
                    <Item.Meta>{ap.description}</Item.Meta>
                    <Item.Description>
                      <Item.Extra>{`Size: ${ap.floorAreaSize}m²`}</Item.Extra>
                      <Item.Extra>{`Rooms: ${ap.rooms}`}</Item.Extra>
                      <Item.Extra as="strong">{`Rent Price: ${ap.rentPrice}$`}</Item.Extra>
                    </Item.Description>
                    <Item.Extra>{`Realtor: ${ap.realtor?.name} - ${ap.realtor?.phone}`}</Item.Extra>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          </Card.Content>
        )}
      </Card>
    </main>
  );
};

interface StateProps {
  user: IUser | null;
  apartments: IApartment[];
  loading: boolean;
}
const mapStateToProps: MapStateToProps<StateProps, {}, GlobalState> = ({
  userState
}) => ({
  user: userState.user,
  apartments: userState.apartments,
  loading: userState.loading
});

interface DispatchProps {
  listApartments: (filter?: IApartmentFilter) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  any
> = dispatch => {
  return {
    listApartments: (filter?: IApartmentFilter) =>
      dispatch(userListApartmentsAction(filter))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Apartments);
