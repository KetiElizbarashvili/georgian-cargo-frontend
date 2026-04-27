import React, { useState, useContext } from "react";
import { ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import useValidation from "hooks/useValidation";
import SpinnerButton from "utils/SpinnerButton";
import forgotPassword from "requests/forgotPassword.js";
import { AuthContext } from "context";
// import { usernameLoginFormValidations } from "./UsernameLoginFormValidations";
import { history } from "components/History";
import { toast } from "react-toastify";

const ForgotPasswordForm = ({ admin }) => {
  const [email, setEmail] = useState({ email: "" });
  const [submit, isLoggingIn] = useRequest(forgotPassword);
  // const { errors, validate, addErrors } = useValidation(
  //   usernameLoginFormValidations
  // );
  const { auth, setAuth } = useContext(AuthContext);
  const onChangeHandler = ({ target: { name, value } }) => {
    const newEmail = { ...email, [name]: value };
    setEmail(newEmail);
    // validate(newUser, name).catch((e) => {});
  };
  //
  const OnSubmitHandler = (e) => {
    e.preventDefault();
    submit({ ...email, remember_token: true })
      .then((response) => {
        toast.success(
          "If we have email in the database, we will send you link"
        );
        history.push("/home");
        //window.location.reload();
      })
      .catch((e) => {
        console.log(e);
        // if (e.response.status === 401) {
        //   const errors = {
        //     email: "Invalid email/password",
        //     password: "Invalid email/password",
        //   };
        //   addErrors(errors);
        // }
      });
    // validate(user)
    //   .then((r) => {})
    //   .catch((e) => {});
  };

  return (
    <div className="container container card mt-lg-4 mt-xl-10 mt-xxl-10">

      <form className="js-validate m-5" onSubmit={OnSubmitHandler}>
        <div className="mb-5 mb-md-7">
          <h1 className="h2">Enter your email address</h1>
        </div>

        <div className="js-form-message form-group">
          <ValidatedInput
            label="Email"
            type="email"
            name="email"
            className="form-control"
            value={email.email}
            placeholder="Email"
            required={true}
            onChange={onChangeHandler}
          />
        </div>

        <div className="row align-items-center mb-5">
          <div className="col-sm-6 mb-3 mb-sm-0"></div>

          <div className="col-sm-6 text-sm-end mt-2">
            <SpinnerButton
              type="submit"
              loading={isLoggingIn}
              className="btn btn-secondary transition-3d-hover"
            >
              Send
            </SpinnerButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
