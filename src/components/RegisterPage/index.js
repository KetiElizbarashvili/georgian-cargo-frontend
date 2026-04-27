import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { history } from "components/History";
import { gapi } from 'gapi-script';
import FacebookLogin from 'react-facebook-login';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { clientRegister } from "requests";
import useRequest from "hooks/useRequest";
import loginWithFacebook from "requests/loginWithFacebook";
import { AuthContext } from "context";
import { useGoogleLogin } from '@react-oauth/google';
import loginWithGoogle from "requests/loginWithGoogle";
import { Spinner } from "react-bootstrap";
import queryString from 'query-string';

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const RegisterPage = () => {
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
        invite: queryString.parse(window.location.search).invite,
    });
    const { setValue, handleSubmit, register, watch, formState: { errors } } = useForm({ mode: 'onChange' });
    const [showPassword, setShowPassword] = useState(false);
    const [registerUser, isRegistering] = useRequest(clientRegister);
    const [loginWithFacebookReq] = useRequest(loginWithFacebook);
    const [loginWithGoogleReq] = useRequest(loginWithGoogle);
    const { auth, setAuth } = useContext(AuthContext);
    const [processingGoogleAuth, setProcessingGoogleAuth] = useState(false);
    const [processingFacebookAuth, setProcessingFacebookAuth] = useState(false);

    useEffect(() => {
        // console.log(errors);
    }, [errors]);

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'profile email',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    const onChangeHandler = (e) => {
        const newUser = { ...user, [e.target.name]: e.target.value };
        setUser(newUser);
        setValue(e.target.name, e.target.value);

    };


    const OnSubmitHandler = (e) => {
        registerUser(user)
            .then((e) => {
                if (e.data.error === true && e.data.email_exists === true) {
                    history.push("/forgot-password");

                }
                if (e.data.error === true) {
                    toast.error(e.data.message);
                } else {
                    toast.success("Registered successfully, check your email");
                    history.push("/home");
                }
            })
            .catch((e) => {
                toast.error("An error occurred");
            });
    };

    // const onSuccess = response => {
    //     const { email, name } = response.profileObj;
    //     setUserFromSocials(email, name);
    // };

    const onSuccess = useGoogleLogin({
        onSuccess: tokenResponse => {
            setProcessingGoogleAuth(true);
            loginWithGoogleReq({ token: tokenResponse.access_token, invite: user.invite })
                .then((response) => {
                    console.log(response);
                    if (response.data.error === true) {
                        toast.error(response.data.message, toastOptions);
                    } else {
                        toast.success("You are successfully registered.");
                        setAuthUser(response);
                        setProcessingGoogleAuth(false);
                    }
                }).catch((response) => {
                    setProcessingGoogleAuth(false);
                });
        },
    });

    const setUserFromSocials = (email, name) => {
        const newUser = { ...user, email: email, name: name, username: name.toString().toLowerCase().replace(/\s/g, "").slice(0, 4) + parseInt(Math.random() * (999 - 100) + 100) };
        setUser(newUser);
        setValue('email', email);
        setValue('name', name);
        setValue('username', name.toString().toLowerCase().replace(/\s/g, "").slice(0, 4) + parseInt(Math.random() * (999 - 100) + 100));

        toast.success("Please fill all empty fields!");
    };

    const onFailure = response => {
        toast.error("Error getting data from Google.");
    };


    const setAuthUser = (response) => {
        setAuth({
            accessToken: response.data.access_token,
            isLoggedIn: true,
            accountType: "CLIENT",
            staff: response.data.staff,
            sourceCountry: response.data.staff.sourceCountry
        });

        history.push('/dashboard/cargos')
    };

    const responseFacebook = (response) => {
        if (response.status !== 'unknown') {
            setProcessingFacebookAuth(true);
            // const { email, name } = response;
            // setUserFromSocials(email, name);
            loginWithFacebookReq({ token: response.accessToken, id: response.id, invite: user.invite })
                .then((response) => {
                    if (response.data.error === true) {
                        toast.error(response.data.message, toastOptions);
                    } else {
                        toast.success("You are successfully registered.");
                        setAuthUser(response);
                        setProcessingFacebookAuth(false);
                    }
                }).catch((response) => {
                });
            setProcessingFacebookAuth(false);
        }
    }


    const componentClicked = () => {
        console.log("clicked");
    };


    return (
        <>
            <section className="">
                <div className="px-4 py-5 px-md-5 text-center text-lg-start">
                    <div className="container">
                        <div className="row gx-lg-5 align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <div className="h1 my-5 fw-bold ls-tight">
                                    Register <br />
                                    <span className="text-primary">To start using our services</span>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <div className="card">
                                    <div className="card-body py-5 px-md-5">
                                        <div>
                                            <div className="form-floating mb-3">
                                                <input type="text"
                                                    name="username"
                                                    value={user.username}
                                                    {...register("username", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        },
                                                        maxLength: {
                                                            value: 7,
                                                            message: "Too Many Characters. maximum: 7"
                                                        },
                                                        pattern: {
                                                            value: /^[0-9a-z]*$/i,
                                                            message: "invalid username, please use only characters and numbers"
                                                        }
                                                    })}
                                                    onChange={(e) => {
                                                        onChangeHandler(e);
                                                    }}
                                                    placeholder="Username"
                                                    className={"form-control " + (errors.username ? 'border border-2 border-danger' : (user.username !== '' ? 'border border-2 border-success' : ''))}
                                                    id="floatingInput" />
                                                <label for="floatingInput">Username</label>
                                                {errors.username && <p className="text-danger d-block w-full">{errors.username.message}</p>}
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input type="text"
                                                    name="name"
                                                    value={user.name}
                                                    {...register("name", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        },
                                                        maxLength: {
                                                            value: 32,
                                                            message: "Too Many Characters. maximum: 32"
                                                        },
                                                        pattern: {
                                                            value: /^[ a-z]*$/i,
                                                            message: "invalid name, please use only characters and spaces"
                                                        }
                                                    })}
                                                    onChange={(e) => {
                                                        onChangeHandler(e);
                                                    }}
                                                    placeholder="Username"
                                                    className={"form-control " + (errors.name ? 'border border-2 border-danger' : (user.name !== '' ? 'border border-2 border-success' : ''))}
                                                    id="floatingInput" />
                                                <label for="floatingInput">Full name</label>
                                                {errors.name && <p className="text-danger d-block w-full">{errors.name.message}</p>}
                                            </div>

                                            <div className="form-floating mb-3">
                                                <input type="email"
                                                    name="email"
                                                    value={user.email}
                                                    {...register("email", {
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
                                                    className={"form-control " + (errors.email ? 'border border-2 border-danger' : (user.email !== '' ? 'border border-2 border-success' : ''))} id="floatingInput" />
                                                <label for="floatingInput">Email address</label>
                                                {errors.email && <p className="text-danger d-block w-full">{errors.email.message}</p>}
                                            </div>

                                            <div className="form-floating mb-3 position-relative">
                                                <PhoneInput
                                                    country={'gb'}
                                                    inputClass={"form-control " + (errors.phone ? 'border border-2 border-danger' : (user.phone !== '' ? 'border border-2 border-success' : ''))}
                                                    inputStyle={{ borderColor: errors.phone ? "#ed4c78" : "", width: "100%", border: ".0625rem solid rgba(33, 50, 91, .1)", padding: "10.5px 14px 10.5px 60px" }}
                                                    value={user.phone}
                                                    error={errors.phone}
                                                    id="floatingInput"
                                                    {...register("phone", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        },
                                                        maxLength: {
                                                            value: 20,
                                                            message: "Too Many Characters. maximum: 20"
                                                        },
                                                        minLength: {
                                                            value: 5,
                                                            message: "Too Few Characters. minimum: 5"
                                                        },
                                                        pattern: {
                                                            value: /^[0-9]*$/i,
                                                            message: "invalid phone, please use only numbers"
                                                        }
                                                    })}
                                                    onChange={(e) => {
                                                        const newUser = { ...user, phone: e };
                                                        setValue('phone', e);
                                                        setUser(newUser);
                                                    }}
                                                />
                                                <i
                                                    className={"bi position-absolute bi-telephone"}
                                                    style={{ right: "13px", top: "13px", fontSize: "16px" }}></i>
                                                {/* <input type="text"
                                                name="phone"
                                                value={user.phone}
                                                {...register("phone", {
                                                    required: {
                                                        value: true,
                                                        message: "This field is required"
                                                    },
                                                    maxLength: {
                                                        value: 20,
                                                        message: "Too Many Characters. maximum: 20"
                                                    },
                                                    pattern: {
                                                        value: /^[ 0-9]*$/i,
                                                        message: "invalid phone, please use only numbers"
                                                    }
                                                })}
                                                onChange={(e) => {
                                                    onChangeHandler(e);
                                                }}
                                                placeholder="Username"
                                                className="form-control" id="floatingInput" /> */}
                                                {/* <label for="floatingInput">Phone number</label> */}
                                                {errors.phone && <p className="text-danger d-block w-full">{errors.phone.message}</p>}
                                            </div>

                                            <div className="form-floating mb-3 position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    className={"form-control " + (errors.password ? 'border border-2 border-danger' : (user.password !== '' ? 'border border-2 border-success' : ''))}
                                                    value={user.password}
                                                    id="signinSrPassword"
                                                    placeholder="********"
                                                    {...register("password", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        }
                                                    })}
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


                                            <div className="form-floating mb-3 position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="confirm_password"
                                                    className={"form-control " + (errors.confirm_password ? 'border border-2 border-danger' : (user.confirm_password !== '' ? 'border border-2 border-success' : ''))}
                                                    value={user.confirm_password}
                                                    id="signinSrPassword"
                                                    placeholder="********"
                                                    {...register("confirm_password", {
                                                        required: {
                                                            value: true,
                                                            message: "This field is required"
                                                        },
                                                        validate: (val) => {
                                                            if (watch('password') != val) {
                                                                return "Your passwords do no match";
                                                            }
                                                        },
                                                    })}
                                                    onChange={onChangeHandler}
                                                />
                                                <i
                                                    className={"bi position-absolute " + (showPassword ? 'bi-eye' : 'bi-eye-slash')}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    role="button"
                                                    style={{ right: "15px", top: "15px", fontSize: "20px" }}></i>
                                                <label for="floatingInput">Confirm password</label>
                                                {errors.confirm_password && <p className="text-danger d-block w-full">{errors.confirm_password?.message}</p>}

                                            </div>

                                            <div className="container">
                                                <div className="row">
                                                    <div className="col text-center">
                                                        <button
                                                            onClick={handleSubmit(OnSubmitHandler)}
                                                            disabled={isRegistering}
                                                            type="submit" className="btn btn-primary btn-block mb-4">
                                                            Register
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="text-center">
                                                <p>Already client? <Link to={`${history.location.pathname.replace('register', 'login')}`}>Login</Link></p>

                                                <p>or register with:</p>

                                                {/* <GoogleLogin
                                                    clientId={clientId}
                                                    onSuccess={onSuccess}
                                                    onFailure={onFailure}
                                                    buttonText={"Register with Google"}
                                                    render={renderProps => (
                                                        <i role="button" onClick={renderProps.onClick} className="btn btn-link fab fa-google"></i>
                                                    )}
                                                /> */}
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
                                                    scope="public_profile, email, user_birthday"
                                                    fields="first_name,last_name,name,email"
                                                    onClick={componentClicked}
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
                </div>
            </section>
            {/* <ClientFooter /> */}

        </>
    );
};

export default RegisterPage;