import React from "react";
import { connect, MapStateToProps } from "react-redux";
import { Header as SemanticHeader, Image } from "semantic-ui-react";

import { GlobalState } from "../../state";
import { IUser } from "../../types/user";
import "./Header.css";

const Header = ({ user }: { user: IUser | null }) => {
  return user ? (
    <header className="app_header">
      <SemanticHeader as="h2">Rental Appartment</SemanticHeader>
      <SemanticHeader as="h4">
        <Image circular src="https://picsum.photos/30/30" /> {user.name}
      </SemanticHeader>
    </header>
  ) : (
    <div style={{ display: "none" }} />
  );
};

const mapStateToProps: MapStateToProps<
  { user: IUser | null },
  {},
  GlobalState
> = ({ userState }) => ({
  user: userState.user
});

export default connect(mapStateToProps)(Header);
