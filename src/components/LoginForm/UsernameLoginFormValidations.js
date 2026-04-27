import vest, { validate, test, enforce } from "vest";

export const usernameLoginFormValidations = (data, field) => {
  return validate("UsernameLoginForm", () => {
    vest.only(field);

    ["username", "password"].forEach((elem) => {
      test(elem, "This field is required", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
    });
    test("password", "Password should be atleast 8 characters long", () => {
      enforce(data.password.toString()).longerThanOrEquals(8);
    });
  });
};
