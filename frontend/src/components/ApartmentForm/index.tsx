import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
//@ts-ignore
import geocode from "react-geocode";

import { GOOGLE_GEOCODE_KEY } from "../../utils/environment";
import debounce from "../../utils/debounce";
import "./ApartmentForm.css";

geocode.setApiKey(GOOGLE_GEOCODE_KEY);

export interface Fields {
  name: string;
  description: string;
  floorAreaSize: number;
  rentPrice: number;
  rooms: number;
  latitude: number;
  longitude: number;
}

interface ApartmentFormProps {
  defaultValues?: Fields;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  message?: { header: string; content: string };
  onSubmit: (data: Partial<Fields>) => void;
  children?: React.ReactChildren;
}

const ApartmentForm = ({
  onSubmit,
  loading,
  success,
  error,
  message,
  defaultValues,
  children
}: ApartmentFormProps) => {
  const [state, setState] = useState<Partial<Fields>>(defaultValues || {});

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    field: keyof Fields
  ) => {
    evt.persist();
    setState(prevState => ({ ...prevState, [field]: evt.target.value }));
  };

  const handleGeocode = debounce(async (address: string) => {
    try {
      const response = await geocode.fromAddress(address);
      const { lat, lng } = response.results[0].geometry.location;

      setState(prevState => ({ ...prevState, latitude: lat, longitude: lng }));
    } catch (e) {
      console.error(e);
    }
  }, 1000);

  return (
    <Form
      className="aptForm"
      onSubmit={() => onSubmit(state)}
      loading={loading}
      success={success}
      error={error}
    >
      <Form.Field>
        <label>Name</label>
        <input
          placeholder="Name"
          onChange={evt => handleChange(evt, "name")}
          defaultValue={defaultValues?.name}
        />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <textarea
          placeholder="Description"
          onChange={(evt: any) => handleChange(evt, "description")}
          defaultValue={defaultValues?.description}
        />
      </Form.Field>
      <Form.Field>
        <label>Floor Area Size</label>
        <input
          type="number"
          onChange={evt => handleChange(evt, "floorAreaSize")}
          defaultValue={defaultValues?.floorAreaSize}
        />
      </Form.Field>
      <Form.Field>
        <label>Rooms</label>
        <input
          type="number"
          onChange={evt => handleChange(evt, "rooms")}
          defaultValue={defaultValues?.rooms}
        />
      </Form.Field>
      <Form.Field>
        <label>Rent Price</label>
        <input
          type="number"
          onChange={evt => handleChange(evt, "rentPrice")}
          defaultValue={defaultValues?.rentPrice}
        />
      </Form.Field>
      <Form.Field>
        <label>Latitude</label>
        <input
          type="number"
          onChange={evt => handleChange(evt, "latitude")}
          value={state.latitude}
        />
      </Form.Field>
      <Form.Field>
        <label>Longitude</label>
        <input
          type="number"
          onChange={evt => handleChange(evt, "longitude")}
          value={state.longitude}
        />
      </Form.Field>
      <Form.Field>
        <label>Address</label>
        <input
          placeholder="Address"
          onChange={evt => handleGeocode(evt.target.value)}
        />
      </Form.Field>
      {children}
      {message && (
        <Message
          error={error}
          success={success}
          header={message?.header}
          content={message?.content}
        />
      )}
      <Button type="submit" primary>
        Submit
      </Button>
    </Form>
  );
};

export default ApartmentForm;
