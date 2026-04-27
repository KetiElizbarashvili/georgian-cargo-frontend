import vest, {validate, test, enforce} from "vest";
import {truncate} from "utils";

const emailSignupFormValidations = (data, field, formatMessage) => {
    return validate("EmailSignupForm", () => {
        vest.only(field);

        test("email", "This field is required", () => {
            enforce(data.email.toString()).isNotEmpty();
        });

        const trimmedEmail = truncate(data.email.toString(), 15);
        test("email", trimmedEmail + "is not valid email address", () => {
            enforce(data.email.toString())
                .isNotEmpty()
                .matches(/[^@]+@[^.]+\..+/g);
        });
    });
};

export default emailSignupFormValidations;
