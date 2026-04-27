import vest, {validate, test, enforce} from "vest";
import {truncate} from "utils";

const registrationValidation = (data, field, formatMessage) => {
    return validate("RegistrationForm", () => {
        vest.only(field);

        [
            "name",
            "email",
            "password",
            "passwordConfirm",
            "mobile",
            "national_personal_number",
        ].forEach((elem) => {
            test(elem, "This field is required", () => {
                enforce(data[elem].toString()).isNotEmpty();
            });
        });

        const trimmedEmail = truncate(data.email.toString(), 15);
        test("email", trimmedEmail + "is not valid email address", () => {
            enforce(data.email.toString())
                .isNotEmpty()
                .matches(/[^@]+@[^.]+\..+/g);
        });

        test("passwordConfirm", "Passwords should be matching", () => {
            enforce(
                !data.password.toString().localeCompare(data.passwordConfirm.toString())
            ).isTruthy();
        });
        test("citizenship", "Please select an account citizenship", () => {
            enforce(data.citizenship !== null).isTruthy();
        });
        test("terms", "Please accept terms and conditions", () => {
            const r = data.terms === null || data.terms;
            enforce(r).isTruthy();
        });
        test("password", "Password should be atleast 8 characters long", () => {
            enforce(data.password.toString()).longerThanOrEquals(8);
        });
        test(
            "mobile",
            data.mobile + "is not valid phone number",

            () => {
                enforce(parseInt(data.mobile)).isNumeric();
            }
        );
    });
};

export default registrationValidation;
