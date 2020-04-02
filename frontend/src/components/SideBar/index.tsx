import React from "react";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import "./SideBar.css";
import { connect, MapStateToProps } from "react-redux";
import { IUser } from "../../types/user";
import { GlobalState } from "../../state";
import { Roles } from "../../constants/Roles";

interface Props {
  visible: boolean;
}
const SideBar = ({ visible, user }: Props & { user: IUser | null }) => {
  return (
    <Sidebar
      as={Menu}
      animation="push"
      direction="right"
      visible={visible}
      className="custom_sidebar"
      icon="labeled"
      inverted
      vertical
      width="thin"
    >
      <Menu.Item as={Link} to="/explore">
        <Icon name="home" />
        Apartments
      </Menu.Item>
      {user?.role && user.role >= Roles.Realtor && (
        <Menu.Item as={Link} to="/newApartment">
          <Icon name="plus square" />
          New Apartment
        </Menu.Item>
      )}
      {user?.role && user.role >= Roles.Admin && (
        <Menu.Item as={Link} to="/newUser">
          <Icon name="plus circle" />
          New User
        </Menu.Item>
      )}
    </Sidebar>
  );
};

const mapStateToProps: MapStateToProps<
  { user: IUser | null },
  Props,
  GlobalState
> = ({ userState }) => ({
  user: userState.user
});

export default connect(mapStateToProps)(React.memo(SideBar));
