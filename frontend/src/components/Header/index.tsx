import React from "react";
import { connect, MapStateToProps } from "react-redux";
import { Header as SemanticHeader, Icon } from "semantic-ui-react";

import { GlobalState } from "../../state";
import { IUser } from "../../types/user";
import "./Header.css";

interface Props {
  onClickSettings?: () => void;
}
const Header = ({ user, onClickSettings }: { user: IUser | null } & Props) => {
  return user ? (
    <header className="app_header">
      <SemanticHeader as="h2">Rental Appartment</SemanticHeader>
      <SemanticHeader as="h4">
        {user.name}
        <Icon
          name="settings"
          size="mini"
          circular
          className="settings_icon"
          onClick={onClickSettings}
        />
      </SemanticHeader>
    </header>
  ) : (
    <div style={{ display: "none" }} />
  );
};

const mapStateToProps: MapStateToProps<
  { user: IUser | null },
  Props,
  GlobalState
> = ({ userState }) => ({
  user: userState.user
});

export default connect(mapStateToProps)(Header);
