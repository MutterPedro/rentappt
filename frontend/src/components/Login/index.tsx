import React, { useState } from "react";
import {
  connect,
  MapDispatchToPropsNonObject,
  MapStateToProps
} from "react-redux";
import { useHistory } from "react-router-dom";
import { Card } from "semantic-ui-react";

import UserForm, { Fields } from "../UserForm";
import "./Login.css";
import { userLoginAction, userSignUpAction } from "../../state/users/actions";
import { GlobalState } from "../../state";
import { IUser } from "../../types/user";
import { toast } from "react-toastify";

type LoginProps = DispatchProps & StateProps;
const Login = ({ login, loading, user, errorMessage, signUp }: LoginProps) => {
  const [signin, setSignin] = useState(true);
  const history = useHistory();

  if (user) {
    history.push("/explore");
  }

  const message = errorMessage
    ? { header: "Something went wrong...", content: errorMessage }
    : undefined;

  const handleLogin = ({ email, password }: Fields) => {
    login(email || "", password || "");
  };

  const handleSignUp = (raw: Fields) => {
    if (raw.password !== raw.retypePassword) {
      toast.error("Retyped password doesn't match!");
      return;
    }
    const user: IUser = {
      name: raw.name!,
      email: raw.email!,
      password: raw.password!,
      phone: raw.phone!,
      birth: new Date(raw.birth!)
    };

    signUp(user);
  };

  return (
    <Card>
      <Card.Content>
        {signin ? (
          <UserForm
            onSubmit={handleLogin}
            fields={["email", "password"]}
            loading={loading}
            error={Boolean(errorMessage)}
            message={message}
          />
        ) : (
          <UserForm
            onSubmit={handleSignUp}
            fields={[
              "name",
              "email",
              "phone",
              "birth",
              "password",
              "retypePassword"
            ]}
            loading={loading}
            error={Boolean(errorMessage)}
            message={message}
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
  signUp: (user: IUser) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  any
> = dispatch => {
  return {
    login: (email, password) => dispatch(userLoginAction(email, password)),
    signUp: user => dispatch(userSignUpAction(user))
  };
};

interface StateProps {
  loading?: boolean;
  user: IUser | null;
  errorMessage?: string;
}
const mapStateToProps: MapStateToProps<StateProps, {}, GlobalState> = ({
  userState
}) => ({
  loading: userState.loading,
  user: userState.user,
  errorMessage: userState.errorMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
