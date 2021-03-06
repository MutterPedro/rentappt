import React from "react";
import { Card } from "semantic-ui-react";
import {
  connect,
  MapStateToProps,
  MapDispatchToPropsNonObject
} from "react-redux";

import ApartmentForm from "../ApartmentForm";
import "./NewApartment.css";
import { GlobalState } from "../../state";
import { IApartment } from "../../types/apartment";
import { realtorCreateApartmentAction } from "../../state/realtors/actions";

const NewApartment = ({
  loading,
  errorMessage,
  createApartment
}: StateProps & DispatchProps) => {
  const message = errorMessage
    ? { header: "Something went wrong...", content: errorMessage }
    : undefined;

  return (
    <Card className="new_apt">
      <Card.Content>
        <ApartmentForm
          onSubmit={data => createApartment(data as IApartment)}
          loading={loading}
          error={Boolean(errorMessage)}
          message={message}
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
  realtorState
}) => ({
  loading: realtorState.loading,
  errorMessage: realtorState.errorMessage
});

interface DispatchProps {
  createApartment: (ap: IApartment) => void;
}
const mapDispatchToProps: MapDispatchToPropsNonObject<
  DispatchProps,
  {}
> = dispatch => {
  return {
    createApartment: (ap: IApartment) =>
      dispatch(realtorCreateApartmentAction(ap))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewApartment);
