import React, { useState, useEffect, useContext } from "react";
import { useRequest } from "hooks";
import clientRequest from "requests/client";
import Spinner from "react-bootstrap/Spinner";
import updateCustomer from "requests/updateCustomer";
import updatePassword from "requests/updatePassword";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { AuthContext } from "context";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { useCookies } from "react-cookie";

const errorsDiv = document.getElementById("form-errors");
const passErrorsDiv = document.getElementById("password-form-errors");

const PersonalInfoForm = () => {
  const [cookies, setCookie] = useCookies(['allRoutes']);
  const [getCustomer] = useRequest(clientRequest);
  const [customer, setCustomer] = useState(null);
  const [updatePasswordObj, setUpdatePasswordObj] = useState({ current_password: null, password: null, confirm_password: null, token: null });
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [updateCustomerReq] = useRequest(updateCustomer);
  const [updatePasswordReq] = useRequest(updatePassword, false, "password-form-errors");
  const { register, setValue, reset, handleSubmit, trigger, formState: { errors } } = useForm({ mode: 'onChange' });
  const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, watch } = useForm();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const { formErrors, setFormErrors } = useState([]);
  const [passwordUpdating, setPasswordUpdating] = useState(false);


  const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
  };

  const onTodoChange = (index, value) => {
    setCustomer({ ...customer, [index]: value });
  };

  const onTodoChangePassword = (index, value) => {
    setUpdatePasswordObj({ ...updatePasswordObj, [index]: value });
  };

  const updatePasswordHandle = () => {
    setPasswordUpdating(true);
    // console.log(auth.accessToken);
    updatePasswordReq(updatePasswordObj)
      .then((response) => {
        if (response.data.error == true) {
          toast.error(response.data.message + '. make sure your current password is right', toastOptions);
        }
        else {
          setShowChangePassword(false);
          toast.success("Password updated!", toastOptions);
          passErrorsDiv.classList.add('d-none');
        }
        setPasswordUpdating(false);
      }).catch((e) => {
      });
  };

  const updateProfile = (data) => {
    updateCustomerReq(customer)
      .then((response) => {
        if (response.data.error === true) {
          toast.error(response.data.message, toastOptions);
        }
        else {
          setAuth({
            ...auth,
            staff: {
              ...auth.staff,
              username: response.data.customer.username,
              name: response.data.customer.name,
              email: response.data.customer.email,
              phone: response.data.customer.phone,
            }
          });
          toast.success("Profile updated!", toastOptions);
          errorsDiv.classList.add('d-none');
        }
      }).catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {

    // console.log(customer);
  }, [customer]);

  const ChangePasswordModal = () => {
    setShowChangePassword(true);
  };

  const CloseChangePasswordModal = () => {
    setShowChangePassword(false);
  };

  useEffect(() => {
    setLoadingCustomer(true);
    getCustomer()
      .then((data) => {
        console.log(data);
        setCustomer(data.data.customer);
        setValue('phone', data.data.customer.phone)
        setLoadingCustomer(false);
      })
      .catch((e) => {
        setLoadingCustomer(false);
        toast.error("Error has occured!", toastOptions);
      });
    setUpdatePasswordObj({ ...updatePasswordObj, token: auth.accessToken });
  }, []);

  return (
    <>
      {loadingCustomer && (
        <>
          <LoadingSpinner />
        </>
      )}

      {!loadingCustomer && customer && (
        <div className="d-grid gap-3 gap-lg-5">
          <div className="card">
            <div className="card-header border-bottom">
              <h4 className="card-header-title">Customer info</h4> <small>Registered at: &nbsp; {moment(customer.created_at).format("D MMMM, YYYY")}</small>
            </div>

            <div className="card-body">
              {customer.phone.toString().length < 5 && (
                <div className="alert alert-danger">To use booking please enter valid phone number</div>
              )}
              <form>
                {/* <div className="row mb-4">
                    <label className="col-sm-3 col-form-label form-label">Profile photo</label>

                    <div className="col-sm-9">
                      
                      <div className="d-flex align-items-center">
                        
                        <label className="avatar avatar-xl avatar-circle" htmlFor="avatarUploader">
                          <img id="avatarImg" className="avatar-img" src="@@autopath/assets/img/160x160/img9.jpg" alt="Image Description" />
                        </label>

                        <div className="d-grid d-sm-flex gap-2 ms-4">
                          <div className="form-attachment-btn btn btn-secondary btn-sm">Upload photo
                            <input type="file" className="js-file-attach form-attachment-btn-label" id="avatarUploader"
                                   data-hs-file-attach-options='{
                                      "textTarget": "#avatarImg",
                                      "mode": "image",
                                      "targetAttr": "src",
                                      "resetTarget": ".js-file-attach-reset-img",
                                      "resetImg": "@@autopath/assets/img/160x160/img1.jpg",
                                      "allowTypes": [".png", ".jpeg", ".jpg"]
                                   }' />
                          </div>
                          

                          <button type="button" className="js-file-attach-reset-img btn btn-white btn-sm">Delete</button>
                        </div>
                      </div>
                      
                    </div>
                  </div> */}
                <div style={{ whiteSpace: "pre" }} id="form-errors" className="alert alert-danger d-none" role="alert">
                </div>
                <div className="row mb-4">
                  <label htmlFor="firstNameLabel" className="col-sm-3 col-form-label form-label">Full name
                  </label>

                  <div className="col-sm-9">
                    <input type="text"
                      className={"form-control " + (errors.name ? 'border border-danger' : '')}
                      name="fullName" id="firstNameLabel" placeholder="full name"
                      value={customer.name}
                      // {...register("name", { required: true, maxLength: 255 })}
                      {...register("name", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={e => onTodoChange('name', e.target.value)}
                    />
                    {errors.name && <p className="text-danger d-block w-full">{errors.name.message}</p>}


                  </div>
                </div>



                <div className="row mb-4">
                  <label htmlFor="emailLabel" className="col-sm-3 col-form-label form-label">Email</label>

                  <div className="col-sm-9">
                    <input type="email"
                      className={"form-control " + (errors.email ? 'border border-danger' : '')}
                      name="email" id="emailLabel" placeholder="email@example.com" aria-label="email@example.com" disabled
                      value={customer.email}
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <label htmlFor="usernameLabel" className="col-sm-3 col-form-label form-label">Username

                    {/* <i className="bi-question-circle text-body ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Displayed on public forums, such as Front."></i> */}
                  </label>

                  <div className="col-sm-9">

                    <input
                      type="username"
                      className={"form-control " + (errors.username ? 'border border-danger' : '')}
                      name="username"
                      value={customer.username}
                      id="usernameLabel"
                      placeholder="username"
                      {...register("username", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        minLength: {
                          value: 3,
                          message: "Too few Characters. minimum: 3"
                        },
                        maxLength: {
                          value: 7,
                          message: "Too Many Characters. maximum: 7"
                        }
                      })}
                      onChange={e => onTodoChange('username', e.target.value)}
                    />
                    {errors.username && <p className="text-danger d-block w-full">{errors.username.message}</p>}

                  </div>
                </div>




                <div className="js-add-field row mb-4">
                  <label htmlFor="phoneLabel" className="col-sm-3 col-form-label form-label">Phone</label>

                  <div className="col-sm-9">
                    <PhoneInput
                      country={'ge'}
                      inputClass={"js-input-mask form-control " + (errors.phone ? 'border border-danger' : '')}
                      inputStyle={{ width: "100%", border: ".0625rem solid rgba(33, 50, 91, .1)", padding: "10.5px 14px 10.5px 60px" }}
                      value={customer.phone}
                      name="phone"
                      error={errors.phone}
                      id="phoneLabel"
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
                      onChange={(e) => (setValue('phone', e), setCustomer({ ...customer, phone: e }))}
                    />
                    {errors.phone && <p className="text-danger d-block w-full">{errors.phone.message}</p>}
                    <div id="addPhoneFieldContainer"></div>

                    {/* <a href="#" className="js-create-field form-link">
                        <i className="bi-plus-circle me-1"></i> Add phone
                      </a> */}
                  </div>
                </div>

                <div className="row mb-4">
                  <label htmlFor="firstNameLabel" className="col-sm-3 col-form-label form-label">Customer Type
                  </label>

                  <div className="col-sm-9">
                    <select name='customer_type'
                      value={customer.customer_type}
                      onChange={(e) => (setValue('customer_type', e.target.value), setCustomer({ ...customer, customer_type: e.target.value }))}
                      className="form-select">
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="CORPORATE">Corporate</option>
                    </select>
                    {errors.customer_type && <p className="text-danger d-block w-full">{errors.customer_type.message}</p>}
                  </div>
                </div>



                {/* <div className="row mb-4">
                    <label className="col-sm-3 col-form-label form-label">Gender</label>

                    <div className="col-sm-9">
                      <div className="input-group input-group-md-down-break">
                        
                        <label className="form-control" htmlFor="genderTypeRadio1">
                          <span className="form-check">
                            <input type="radio" className="form-check-input" name="genderTypeRadio" id="genderTypeRadio1" />
                            <span className="form-check-label">Male</span>
                          </span>
                        </label>
                        

                        
                        <label className="form-control" htmlFor="genderTypeRadio2">
                          <span className="form-check">
                            <input type="radio" className="form-check-input" name="genderTypeRadio" id="genderTypeRadio2" checked />
                            <span className="form-check-label">Female</span>
                          </span>
                        </label>
                        

                        
                        <label className="form-control" htmlFor="genderTypeRadio3">
                          <span className="form-check">
                            <input type="radio" className="form-check-input" name="genderTypeRadio" id="genderTypeRadio3" />
                            <span className="form-check-label">Other</span>
                          </span>
                        </label>
                        
                      </div>
                    </div>
                  </div> */}


                {/*                   
                  <div className="row align-items-center">
                    <label htmlFor="disableAdCheckbox" className="col-sm-3 col-form-label form-label">Disable ads <span className="badge badge bg-primary text-uppercase ms-1">PRO</span></label>

                    <div className="col-sm-9">
                      
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="disableAdCheckbox" />
                        <label className="form-check-label" htmlFor="disableAdCheckbox">With your Pro account, you can disable ads across the site.</label>
                      </div>
                      
                    </div>
                  </div> */}

              </form>
            </div>


            <div className="card-footer pt-4">
              <div className="d-inline-block float-start">
                <a className="btn btn-white  btn-sm"
                  onClick={ChangePasswordModal}
                >Change password</a>
              </div>
              <div className="d-inline-block float-end">
                <a className="btn btn-secondary  btn-sm"
                  onClick={() => handleSubmit(updateProfile)()}>Save changes</a>
              </div>
            </div>


          </div>




        </div>
      )}

      <Modal
        size="md"
        onHide={CloseChangePasswordModal}
        show={showChangePassword}
        aria-labelledby="create-route-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="create-route-title">Change password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <div style={{ whiteSpace: "pre" }} id="password-form-errors" className="alert alert-danger d-none" role="alert">
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputEmail1">Old password</label>
              <input type="password" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                // {...register2("current_password", { required: true })}
                onChange={e => onTodoChangePassword('current_password', e.target.value)}
              />
              {errors2.current_password && <p className="text-danger d-block w-full">Please check old password</p>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputPassword">New password</label>
              <input type="password" className="form-control" id="exampleInputPassword"
                // {...register2("password", { required: true, minLength: 8 })}
                onChange={e => onTodoChangePassword('password', e.target.value)}
              />
              {errors2.password && <p className="text-danger d-block w-full">Please check new password</p>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputPasswordRepeat">Repeat new password</label>
              <input type="password" className="form-control" id="exampleInputPasswordRepeat"
                // {...register2("confirm_password", { required: true, validate: (val) => {
                //   if (watch('password') != val) {
                //     return "Your passwords do not match";
                //   }
                // },})}
                onChange={e => onTodoChangePassword('confirm_password', e.target.value)}
              />
              {errors2.confirm_password && <p className="text-danger d-block w-full">Please check new confirm password</p>}
            </div>
            <button className="btn btn-sm btn-white " onClick={CloseChangePasswordModal}>Close</button>
            <button
              disabled={passwordUpdating}
              className="btn btn-sm btn-secondary  float-end" onClick={() => updatePasswordHandle()} >Save changes</button>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PersonalInfoForm;