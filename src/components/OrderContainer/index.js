import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm, Controller, useFormContext } from "react-hook-form";
import countryListAllIsoData from "utils/CountryList";
import Select from 'react-select';
import { flagEmoji } from "utils/FlagEmoji";
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


const OrderContainer = ({ setShowOrderContainerForm, showOrderContainerForm }) => {
  const [contactUsReq] = useRequest(contactUs);
  const { setValue, reset, register, trigger, control, handleSubmit, formState: { errors } } = useForm();
  const [messageIsSending, setMessageIsSending] = useState(false);
  const [contactObj, setContactObj] = useState(
    {
      enquery: 'Container',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      body: '',
      ContainerFrom: '',
      ContainerTo: '',
    }
  );
  useEffect(() => {
    console.log(contactObj);
  }, [contactObj]);

  const sendContactFormMessage = () => {
    setMessageIsSending(true);
    let co = JSON.parse(JSON.stringify(contactObj));
    co.body = `From: ${countryListAllIsoData.find(it => it.value === co.ContainerFrom).label}
    \n
    To: ${countryListAllIsoData.find(it => it.value === co.ContainerTo).label}
    \n
    ${co.body}`;
    contactUsReq(co).then((res) => {
      toast.success("We received your message and will reply soon.", toastOptions);
      setMessageIsSending(false);
      setContactObj({
        enquery: 'Container',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        body: '',
        ContainerFrom: '',
        ContainerTo: '',
      });
    }).catch((e) => {
      toast.error("Message was not sent.", toastOptions);
      setMessageIsSending(false);
    });
  };


  return (
    <>
      <Modal
        size="lg"
        onHide={() => setShowOrderContainerForm(false)}
        show={showOrderContainerForm}
        aria-labelledby="create-route-title"
        centered
        className="p-0"
      >
        <Modal.Header closeButton className="p-2">
        </Modal.Header>

        <Modal.Body className="p-0">
          <>


            <div className="col-12">
              <div className="ps-lg-5">
                <div className="card">
                  <div className="card-header border-bottom text-center">
                    <h3 className="card-header-title">Order Container</h3>
                  </div>

                  <div className="card-body">
                    <>
                      <div className="row gx-3">

                        <div className="col-sm-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="CountryFrom">Country From</label>

                            <Controller
                              control={control}
                              className={"form-control form-control-sm"}
                              name="ContainerFrom"
                              defaultValue={contactObj?.ContainerFrom}
                              render={({ field: { onChange, value, name, ref } }) => (
                                <Select
                                  {...register("ContainerFrom", {
                                    required: {
                                      value: true,
                                      message: "This field is required"
                                    }
                                  })}
                                  onChange={(val) => {
                                    setContactObj({ ...contactObj, ContainerFrom: val.value });
                                    setValue("ContainerFrom", val.value);
                                  }}
                                  name='container_to'
                                  value={countryListAllIsoData.find((c) => c.value === contactObj.ContainerFrom)}
                                  styles={{
                                    input: (styles) => ({
                                      ...styles,
                                      paddingTop: '.50rem!important',
                                      paddingBottom: '.50rem!important',
                                      paddingLeft: '1rem!important',
                                      fontSize: '1rem!important',
                                      borderRadius: '.3125rem!important'
                                    })
                                  }}
                                  options={countryListAllIsoData.map(
                                    item => ({ label: flagEmoji(item.value) + ' ' + item.label, value: item.value })
                                  )}
                                />
                              )}
                            />

                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="CountryTo">Country To</label>

                            <Controller
                              control={control}
                              className={"form-control form-control-sm"}
                              name="ContainerTo"
                              defaultValue={contactObj?.ContainerTo}
                              render={({ field: { onChange, value, name, ref } }) => (
                                <Select
                                  {...register("ContainerTo", {
                                    required: {
                                      value: true,
                                      message: "This field is required"
                                    }
                                  })}
                                  onChange={(val) => {
                                    setContactObj({ ...contactObj, ContainerTo: val.value });
                                    setValue("ContainerTo", val.value);
                                  }}
                                  name='container_to'
                                  value={countryListAllIsoData.find((c) => c.value === contactObj.ContainerTo)}
                                  styles={{
                                    input: (styles) => ({
                                      ...styles,
                                      paddingTop: '.50rem!important',
                                      paddingBottom: '.50rem!important',
                                      paddingLeft: '1rem!important',
                                      fontSize: '1rem!important',
                                      borderRadius: '.3125rem!important'
                                    })
                                  }}
                                  options={countryListAllIsoData.map(
                                    item => ({ label: flagEmoji(item.value) + ' ' + item.label, value: item.value })
                                  )}
                                />
                              )}
                            />

                          </div>
                        </div>

                        <hr />
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
                <span class="text-danger font-size-1">{'This field is required.'}</span>
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
                <span class="text-danger font-size-1">{'This field is required.'}</span>
              )}
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="hireUsFormPhone">Phone <span className="form-label-secondary">(Optional)</span></label>
                            <PhoneInput
                country={'ge'}
                inputClass={"form-control"}
                inputStyle={{borderColor: errors.phone? "#ed4c78" : "", width:"100%", border: ".0625rem solid rgba(33, 50, 91, .1)", padding: "10.5px 14px 10.5px 60px"}}
                value={contactObj.phone}
                error={errors.phone}
                id="signupMobile"
               onChange={(e) => setContactObj({ ...contactObj, phone: e })}

              />
              {errors.phone && (
                <span class="text-danger font-size-1">{errors.phone}</span>
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
                          onChange={(e) => setContactObj({
                            ...contactObj,
                            body: e.target.value
                          })}
                        ></textarea>
                         {errors.body && (
                <span class="text-danger font-size-1">{'This field is required.'}</span>
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

          </>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default OrderContainer;