import React, { useState } from "react";
import { ReplaceLink, ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import SpinnerButton from "utils/SpinnerButton";
import useValidation from "hooks/useValidation";
import RegisterationFormValidatons from "./RegisterationFormValidatons";
import { clientRegister } from "requests";
import { toast } from "react-toastify";
import { history } from "components/History";
import { Link } from "react-router-dom";

const RegisterationForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    terms: false,
    citizenship: null,
  });
  const [register, isRegistering] = useRequest(clientRegister);
  const { errors, validate } = useValidation(RegisterationFormValidatons);
  const onChangeHandler = (e) => {
    const newUser = { ...user, [e.target.name]: e.target.value };
    setUser(newUser);
    validate(newUser, e.target.name).catch((e) => { });
  };
  const onRadioChangeHandler = (e) => {
    const newUser = { ...user, citizenship: e.target.value };
    setUser(newUser);
    validate(newUser, e.target.name);
  };
  const onCheckBoxChangeHandler = (e) => {
    const newUser = { ...user, [e.target.name]: !user.terms };
    setUser(newUser);
    validate(newUser, e.target.name);
  };
  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    validate(user)
      .then((r) => {
        register(user)
          .then((response) => {
            console.log(123213);
            console.log(response);
            toast.success("Registered successfully, check your email");
            //history.push("/registeration-success");
          })
          .catch((e) => {
            console.log(e, 333);
            toast.error("An error occured, please try again in couple monutes.");
          });
      })
      .catch((e) => { });
  };
  return (
    <form className="js-validate" onSubmit={OnSubmitHandler}>
      <div className="mb-5 mb-md-7">
        <h1 className="h2">Welcome to Akido</h1>
        <p>Fill out the form to get started.</p>
      </div>

      <div className="js-form-message form-group">
        <ValidatedInput
          label="Full name"
          type="text"
          name="name"
          className="form-control"
          value={user.name}
          error={errors.name}
          id="signupName"
          placeholder="e.g. John Smith"
          onChange={onChangeHandler}
        />
      </div>
      <div className="js-form-message form-group">
        <ValidatedInput
          label="Email"
          type="text"
          name="email"
          className="form-control"
          value={user.email}
          error={errors.email}
          id="signupEmail"
          placeholder="Email"
          onChange={onChangeHandler}
        />
      </div>
      <div className="js-form-message form-group">
        <ValidatedInput
          label="National ID"
          type="national_personal_number"
          name="national_personal_number"
          className="form-control"
          value={user.national_personal_number}
          id="national_personal_number"
          placeholder="National ID"
          error={errors.national_personal_number}
          onChange={onChangeHandler}
        />
      </div>
      <div className="js-form-message form-group">
        <ValidatedInput
          label="Phone"
          type="text"
          name="mobile"
          className="form-control"
          value={user.mobile}
          error={errors.mobile}
          id="signupMobile"
          placeholder="1234567"
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
          error={errors.password}
          id="signupSrPassword"
          placeholder="********"
          onChange={onChangeHandler}
        />
      </div>

      <div className="js-form-message form-group">
        <ValidatedInput
          label="Confirm Password"
          type="password"
          name="passwordConfirm"
          className="form-control"
          value={user.passwordConfirm}
          error={errors.passwordConfirm}
          id="signupSrPasswordConfirm"
          placeholder="********"
          onChange={onChangeHandler}
        />
      </div>
      <div className="form-check custom-control custom-checkbox d-flex">
        <ValidatedInput
          className="form-check-input"
          type="radio"
          name="citizenship"
          id="radio1"
          value="GEORGIAN"
          label="Georogian Citizen"
          onChange={onRadioChangeHandler}
          checked={user.citizenship === "GEORGIAN"}
        />
      </div>
      <div className="form-check custom-control custom-checkbox d-flex">
        <ValidatedInput
          className="form-check-input"
          type="radio"
          name="citizenship"
          id="radio2"
          value="FOREIGN"
          label="Foreign Citizen"
          onChange={onRadioChangeHandler}
          checked={user.citizenship === "FOREIGN"}
        />
      </div>
      <div className="form-check custom-control custom-checkbox d-flex">
        <ValidatedInput
          className="form-check-input"
          type="radio"
          name="citizenship"
          id="radio3"
          value="COMPANY"
          label="Company"
          onChange={onRadioChangeHandler}
          checked={user.citizenship === "COMPANY"}
        />
      </div>
      {errors.citizenship && (
        <label className="text-danger ms-2 font-weight-light text-xs">
          {errors.citizenship}
        </label>
      )}
      <div className="js-form-message mb-5">
        <div className="custom-control custom-checkbox d-flex align-items-center text-muted">
          <input
            type="checkbox"
            className="custom-control-input"
            id="termsCheckbox"
            name="terms"
            value={user.terms}
            onChange={onCheckBoxChangeHandler}
            checked={user.terms}
          />
          <label className="custom-control-label" htmlFor="termsCheckbox">
            <small>
              <Link
                className="link-underline"
                to="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                I agree to the Terms and Conditions
              </Link>
            </small>
          </label>
        </div>
        {errors.terms && (
          <label className="text-danger ms-2 font-weight-light text-xs">
            {errors.terms}
          </label>
        )}
      </div>
      <div className="row align-items-center mb-5">
        <div className="col-sm-6 mb-3 mb-sm-0">
          <span className="font-size-1 text-muted">
            Already have an account?
          </span>
          <ReplaceLink
            className="font-size-1 fw-bold"
            to="/login"
            relative
          >
            Login
          </ReplaceLink>
        </div>
        <div className="col-sm-6 text-sm-end">
          <SpinnerButton
            loading={isRegistering}
            type="submit"
            className="btn btn-secondary transition-3d-hover"
          >
            Register
          </SpinnerButton>
        </div>
      </div>
    </form>
  );
};
export default RegisterationForm;
