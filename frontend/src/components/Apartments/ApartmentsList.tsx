import React, { useState } from "react";
import { Item, List } from "semantic-ui-react";

import { IApartment } from "../../types/apartment";
import { IUser } from "../../types/user";
import { Roles } from "../../constants/Roles";
import ApartmentForm from "../ApartmentForm";

interface Props {
  apartments: IApartment[];
  user: IUser | null;
  edit: (ap: IApartment) => void;
  remove: (id: number) => void;
  rent: (id: number) => void;
}

const ApartmentsList = ({ apartments, user, edit, remove, rent }: Props) => {
  const [editing, setEditing] = useState(false);
  const [ap, setApToEdit] = useState({} as IApartment);

  const handleEdit = (ap: IApartment) => {
    edit(ap);
    setEditing(false);
  };

  return editing ? (
    <ApartmentForm
      onSubmit={data => handleEdit(data as IApartment)}
      defaultValues={ap}
    />
  ) : (
    <Item.Group divided>
      {apartments.map(ap => (
        <Item key={ap.id}>
          <Item.Image rounded src="https://picsum.photos/100/100" />
          <Item.Content verticalAlign="middle">
            <Item.Header as="a">{ap.name}</Item.Header>
            {(user?.role || Roles.Client) >= Roles.Realtor && (
              <List horizontal floated="right">
                <List.Item className="clickable" onClick={() => rent(ap.id!)}>
                  <List.Icon name="check" />
                </List.Item>
                <List.Item
                  className="clickable"
                  onClick={() => {
                    setEditing(true);
                    setApToEdit(ap);
                  }}
                >
                  <List.Icon name="edit" />
                </List.Item>
                <List.Item className="clickable" onClick={() => remove(ap.id!)}>
                  <List.Icon name="trash" />
                </List.Item>
              </List>
            )}
            <Item.Meta>{ap.description}</Item.Meta>
            <Item.Description>
              <Item.Extra>{`Size: ${ap.floorAreaSize}m²`}</Item.Extra>
              <Item.Extra>{`Rooms: ${ap.rooms}`}</Item.Extra>
              <Item.Extra>{`Available: ${ap.available}`}</Item.Extra>
              <Item.Extra as="strong">{`Rent Price: ${ap.rentPrice}$`}</Item.Extra>
            </Item.Description>
            <Item.Extra>{`Realtor: ${ap.realtor?.name} - ${ap.realtor?.phone}`}</Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );
};

export default React.memo(ApartmentsList);
