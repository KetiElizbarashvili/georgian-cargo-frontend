import vest, { validate, test, enforce } from "vest";
import { truncate } from "utils";
import { isEmail } from "validator";

//makes isEmail useable by enfore, wihout this vest
//can't acces isEmail and you are show 'isEmail is imported but
//value never used' warning
enforce.extend({ isEmail });

const registrationValidation = (data, field, formatMessage) => {
  return validate("RegistrationForm", () => {
    vest.only(field);

    //makes sure any of the fields are not empty
    [
      "name",
      "email",
      "username",
      "password",
      "confirm_password",
      "phone",
    ].forEach((elem) => {
      test(elem, "This field can't be empty", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
    });

    //makes sure any of the fileds don't have empty spaces not in the end
    //or beginning and not in the middle, that's why regex is used instead of trim()
    //becuase trim only removes whitespaces from end and start
    //reason forEach loop is written seperatly here and this validation is not applied
    //in upper forEach loop is becacuse we want to exclude fullname filed because
    //we want user to use spaces when providin fullname. e.g. "John Doe"
    ["email", "username", "password", "confirm_password", "phone"].forEach(
      (elem) => {
        test(elem, "field can't contain empty spaces", () => {
          enforce(data[elem].toString().replace(/\s/g, "").length).equals(
            data[elem].toString().length
          );
        });
      }
    );
    //makes sure fullname doesn't start or end with empty spaces
    //idea is we want user to enter "John Doe" but not "  Jo hn   D oe"
    test("name", "this field can't start or end with empty spaces", () => {
      enforce(data["name"].toString().trim().length).equals(
        data["name"].toString().length
      );
    });
    //makes sure username is longer than 4 characters
    test("username", "Username needs to be 7 characters or shorter", () => {
      enforce(data["username"].toString()).shorterThanOrEquals(7);
    });
    //makes sure password is longer than 8 characters
    test("password", "Password needs to be 8 characters or longer", () => {
      enforce(data["password"].toString()).longerThanOrEquals(8);
    });
    //makes sure confirm_password and password fields contain same input
    test(
      "confirm_password",
      "this field need to be same as password field",
      () => {
        enforce(data["confirm_password"].toString()).equals(data["password"]);
      }
    );
    //makes sure there are no numbers inside fullname field
    test("name", "this field can't contain any digits", () => {
      enforce(data["name"].toString()).notMatches("[0-9]");
    });

    test("name", "needs to be 32 characters or shorter", () => {
      enforce(data["name"].toString()).shorterThanOrEquals(32);
    });
    //makes sure phone filed only contains digits
    test("phone", "this field can't contain letters", () => {
      enforce(data["phone"].toString()).matches("^[0-9 ]*$");
    });
    test("username", "this field can only contain letters and numbers.", () => {
      enforce(data["username"].toString()).matches("^[0-9a-z]*$");
    });
    //email vaildation
    test("email", "please use correct email format", () => {
      enforce(data["email"].toString()).isEmail();
    });
  });
};

export default registrationValidation;
