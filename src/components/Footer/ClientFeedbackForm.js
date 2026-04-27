import { useValidation } from "hooks";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SingleSelect, ValidatedInput, countries } from "utils";
import clientFeedbackFormValidations from "./clientFeedbackFormValidations";

const ClientFeedbackForm = () => {
    const [feedback, setFeedback] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        company: "",
        jobTitle: "",
        description: "",
    });
    const { errors, validate } = useValidation(clientFeedbackFormValidations);
    const onChangeHandler = ({ target: { name, value } }) => {
        const newFeedback = { ...feedback, [name]: value };
        setFeedback(newFeedback);
        validate(newFeedback, name).catch((e) => { });
    };
    const callback = (country, i) => (
        <option key={i} value={country.value}>
            {country.name}
        </option>
    );

    const onSubmitHandler = (e) => {
        e.preventDefault();
        // console.log(feedback);
        validate(feedback)
            .then((r) => { })
            .catch((e) => {
                // console.log(errors);
            });
    };
    return (
        <form className="js-validate card p-5" onSubmit={onSubmitHandler}>
            <div className="mb-4">
                <h3>Drop us a message</h3>
            </div>

            <div className="form-row mx-n2">
                <div className="col-md-6 px-2 mb-3">
                    <label className="sr-only">First name</label>

                    <div className="js-form-message">
                        <div className="input-group">
                            <ValidatedInput
                                type="text"
                                className="form-control w-100 w-100"
                                name="firstName"
                                placeholder="First name"
                                value={feedback.firstName}
                                error={errors.firstName}
                                onChange={onChangeHandler}
                            // required
                            // data-msg="Please enter your first name."
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 px-2 mb-3">
                    <label className="sr-only">Last name</label>

                    <div className="js-form-message">
                        <div className="input-group">
                            <ValidatedInput
                                type="text"
                                className="form-control w-100"
                                name="lastName"
                                placeholder="Last name"
                                value={feedback.lastName}
                                error={errors.lastName}
                                onChange={onChangeHandler}
                            // required
                            // data-msg="Please enter your last name."
                            />
                        </div>
                    </div>
                </div>

                <div className="w-100"></div>

                <div className="col-md-6 px-2 mb-3">
                    <label className="sr-only">Country</label>

                    <div className="js-form-message">
                        <div className="input-group">
                            <SingleSelect
                                className="form-control w-100 custom-select text-muted"
                                // required
                                // data-msg="Please select country."
                                name="country"
                                placeholder="Select country"
                                options={countries}
                                onChange={onChangeHandler}
                                value={feedback.country}
                                error={errors.country}
                                callback={callback}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 px-2 mb-3">
                    <label className="sr-only">Email address</label>

                    <div className="js-form-message">
                        <div className="input-group">
                            <ValidatedInput
                                type="text"
                                className="form-control w-100"
                                name="email"
                                id="feedbackEmail"
                                placeholder="Email Address"
                                value={feedback.email}
                                error={errors.email}
                                onChange={onChangeHandler}
                            // required
                            // data-msg="Please enter a valid email address."
                            />
                        </div>
                    </div>
                </div>

                <div className="w-100"></div>

                <div className="col-md-6 px-2 mb-3">
                    <label className="sr-only">Company</label>

                    <div className="js-form-message">
                        <div className="input-group">
                            <ValidatedInput
                                type="text"
                                className="form-control w-100"
                                name="company"
                                placeholder="Company"
                                value={feedback.company}
                                error={errors.company}
                                onChange={onChangeHandler}
                            // aria-label="Company"
                            // required
                            // data-msg="Please enter company name."
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 px-2 mb-3">
                    <label className="sr-only">Job title</label>

                    <div className="js-form-message">
                        <div className="input-group">
                            <ValidatedInput
                                type="text"
                                className="form-control w-100"
                                name="jobTitle"
                                placeholder="Job title"
                                value={feedback.jobTitle}
                                error={errors.jobTitle}
                                onChange={onChangeHandler}
                            // aria-label="Job title"
                            // required
                            // data-msg="Please enter a job title."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <label className="sr-only">How can we help you?</label>

                <div className="js-form-message input-group">
                    <textarea
                        className="form-control w-100"
                        rows="4"
                        name="description"
                        placeholder="Hi there, I would like to ..."
                        value={feedback.description}
                        error={errors.description}
                        onChange={onChangeHandler}
                    // required
                    // data-msg="Please enter a reason."
                    ></textarea>
                </div>
            </div>
            <div className="js-form-message mb-3">
                <div className="custom-control custom-checkbox d-flex align-items-center text-muted">
                    <ValidatedInput
                        type="checkbox"
                        className="custom-control-input"
                        id="feedbackTermsCheckbox"
                        name="termsCheckbox"
                        checked={feedback.termsCheckbox}
                        onChange={() =>
                            setFeedback({
                                ...feedback,
                                termsCheckbox: !feedback.termsCheckbox,
                            })
                        }
                    // required
                    // data-msg="Please accept our Terms and Conditions."
                    />
                    <label
                        className="custom-control-label"
                        htmlFor="feedbackTermsCheckbox"
                    >
                        <small>
                            <Link className="link-underline" to="/terms-and-conditions">
                                I agree to the Terms and Conditions
                            </Link>
                        </small>
                    </label>
                </div>
                {errors.termsCheckbox && (
                    <label className="text-danger ms-2 font-weight-light text-xs">
                        {errors.termsCheckbox}
                    </label>
                )}
            </div>
            <div className="js-form-message mb-5">
                <div className="custom-control custom-checkbox d-flex align-items-center text-muted">
                    <ValidatedInput
                        type="checkbox"
                        className="custom-control-input"
                        id="newsletterCheckbox"
                        name="newsletterCheckbox"
                        checked={feedback.newsletterCheckbox}
                        onChange={() =>
                            setFeedback({
                                ...feedback,
                                newsletterCheckbox: !feedback.newsletterCheckbox,
                            })
                        }
                    // required
                    // data-msg="Please accept our Terms and Conditions."
                    />
                    <label className="custom-control-label" htmlFor="newsletterCheckbox">
                        <small>I want to receive Akido's Newsletters</small>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-success  btn-wide transition-3d-hover"
            >
                Submit
            </button>
        </form>
    );
};
export default ClientFeedbackForm;
