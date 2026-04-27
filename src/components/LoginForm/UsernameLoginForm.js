import React, { useState, useContext } from "react";
import { ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import useValidation from "hooks/useValidation";
import SpinnerButton from "utils/SpinnerButton";
import { clientLogin } from "requests";
import { AuthContext } from "context";
import { usernameLoginFormValidations } from "./UsernameLoginFormValidations";
import { history } from "components/History";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import loginWithGoogle from "requests/loginWithGoogle";
import loginWithFacebook from "requests/loginWithFacebook";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGoogleLogin } from '@react-oauth/google';

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const UsernameLoginForm = ({ admin }) => {
  const [loginWithGoogleReq] = useRequest(loginWithGoogle);
  const [loginWithFacebookReq] = useRequest(loginWithFacebook);
  const [user, setUser] = useState({ username: "", password: "" });
  const [login, isLoggingIn] = useRequest(clientLogin);
  const { errors, validate, addErrors } = useValidation(
    usernameLoginFormValidations
  );
  const { auth, setAuth } = useContext(AuthContext);
  const [processingGoogleAuth, setProcessingGoogleAuth] = useState(false);
  const [processingFacebookAuth, setProcessingFacebookAuth] = useState(false);
  const onChangeHandler = ({ target: { name, value } }) => {
    const newUser = { ...user, [name]: value };
    setUser(newUser);
    validate(newUser, name).catch((e) => { });
  };
  const OnSubmitHandler = (e) => {
    e.preventDefault();
    validate(user)
      .then((r) => {
        login(user)
          .then((response) => {
            setAuthUser(response);
          })
          .catch((e) => {
            //console.log(e);
            addErrors({
              username: "Wrong Credentials",
              password: "Wrong Credentials",
            });
          });
      })
      .catch((e) => { });
  };

  const setAuthUser = (response) => {
    setAuth({
      accessToken: response.data.access_token,
      isLoggedIn: true,
      accountType: admin ? "ADMIN" : "CLIENT",
      staff: response.data.staff,
      sourceCountry: response.data.staff.sourceCountry
    });

    history.push(admin ? "/admin" : "/agent");
    history.push('/dashboard/cargos')
  };

  const onSuccess = useGoogleLogin({
    onSuccess: tokenResponse => {
      setProcessingGoogleAuth(true);
      loginWithGoogleReq({ token: tokenResponse.access_token })
        .then((response) => {
          if (response.data.error === true) {
            toast.error(response.data.message, toastOptions);
          } else {
            setAuthUser(response);
            setProcessingGoogleAuth(false);
          }
        }).catch((response) => {
          setProcessingGoogleAuth(false);
        });
    },
  });


  const responseFacebook = (response) => {
    setProcessingFacebookAuth(true);
    loginWithFacebookReq({ token: response.accessToken, id: response.id })
      .then((response) => {
        if (response.data.error === true) {
          toast.error(response.data.message, toastOptions);
        } else {
          setAuthUser(response);
          setProcessingFacebookAuth(false);
        }
      }).catch((response) => {
        setProcessingFacebookAuth(false);
      });
  }


  return (
    <form style={{ minWidth: "220px" }} className="js-validate m-5" onSubmit={OnSubmitHandler}>
      <div className="mb-5 mb-md-7">
        <h6 className="badge badge-pill badge bg-primary">
          {admin ? "ADMIN" : "CLIENT"}
        </h6>
        <h1 className="h2">
          Welcome back to {admin ? "Admin login" : "Client login"}
        </h1>
        <p>Login to manage your account.</p>
      </div>

      <div className="js-form-message form-group mb-4">
        <ValidatedInput
          // label="Email"
          type="username"
          name="username"
          className="form-control"
          value={user.username}
          placeholder="Email"
          error={errors.username}
          onChange={onChangeHandler}
        />
      </div>

      <div className="js-form-message form-group">
        <ValidatedInput
          // label="Password"
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

      <div className="row mb-5">
        <div className="col-3 mb-3 mt-4 mb-sm-0 text-sm">
          <Link
            className="d-inline-block mt-n6 font-size-1"
            onClick={() => history.push("/forgot-password")}
            to={"/forgot-password"}
          >
            Forgot Password?
          </Link>

          <Link
            className="d-inline-block float-start font-size-1"
            onClick={() => history.push("/home/register")}
            to={"/home/register"}
          >
            <span className="">Don't have account? </span>
          </Link>
        </div>

        {/* <div className="col-10 text-end mt-3">
          <FacebookLogin
            appId="1171925543684304"
            autoLoad={false}
            scope="public_profile,email"
            fields="first_name,last_name,email, name"
            onClick={''}
            callback={''}
            cssClass="btn btn-sm btn-outline-primary transition-3d-hover"
            textButton={"Login with Facebook"}
          />
          <GoogleLogin
            clientId={''}
            onSuccess={''}
            onFailure={''}
            buttonText={"Login with Google"}
            render={renderProps => (
              <button className="btn btn-sm btn-outline-primary transition-3d-hover" onClick={renderProps.onClick}> Login with Google</button>
            )}
          />
        </div> */}


        <div className="col-9 mb-3 mb-sm-0">

          <div className="text-end mt-2">
            <FacebookLogin
              isMobile={false}
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              autoLoad={false}
              scope="public_profile,email"
              fields="first_name,last_name,email, name"
              onClick={''}
              callback={responseFacebook}
              cssClass="btn btn-outline-primary transition-3d-hover text-white-hover"
              textButton={
                processingFacebookAuth ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="text-primary h3 bi bi-facebook"></i>
                )
              }
            />
            {/* <GoogleLogin
              clientId={clientId}
              onSuccess={onSuccess}
              onFailure={''}
              buttonText={"Login with Google"}
              render={renderProps => (
                <button className="btn ms-2 btn-outline-primary transition-3d-hover text-white-hover" onClick={renderProps.onClick}>
                  {processingGoogleAuth ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <i className="text-primary h3 bi bi-google"></i>
                  )}
                </button>
              )}
            /> */}

            <button type="button"
              onClick={() => onSuccess()}
              className="btn ms-2 btn-outline-primary transition-3d-hover text-white-hover">
              {processingGoogleAuth ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <i className="text-primary h3 bi bi-google"></i>
              )}
            </button>
            <SpinnerButton
              type="submit"
              loading={isLoggingIn}
              className="btn btn-secondary transition-3d-hover ms-2"
            >
              Login
            </SpinnerButton>
          </div>
        </div>

        {/* <SpinnerButton
            type="submit"
            loading={isLoggingIn}
            className="btn btn-info transition-3d-hover ms-2 float-start"
          >
            Login with facebook
          </SpinnerButton> */}

      </div>

    </form>
  );
};

export default UsernameLoginForm;
