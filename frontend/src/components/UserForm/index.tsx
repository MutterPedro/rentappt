import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";

import { Roles } from "../../constants/Roles";
import "./UserForm.css";

interface Fields {
  name?: string;
  role?: string;
  email?: string;
  password?: string;
  retypePassword?: string;
  birth?: string;
  phone?: string;
}
interface UserFormProps {
  defaultValues?: Fields;
  fields?: (keyof Fields)[];
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  message?: { header: string; content: string };
  onSubmit: (data: Fields) => void;
  children?: React.ReactChildren;
}
const rolesOptions = [
  { key: "Client", value: Roles.Client },
  { key: "Realtor", value: Roles.Realtor },
  { key: "Admin", value: Roles.Admin }
];

const FormExampleForm = ({
  fields,
  onSubmit,
  loading,
  success,
  error,
  message,
  defaultValues,
  children
}: UserFormProps) => {
  const [state, setState] = useState<Fields>({
    name: undefined,
    role: undefined,
    email: undefined,
    password: undefined,
    retypePassword: undefined,
    birth: undefined,
    phone: undefined
  });

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    field: keyof Fields
  ) => {
    evt.persist();
    setState(prevState => ({ ...prevState, [field]: evt.target.value }));
  };

  return (
    <Form
      className="userForm"
      onSubmit={() => onSubmit(state)}
      loading={loading}
      success={success}
      error={error}
    >
      {fields?.includes("name") && (
        <Form.Field>
          <label>Name</label>
          <input
            placeholder="Name"
            name="name"
            onChange={evt => handleChange(evt, "name")}
            defaultValue={defaultValues?.name}
          />
        </Form.Field>
      )}
      {fields?.includes("email") && (
        <Form.Field>
          <label>E-mail</label>
          <input
            placeholder="E-mail"
            type="email"
            onChange={evt => handleChange(evt, "email")}
            defaultValue={defaultValues?.email}
          />
        </Form.Field>
      )}
      {fields?.includes("phone") && (
        <Form.Field>
          <label>Phone</label>
          <input
            placeholder="Phone"
            type="tel"
            onChange={evt => handleChange(evt, "phone")}
            defaultValue={defaultValues?.phone}
          />
        </Form.Field>
      )}
      {fields?.includes("birth") && (
        <Form.Field>
          <label>Birth Date</label>
          <input
            placeholder="Birth Date"
            type="date"
            onChange={evt => handleChange(evt, "birth")}
            defaultValue={defaultValues?.birth}
          />
        </Form.Field>
      )}
      {fields?.includes("role") && (
        <Form.Field
          label="Role"
          control="select"
          onChange={(evt: any) => handleChange(evt, "role")}
          defaultValue={defaultValues?.role}
        >
          {rolesOptions.map(opt => (
            <option value={opt.value} key={opt.key}>
              {opt.key}
            </option>
          ))}
        </Form.Field>
      )}
      {fields?.includes("password") && (
        <Form.Field>
          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            onChange={evt => handleChange(evt, "password")}
          />
        </Form.Field>
      )}
      {fields?.includes("retypePassword") && (
        <Form.Field>
          <label>Retype password</label>
          <input
            placeholder="Retype password"
            type="password"
            onChange={evt => handleChange(evt, "retypePassword")}
          />
        </Form.Field>
      )}
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

export default FormExampleForm;
