import React, { useState, useContext, useEffect } from "react";
import { ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import useValidation from "hooks/useValidation";
import SpinnerButton from "utils/SpinnerButton";
import { clientLogin } from "requests";
import { AuthContext } from "context";
import { history } from "components/History";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import loginWithGoogle from "requests/loginWithGoogle";
import loginWithFacebook from "requests/loginWithFacebook";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGoogleLogin } from '@react-oauth/google';
import { useForm } from "react-hook-form";
import { ClientFooter } from "components/Footer";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const LoginPage = () => {


    const [user, setUser] = useState({ username: "", password: "" });
    const [loginWithGoogleReq] = useRequest(loginWithGoogle);
    const [loginWithFacebookReq] = useRequest(loginWithFacebook);
    const [login, isLoggingIn] = useRequest(clientLogin);
    const { setValue, trigger, handleSubmit, register, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
    const { auth, setAuth } = useContext(AuthContext);
    const [processingGoogleAuth, setProcessingGoogleAuth] = useState(false);
    const [processingFacebookAuth, setProcessingFacebookAuth] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isBook, setIsBook] = useState(false);

    const onChangeHandler = ({ target: { name, value } }) => {
        const newUser = { ...user, [name]: value };
        setUser(newUser);
        setValue(name, value);
    };

    useEffect(() => {
        setIsBook((new URLSearchParams(window.location.search)).get("n") === 'book');
    }, []);

    const handleKeyPress = (event) => {
        trigger();
        console.log(isValid);
        if (event.key === 'Enter' && isValid) {
            console.log(errors);
            handleSubmit(loginUser());
        }
    }

    const loginUser = () => {
        login(user)
            .then((response) => {
                setAuthUser(response);
            })
            .catch((e) => {
                toast.error('Wrong credentials', toastOptions);
            });
    };

    const setAuthUser = (response) => {
        setAuth({
            accessToken: response.data.access_token,
            isLoggedIn: true,
            accountType: "CLIENT",
            staff: response.data.staff,
            sourceCountry: response.data.staff.sourceCountry
        });
        if (isBook) {
            console.log(1);
            history.push('/book-a-courier/' + response.data.staff.sourceCountry + '/' + 'GE');
        } else {
            console.log(2);
            history.push('/dashboard/cargos');
        }
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
        <>
            <section className="">
                <div className="px-4 py-5 px-md-5 text-center text-lg-start">
                    <div className="container">
                        <div className="row gx-lg-5 align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <div className="h1 my-5 fw-bold ls-tight">
                                    Login <br />
                                    <span className="text-primary">To get started</span>
                                </div>
                                <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                                    Please enter your email address and password or login with socials. (to login with socials you must be registered with socials as well)
                                </p>
                            </div>

                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <div className="card">
                                    <div className="card-body py-5 px-md-5">
                                        <div>
                                            <div className="form-floating mb-3">
                                                <input type="email"
                                                    name="username"
                                                    value={user.username}
                                                    {...register("username", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        },
                                                        maxLength: {
                                                            value: 255,
                                                            message: "Too Many Characters. maximum: 255"
                                                        },
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "invalid email address"
                                                        }
                                                    })}
                                                    onChange={(e) => {
                                                        onChangeHandler(e);
                                                    }}
                                                    placeholder="Email"
                                                    className={"form-control " + (errors.username ? 'border border-2 border-danger' : '')}
                                                    id="floatingInput" />
                                                <label for="floatingInput">Email address</label>
                                                {errors.username && <p className="text-danger d-block w-full">{errors.username.message}</p>}
                                            </div>

                                            <div className="form-floating mb-3 position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    // name="password"
                                                    className={"form-control " + (errors.password ? 'border border-2 border-danger' : '')}
                                                    value={user.password}
                                                    id="signinSrPassword"
                                                    placeholder="********"
                                                    {...register("password", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        },
                                                    })}
                                                    onKeyPress={handleKeyPress}
                                                    onChange={onChangeHandler}
                                                />
                                                <i
                                                    className={"bi position-absolute " + (showPassword ? 'bi-eye' : 'bi-eye-slash')}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    role="button"
                                                    style={{ right: "15px", top: "15px", fontSize: "20px" }}></i>
                                                <label for="floatingInput">Password</label>
                                                {errors.password && <p className="text-danger d-block w-full">{errors.password?.message}</p>}

                                            </div>

                                            <div className="col text-start">
                                                <Link to="/forgot-password" title="Forgot password?" className="text-sm">Forgot password?</Link>
                                            </div>

                                            <div className="container mt-3">
                                                <div className="row">
                                                    <div className="col text-center">
                                                        <button
                                                            onClick={handleSubmit(loginUser)}
                                                            type="submit" className="btn btn-primary btn-block mb-4">
                                                            Login
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="text-center">
                                                <p>Not a client? <Link title="Register" to={`${history.location.pathname.replace('login', 'register')}`}>Register</Link></p>

                                                <p>or login with:</p>

                                                <button type="button"
                                                    onClick={() => onSuccess()}
                                                    className="btn btn-link btn-floating mx-1">
                                                    {processingGoogleAuth ? (
                                                        <Spinner animation="border" size="sm" />
                                                    ) : (
                                                        <i className="fab fa-google"></i>
                                                    )}
                                                </button>

                                                <FacebookLogin
                                                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                                    autoLoad={false}
                                                    isMobile={false}
                                                    scope="public_profile,email"
                                                    fields="first_name,last_name,email, name"
                                                    onClick={''}
                                                    callback={responseFacebook}
                                                    cssClass="btn btn-link btn-floating mx-1"
                                                    textButton={
                                                        processingFacebookAuth ? (
                                                            <Spinner animation="border" size="sm" />
                                                        ) : (
                                                            <i className="fab fa-facebook-f"></i>
                                                        )
                                                    }
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
            {/* <ClientFooter /> */}

        </>
    );
};

export default LoginPage;