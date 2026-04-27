import { Button, Form } from "react-bootstrap";
import { useState } from "react";
// import { FaSpinner } from "react-icons/all";

function UsernameLoginForm({ onFormSubmit, disabled }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type={"text"}
            placeholder={"Username"}
            name={"username"}
            value={formData.username}
            onChange={handleChange}
            disabled={disabled}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={"password"}
            placeholder={"Password"}
            name={"password"}
            value={formData.password}
            onChange={handleChange}
            disabled={disabled}
          />
        </Form.Group>
        <Form.Group>
          <Button
            variant="primary"
            type="submit"
            className={"float-end"}
            onClick={(e) => {
              e.preventDefault();
              onFormSubmit(formData);
            }}
          >
            {!disabled && "Submit"}
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default UsernameLoginForm;
