import React, { useState } from "react";
import {
  connect,
  MapDispatchToPropsNonObject,
  MapStateToProps
} from "react-redux";
import { Card } from "semantic-ui-react";

import UserForm from "../UserForm";
import "./Login.css";
import { userLoginAction } from "../../state/users/actions";
import { GlobalState } from "../../state";

type LoginProps = DispatchProps & StateProps;
const Login = ({ login, loading }: LoginProps) => {
  const [signin, setSignin] = useState(true);

  return (
    <Card>
      <Card.Content>
        {signin ? (
          <UserForm
            onSubmit={({ email, password }) =>
              login(email || "", password || "")
            }
            fields={["email", "password"]}
            loading={loading}
          />
        ) : (
          <UserForm
            onSubmit={console.log}
            fields={[
              "name",
              "email",
              "phone",
              "birth",
              "password",
              "retypePassword"
            ]}
            loading={loading}
          />
        )}

        <br />
        {signin ? (
          <p className="changeForm" onClick={() => setSignin(false)}>
            Sign Up
          </p>
        ) : (
          <p className="changeForm" onClick={() => setSignin(true)}>
            Sign In
          </p>
        )}
      </Card.Content>
    </Card>
  );
};

interface DispatchProps {
  login: (email: string, password: string) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  any
> = dispatch => {
  return {
    login: (email, password) => dispatch(userLoginAction(email, password))
  };
};

interface StateProps {
  loading?: boolean;
}
const mapStateToProps: MapStateToProps<StateProps, StateProps, GlobalState> = ({
  userState
}) => ({
  loading: userState.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Login));
