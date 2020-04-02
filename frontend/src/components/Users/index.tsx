import React, { useEffect, useState } from "react";
import { Card, Item, List, Loader } from "semantic-ui-react";

import "./Users.css";
import {
  connect,
  MapStateToProps,
  MapDispatchToPropsNonObject
} from "react-redux";
import { IUser } from "../../types/user";
import { GlobalState } from "../../state";
import {
  adminListUsersAction,
  adminUpdateUserAction,
  adminDeleteUserAction
} from "../../state/admins/actions";
import { Roles } from "../../constants/Roles";
import UserForm from "../UserForm";

const Users = ({
  deleteUser,
  editUser,
  listUsers,
  loading,
  reload,
  users
}: StateProps & DispatchProps) => {
  const [editing, setEditing] = useState(false);
  const [userToEdit, setUserToEdit] = useState({} as IUser);

  const roleNames = {
    [Roles.Client]: "Client",
    [Roles.Admin]: "Admin",
    [Roles.Realtor]: "Realtor"
  };

  useEffect(() => {
    if (reload) {
      listUsers();
    }
  }, [listUsers, reload]);

  const handleEdit = (user: IUser) => {
    editUser(user);
    setEditing(false);
  };

  return (
    <main className="users">
      <Card fluid>
        <Card.Content>
          {loading ? (
            <Loader inline="centered" />
          ) : editing ? (
            <UserForm
              defaultValues={userToEdit}
              fields={["birth", "email", "name", "password", "phone", "role"]}
              onSubmit={data => handleEdit(data as IUser)}
            />
          ) : (
            <Item.Group>
              {users.map(user => (
                <Item>
                  <Item.Image
                    avatar
                    size="tiny"
                    src="https://picsum.photos/100/100"
                  />
                  <Item.Content>
                    <Item.Header as="a">{user.name}</Item.Header>
                    <List horizontal floated="right">
                      <List.Item
                        className="clickable"
                        onClick={() => {
                          setEditing(true);
                          setUserToEdit(user);
                        }}
                      >
                        <List.Icon name="edit" />
                      </List.Item>
                      <List.Item
                        className="clickable"
                        onClick={() => deleteUser(user.id!)}
                      >
                        <List.Icon name="trash" />
                      </List.Item>
                    </List>
                    <Item.Meta>{`Role: ${
                      roleNames[user.role || Roles.Client]
                    }`}</Item.Meta>
                    <Item.Description>
                      <Item.Extra>{`E-mail: ${user.email}`}</Item.Extra>
                      <Item.Extra>{`Phone: ${user.phone}`}</Item.Extra>
                    </Item.Description>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          )}
        </Card.Content>
      </Card>
    </main>
  );
};

interface StateProps {
  users: IUser[];
  loading: boolean;
  reload: boolean;
}
const mapStateToProps: MapStateToProps<StateProps, {}, GlobalState> = ({
  adminState
}) => {
  return {
    users: adminState.users,
    loading: adminState.loading,
    reload: adminState.reload
  };
};

interface DispatchProps {
  listUsers: () => void;
  editUser: (user: IUser) => void;
  deleteUser: (id: number) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  {}
> = dispatch => {
  return {
    listUsers: () => dispatch(adminListUsersAction()),
    editUser: (user: IUser) => dispatch(adminUpdateUserAction(user)),
    deleteUser: (id: number) => dispatch(adminDeleteUserAction(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
