import React from "react";
import { Card } from "semantic-ui-react";
import {
  connect,
  MapStateToProps,
  MapDispatchToPropsNonObject
} from "react-redux";

import UserForm from "../UserForm";
import "./NewUser.css";
import { GlobalState } from "../../state";
import { IUser } from "../../types/user";
import { adminCreateUserAction } from "../../state/admins/actions";

const NewUser = ({
  loading,
  errorMessage,
  createUser
}: StateProps & DispatchProps) => {
  const message = errorMessage
    ? { header: "Something went wrong...", content: errorMessage }
    : undefined;

  return (
    <Card className="new_user">
      <Card.Content>
        <UserForm
          onSubmit={data => createUser(data as IUser)}
          loading={loading}
          error={Boolean(errorMessage)}
          message={message}
          fields={["birth", "email", "name", "password", "phone", "role"]}
        />
      </Card.Content>
    </Card>
  );
};

interface StateProps {
  loading: boolean;
  errorMessage?: string;
}
const mapStateToProps: MapStateToProps<StateProps, {}, GlobalState> = ({
  adminState
}) => ({
  loading: adminState.loading,
  errorMessage: adminState.errorMessage
});

interface DispatchProps {
  createUser: (user: IUser) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  {}
> = dispatch => {
  return {
    createUser: (user: IUser) => dispatch(adminCreateUserAction(user))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
