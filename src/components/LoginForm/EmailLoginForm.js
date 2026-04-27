import React, { useState, useContext } from "react";
import { ReplaceLink, ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import useValidation from "hooks/useValidation";
import SpinnerButton from "utils/SpinnerButton";
import { emailLoginFormValidations } from "./EmailLoginFormValidations";
import { AuthContext } from "context";
import { clientLogin } from "requests";

const EmailLoginForm = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [login, isLoggingIn] = useRequest(clientLogin);
  const { errors, validate, addErrors } = useValidation(
    emailLoginFormValidations
  );
  const { setAuth } = useContext(AuthContext);
  const onChangeHandler = ({ target: { name, value } }) => {
    const newUser = { ...user, [name]: value };
    setUser(newUser);
    validate(newUser, name).catch((e) => { });
  };

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    validate(user)
      .then((r) => {
        login(user)
          .then((response) => {
            setAuth({
              accessToken: response.data.token,
              isLoggedIn: true,
              accountType: "CLIENT",
            });
            // history.replace("/dashboard");
            window.location.reload();
          })
          .catch((e) => {
            if (e.response.status === 401) {
              const errors = {
                email: "Invalid email/password",
                password: "Invalid email/password",
              };
              addErrors(errors);
            }
          });
      })
      .catch((e) => { });
  };
  return (
    <form className="js-validate m-6" onSubmit={OnSubmitHandler}>
      {/* <!-- Title --> */}
      <div className="mb-5 mb-md-7">
        <h1 className="h2">Welcome back</h1>
        <p>Login to manage your account.</p>
      </div>
      {/* <!-- End Title --> */}

      <div className="js-form-message form-group">
        <ValidatedInput
          label="Email address"
          type="email"
          name="email"
          className="form-control"
          value={user.email}
          id="signinEmail"
          placeholder="Email address"
          error={errors.email}
          onChange={onChangeHandler}
        />
      </div>

      <div className="js-form-message form-group">
        <ValidatedInput
          label="Password"
          type="password"
          name="password"
          className="form-control"
          value={user.password}
          id="signinSrPassword"
          placeholder="********"
          error={errors.password}
          onChange={onChangeHandler}
        />
      </div>

      {/* <!-- Button --> */}
      <div className="row align-items-center mb-5">
        <div className="col-sm-6 mb-3 mb-sm-0">
          <div className="row align-items-center ms-1">
            <p>
              <span className="font-size-1 text-muted">
                Don't have an account?
              </span>
              <ReplaceLink
                className="font-size-1 fw-bold"
                to="/register"
                relative
              >
                Signup
              </ReplaceLink>
            </p>
          </div>
          <div className="row align-items-center ms-1">
            <ReplaceLink
              className="font-size-1 link-underline text-capitalize font-weight-normal"
              to="/forgot-password"
            >
              Forgot Password?
            </ReplaceLink>
          </div>
        </div>

        <div className="col-sm-6 text-sm-end">
          <SpinnerButton
            type="submit"
            loading={isLoggingIn}
            className="btn btn-secondary transition-3d-hover"
          >
            Login
          </SpinnerButton>
        </div>
      </div>
      {/* <!-- End Button --> */}
    </form>
  );
};

export default EmailLoginForm;
