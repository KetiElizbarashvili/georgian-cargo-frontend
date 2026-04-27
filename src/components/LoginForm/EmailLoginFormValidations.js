import vest, { validate, test, enforce } from "vest";
import { truncate } from "utils";

export const emailLoginFormValidations = (data, field, formatMessage) => {
  return validate("EmailLoginForm", () => {
    vest.only(field);
    ["email", "password"].forEach((elem) => {
      test(elem, "This field is required", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
    });
    const trimmedEmail = truncate(data.email.toString(), 15);
    test("email", trimmedEmail.concat(" is not valid email address"), () => {
      enforce(data.email.toString())
        .isNotEmpty()
        .matches(/[^@]+@[^.]+\..+/g);
    });
  });
};
