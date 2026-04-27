import vest, {validate, test, enforce} from "vest";
import {truncate} from "utils";

const clientFeedbackFormValidations = (data, field, formatMessage) => {
    return validate("ClientFeedbackForm", () => {
        vest.only(field);

        [
            "firstName",
            "lastName",
            "email",
            "country",
            "company",
            "jobTitle",
            "description",
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

        test("termsCheckbox", "Please accept terms and conditions", () => {
            const r = data.terms === null || data.terms;
            enforce(r).isTruthy();
        });
    });
};

export default clientFeedbackFormValidations;
