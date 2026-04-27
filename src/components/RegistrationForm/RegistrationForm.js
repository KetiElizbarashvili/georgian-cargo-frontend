import { useEffect, useState } from "react";
import { ReplaceLink, ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import SpinnerButton from "utils/SpinnerButton";
import useValidation from "hooks/useValidation";
import RegistrationFormValidations from "./RegistrationFormValidations";
import { clientRegister } from "requests";
import { toast } from "react-toastify";
import { history } from "components/History";
import { useFetch } from "hooks/useFetch";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import FacebookLogin from 'react-facebook-login';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
const clientId =
  '956897774943-9j0apv4m596933u8am5g6n72u3pfbdeg.apps.googleusercontent.com';

const RegistrationForm = () => {
  const [register, isRegistering] = useRequest(clientRegister);
  const { errors, validate, addErrors, setErrors } = useValidation(
    RegistrationFormValidations
  );
  const [user, setUser] = useState({
    username: "",
    name: "",
    password: "",
    confirm_password: "",
    email: "",
    phone: "",
    national_id: "GE",
    want_notifications: false,
    customer_type: "INDIVIDUAL",
  });


  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const onChangeHandler = (e) => {
    const newUser = { ...user, [e.target.name]: e.target.value };
    setUser(newUser);
    validate(newUser, e.target.name).catch((e) => {
      //console.log(e, "validation error");
    });
  };

  const onCheckBoxChangeHandler = (e) => {
    const newUser = { ...user, [e.target.name]: !user.terms };
    setUser(newUser);
    validate(newUser, e.target.name);
  };

  const OnSubmitHandler = (e) => {
    e.preventDefault();
    if (user.phone === "") {
      console.log(1);
      addErrors({
        phone: "asdasd"
      });
    }
    validate(user)
      .then(() => {
        register(user)
          .then((e) => {
            console.log(e);
            if (e.data.error === true) {
              // addErrors({
              //   email: e.data.message
              // });
              toast.error(e.data.message);
            } else {
              toast.success("Registered successfully, check your email");
              history.push("/home");
            }
            if (e.data.error === true && e.data.email_exists === true) {
              history.push("/forgot-password");

            }
          })
          .catch((e) => {
            //console.log(e, "errorr 9999");
            toast.error("An error occurred");
          });
      })
      .catch((e) => { });
  };



  const onSuccess = response => {
    const { email, name } = response.profileObj;
    setUserFromSocials(email, name);
  };

  const setUserFromSocials = (email, name) => {
    const newUser = { ...user, email: email, name: name, username: name.toString().toLowerCase().replace(/\s/g, "").slice(0, 4) + parseInt(Math.random() * (999 - 100) + 100) };
    setUser(newUser);
    toast.success("Please fill all empty fields!");
  };

  const onFailure = response => {
    toast.error("Error getting data from Google.");
  };




  const responseFacebook = (response) => {
    const { email, name } = response;
    console.log(response);
    setUserFromSocials(email, name);
  }

  const componentClicked = () => {
    console.log("clicked");
  };


  return (
    <form style={{ minWidth: "200px" }} className="m-4" onSubmit={OnSubmitHandler}>
      <div className="mb-2 mb-md-7">
        <p className="h4">Fill out the form to get started.</p>
      </div>
      <div className="row">
        <div className="col-md-5">
          <div class="form-group row mb-2">
            <label for="signupUsername" class="col-sm-2 col-form-label">Username</label>
            <div class="col-sm-10">
              <ValidatedInput
                type="text"
                name="username"
                className="form-control"
                value={user.username}
                error={errors.username}
                id="signupUsername"
                placeholder="e.g. user123"
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div class="form-group row mb-2">
            <label for="signupName" class="col-sm-2 col-form-label">Full name</label>
            <div class="col-sm-10">
              <ValidatedInput
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
          </div>

          <div class="form-group row mb-2">
            <label for="signupEmail" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <ValidatedInput
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
          </div>
          <div class="form-group row mb-2">
            <label for="signupMobile" class="col-sm-2 col-form-label">Phone</label>
            <div class="col-sm-10">
              <PhoneInput
                country={'ge'}
                inputClass={"form-control"}
                inputStyle={{ borderColor: errors.phone ? "#ed4c78" : "", width: "100%", border: ".0625rem solid rgba(33, 50, 91, .1)", padding: "10.5px 14px 10.5px 60px" }}
                value={user.phone}
                error={errors.phone}
                id="signupMobile"
                onChange={(e) => {
                  const newUser = { ...user, phone: e };
                  setUser(newUser);
                }}
              />
              {errors.phone && (
                <span class="text-danger font-size-1">{errors.phone}</span>
              )}

            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div class="form-group row mb-2">
            <label for="signupSrPassword" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-10">
              <ValidatedInput
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
          </div>

          <div class="form-group row mb-2">
            <label for="signupSrPasswordConfirm" class="col-sm-2 col-form-label">Confirm Password</label>
            <div class="col-sm-10">
              <ValidatedInput
                type="password"
                name="confirm_password"
                className="form-control"
                value={user.confirm_password}
                error={errors.confirm_password}
                id="signupSrPasswordConfirm"
                placeholder="********"
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div class="form-group row mb-2">
            <label for="national_id" class="col-sm-2 col-form-label">National ID</label>
            <div class="col-sm-10">
              <ValidatedInput
                type="national_id"
                name="national_id"
                className="form-control"
                value={user.national_id}
                id="national_id"
                placeholder="National ID"
                error={errors.national_id}
                onChange={onChangeHandler}
                disabled={true}
              />
            </div>
          </div>

          <div class="form-group row mb-2">
            <label for="customerType" class="col-sm-2 col-form-label">Customer Type</label>
            <div class="col-sm-10">
              <select name="customer_type"
                className="form-control"
                value={user.customer_type}
                error={errors.customer_type}
                id="customerType"
                onChange={onChangeHandler}
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>
          </div>
        </div>
      </div>





      {/*<div className="js-form-message mb-2">
        <div className="custom-control custom-checkbox d-flex align-items-center text-muted">
          <input
            type="checkbox"
            className="custom-control-input"
            id="notificationCheckbox"
            name="want_notifications"
            value={user.want_notifications}
            onChange={onCheckBoxChangeHandler}
            checked={user.want_notifications}
          />
          <label
            className="custom-control-label ps-1"
            htmlFor="notificationCheckbox"
          >
            <small>Get Notifications</small>
          </label>
        </div>
  </div>*/}

      <div className="row align-items-center mb-5">
        <div className="col-6 col-sm-6 col-md-6 col-lg-6 mb-3">
          <ReplaceLink
            className="font-size-1"
            to="/login"
            relative
          >
            Already have an account?
          </ReplaceLink>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-6 mb-3 text-end">
          <SpinnerButton
            loading={isRegistering}
            type="submit"
            className="btn btn-secondary transition-3d-hover"
          >
            Register
          </SpinnerButton>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 text-end">
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            isMobile={false}
            scope="public_profile, email, user_birthday"
            fields="first_name,last_name,name,email"
            onClick={componentClicked}
            callback={responseFacebook}
            cssClass="btn btn-sm btn-outline-primary transition-3d-hover me-1 mb-2 mb-xs-0 mb-sm-0 mb-md-0"
            textButton={"Register with Facebook"}
          />
          <GoogleLogin
            clientId={clientId}
            onSuccess={onSuccess}
            onFailure={onFailure}
            buttonText={"Register with Google"}
            render={renderProps => (
              <button className="btn btn-sm btn-outline-primary transition-3d-hover me-1 mb-2 mb-xs-0 mb-sm-0 mb-md-0" onClick={renderProps.onClick}> Register with Google</button>
            )}
          />
        </div>
        <div>

        </div>
      </div>
    </form>
  );
};
export default RegistrationForm;

// TERMS

{
  /* {errors.citizenship && (
  <label className="text-danger ms-2 font-weight-light text-xs">
  {errors.citizenship}
  </label>
)} */
}

{
  // TERMS
  //
  //
  /* <div className="js-form-message mb-5">
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
  </div> */
}

// code should be used in future

// const onRadioChangeHandler = (e) => {
//   const newUser = { ...user, citizenship: e.target.value };
//   setUser(newUser);
//   validate(newUser, e.target.name);

//   console.log(user, ' user ');
// };

{
  /* <div className="form-check custom-control custom-checkbox d-flex">
        <ValidatedInput
          className="form-check-input"
          type="radio"
          name="citizenship"
          id="radio1"
          value="GEORGIAN"
          label="Georogian Citizen"
          onChange={onRadioChangeHandler}
          checked={user.citizenship === 'GEORGIAN'}
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
          checked={user.citizenship === 'FOREIGN'}
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
          checked={user.citizenship === 'COMPANY'}
        />
      </div> */
}
