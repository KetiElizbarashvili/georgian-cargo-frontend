import vest, { validate, test, enforce } from "vest";
import { truncate } from "utils";

export const ResetPasswordFormValidations = (data, field, formatMessage) => {
  return validate("ResetPasswordForm", () => {
    vest.only(field);
    ["newPassword", "confirmPassword"].forEach((elem) => {
      test(elem, "This field is required", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
    });
    test("confirmPassword", "both passwords must be the same", () => {
      enforce(data["confirmPassword"].toString()).equals(data["newPassword"]);
    });
    test("newPassword", "Password needs to be 8 characters or longer", () => {
      enforce(data["newPassword"].toString()).longerThanOrEquals(8);
    });
    // const trimmedEmail = truncate(data.email.toString(), 15);
    // test("email", trimmedEmail.concat("is not valid email address"), () => {
    //   enforce(data.email.toString())
    //     .isNotEmpty()
    //     .matches(/[^@]+@[^.]+\..+/g);
    // });
  });
};
