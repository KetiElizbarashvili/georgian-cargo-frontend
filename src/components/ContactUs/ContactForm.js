import React, { useState } from "react";
import 'leaflet/dist/leaflet.css';
import { useForm } from "react-hook-form";
import { useRequest } from 'hooks';
import contactUs from "requests/contactUs";
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const ContactForm = ({ selectedEnquery }) => {
  const [contactUsReq] = useRequest(contactUs);
  const { setValue, reset, register, trigger, control, handleSubmit, formState: { errors } } = useForm();
  const [messageIsSending, setMessageIsSending] = useState(false);
  const [contactObj, setContactObj] = useState(
    {
      enquery: selectedEnquery ?? 'General',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      body: ''
    }
  );

  const sendContactFormMessage = () => {
    setMessageIsSending(true);
    contactUsReq(contactObj).then((res) => {
      toast.success("We received your message and will reply soon.", toastOptions);
      setMessageIsSending(false);
      setContactObj({
        enquery: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        body: ''
      });
    }).catch((e) => {
      toast.error("Message was not sent.", toastOptions);
      setMessageIsSending(false);
    });
  };


  return (
    <div className="col-12">
      <div className="ps-lg-5">
        <div className="card">
          <div className="card-header border-bottom text-center">
            <h3 className="card-header-title">Contact Us</h3>
          </div>

          <div className="card-body">
            <>
              <div className="row gx-3">
                <div className="col-sm-12 mb-3">
                  <select
                    onChange={(e) => setContactObj({ ...contactObj, enquery: e.target.value })}
                    value={contactObj.enquery} className="form-select form-select-lg mb-3 w-100" aria-label=".form-select-lg example">
                    <option value="General">General</option>
                    <option value="Booking">Booking</option>
                    <option value="Franchise">Franchise</option>
                    <option value="Agent">Agent</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="hireUsFormFirstName">First name</label>
                    <input type="text"
                      className={"form-control form-control-lg " + (errors.firstName ? 'border rounded border-danger' : '')}
                      name="hireUsFormNameFirstName" id="hireUsFormFirstName" placeholder="First name" aria-label="First name"
                      value={contactObj.firstName}
                      {...register("firstName", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 25,
                          message: "Too Many Characters. maximum: 25"
                        }
                      })}
                      onChange={(e) => setContactObj({ ...contactObj, firstName: e.target.value })}
                    />
 {errors.firstName && (
                <span class="text-danger font-size-1">{errors.firstName.message}</span>
              )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="hireUsFormLasttName">Last name</label>
                    <input type="text"
                      className={"form-control form-control-lg " + (errors.lastName ? 'border rounded border-danger' : '')}
                      name="hireUsFormNameLastName" id="hireUsFormLasttName" placeholder="Last name" aria-label="Last name"
                      value={contactObj.lastName}
                      {...register("lastName", {
                        required: {
                          value: false,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 25,
                          message: "Too Many Characters. maximum: 25"
                        }
                      })}
                      onChange={(e) => setContactObj({ ...contactObj, lastName: e.target.value })}
                    />
                     {errors.lastName && (
                <span class="text-danger font-size-1">{errors.lastName.message}</span>
              )}
                  </div>
                </div>
              </div>

              <div className="row gx-3">
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="hireUsFormWorkEmail">Email address</label>
                    <input type="email"
                      className={"form-control form-control-lg " + (errors.email ? 'border rounded border-danger' : '')} name="hireUsFormNameWorkEmail" id="hireUsFormWorkEmail" placeholder="email@site.com" aria-label="email@site.com"
                      value={contactObj.email}
                      {...register("email", {
                        required: {
                          value: true
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "invalid email address"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={(e) => setContactObj({ ...contactObj, email: e.target.value })}
                    />
            {errors.email && (
                <span class="text-danger font-size-1">{errors.email.message}</span>
              )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="hireUsFormPhone">Phone <span className="form-label-secondary">(Optional)</span></label>
                    <PhoneInput
                country={'ge'}
                inputClass={"form-control form-control-lg " + (errors.phone ? 'border rounded border-danger' : '')}
                inputStyle={{width:"100%", border: ".0625rem solid rgba(33, 50, 91, .1)", padding: "10.5px 14px 10.5px 60px"}}
                value={contactObj.phone}
                name="hireUsFormNamePhone"
                id="hireUsFormPhone"
                {...register("phone", {
                  required: {
                    value: false,
                    message: "This field is required"
                  },
                  maxLength: {
                    value: 64,
                    message: "Too Many Characters. maximum: 64"
                  }
                })}
                onChange={(e) => setContactObj({ ...contactObj, phone: e })}
              />
                        {errors.phone && (
                <span class="text-danger font-size-1">{errors.phone.message}</span>
              )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="hireUsFormDetails">Details</label>
                <textarea
                  className={"form-control form-control-lg " + (errors.body ? 'border rounded border-danger' : '')}
                  name="hireUsFormNameDetails" id="hireUsFormDetails" placeholder="Tell us about your ..." aria-label="Tell us about your ..." rows="4"
                  value={contactObj.body}
                  {...register("body", {
                    required: {
                      value: true,
                      message: "This field is required"
                    },
                    maxLength: {
                      value: 999,
                      message: "Too Many Characters. maximum: 999"
                    }
                  })}
                  onChange={(e) => setContactObj({ ...contactObj, body: e.target.value })}
                ></textarea>
                  {errors.body && (
                <span class="text-danger font-size-1">{errors.body.message}</span>
              )}
              </div>

              <div className="d-grid text-center">
                <button className="btn  btn-secondary btn-lg"
                  onClick={() => handleSubmit(sendContactFormMessage)()}
                  disabled={messageIsSending}
                >

                  {!messageIsSending && (
                    "Send inquiry"
                  )}
                  {messageIsSending && (
                    <i className="fas fa-spinner fa-spin"></i>
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <small className="form-text">We'll get back to you soon.</small>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;