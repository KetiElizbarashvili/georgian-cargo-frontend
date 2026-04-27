import { useValidation } from "hooks";
import React, { useState } from "react";
import { SpinnerButton, ValidatedInput } from "utils";
import emailSignupFormValidations from "./emailSignupFormValidations";

const EmailSignupForm = () => {
    const [email, setEmail] = useState("");
    const { errors, validate } = useValidation(emailSignupFormValidations);
    const onChange = ({ target: { value } }) => {
        setEmail(value);
        validate({ email: value }, "email");
    };
    const onSubmit = (e) => {
        e.preventDefault();
        validate({ email: email });
    };
    return (
        <form className="js-validate mb-3" onSubmit={onSubmit}>
            <div className="input-group mb-3">
                <ValidatedInput
                    disabled={true}
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    id="signup_Email"
                    placeholder="Your email"
                    onChange={onChange}
                    error={errors.email ? true : false}
                />
                <button className="btn btn-secondary" type="button" id="button-addon2">Subscribe</button>
            </div>
        </form >

        // <form className="js-validate mb-3" onSubmit={onSubmit}>
        //     <div className="form-row">
        //         <div className="col-sm-8 mb-2">
        //             <div className="js-form-message">
        //                 <label className="sr-only" htmlFor="signupSrEmail">
        //                     Your email
        //                 </label>
        //                 <div className="input-group">
        //                     <ValidatedInput
        //                         disabled={true}
        //                         type="email"
        //                         className="form-control"
        //                         name="email"
        //                         value={email}
        //                         id="signup_Email"
        //                         placeholder="Your email"
        //                         onChange={onChange}
        //                         error={errors.email ? true : false}
        //                     />
        //                 </div>
        //             </div>
        //             {errors.email && (
        //                 <label className="text-danger ms-2 font-weight-light text-xs">
        //                     {errors.email}
        //                 </label>
        //             )}
        //         </div>

        //         <div className="col-sm-4">
        //             <SpinnerButton
        //                 type="submit"
        //                 className="btn btn-secondary  btn-wide"
        //             >
        //                 Get Started
        //             </SpinnerButton>
        //         </div>
        //     </div>
        // </form>
    );
};
export default EmailSignupForm;
