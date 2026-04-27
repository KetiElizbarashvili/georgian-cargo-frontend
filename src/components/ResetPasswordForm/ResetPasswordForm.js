import React, { useState, useContext } from "react";
import { ValidatedInput } from "utils";
import useRequest from "hooks/useRequest";
import useValidation from "hooks/useValidation";
import SpinnerButton from "utils/SpinnerButton";
import { AuthContext } from "context";
import { ResetPasswordFormValidations } from "./ResetPasswordFormValidations.js";
import { history } from "components/History";
import { changePassword } from "../../requests/changePassword.js";
import { toast } from "react-toastify";

const ResetPasswordForm = (props) => {
  const [reseting, setReseting] = useState(false);
  const token = props.token;
  const [user, setUser] = useState({ newPassword: "", confirmPassword: "" });
  const [reset] = useRequest(changePassword);
  const { errors, validate, addErrors } = useValidation(
    ResetPasswordFormValidations
  );
  const { auth, setAuth } = useContext(AuthContext);
  const onChangeHandler = ({ target: { name, value } }) => {
    const newUser = { ...user, [name]: value };
    setUser(newUser);
    validate(newUser, name).catch((e) => {
      // console.log(e);
    });
  };
  const OnSubmitHandler = (e) => {
    e.preventDefault();
    //setUser({ ...user, token: token });

    const newUser = {};
    newUser.password = user.newPassword;
    newUser.confirm_password = user.confirmPassword;
    newUser.token = token;

    validate(user)
      .then((r) => {
        setReseting(true);
        reset(newUser)
          .then((response) => {
            if (response.data.error === false) {
              setAuth({
                accessToken: response.data.access_token,
                isLoggedIn: true,
                accountType: "CLIENT",
                staff: response.data.staff,
                sourceCountry: response.data.staff.sourceCountry ?? ''
              });
              toast.success("your password has succesfully changed!");
            }
            else {
              toast.error("Error has occured!");
            }
            //window.location.reload();
            setReseting(false);
          }).then(() => {
            history.push("/dashboard/cargos");
          })
          .catch((e) => {
            console.log(e);
            // if (e.response.status === 401) {
            //   const errors = {
            //     email: "Invalid email/password",
            //     password: "Invalid email/password",
            //   };
            //   addErrors(errors);
            // }
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <form className="js-validate m-5 mt-lg-4" onSubmit={OnSubmitHandler}>
      <div className="js-form-message form-group mb-3">
        <ValidatedInput
          label="New Password"
          type="password" //password
          name="newPassword"
          className="form-control"
          value={user.newPassword}
          placeholder="********"
          error={errors.newPassword}
          onChange={onChangeHandler}
        />
      </div>

      <div className="js-form-message form-group mb-3">
        <ValidatedInput
          label="Confirm Password"
          type="password" //password
          name="confirmPassword"
          className="form-control"
          value={user.confirmPassword}
          id="signinSrPassword"
          placeholder="********"
          error={errors.confirmPassword}
          onChange={onChangeHandler}
        />
      </div>

      <div className="row align-items-center mb-5">
        <div className="col-sm-6 mb-3 mb-sm-0"></div>

        <div className="col-sm-6 text-sm-end mt-2">
          <SpinnerButton
            type="submit"
            loading={reseting}
            className="btn btn-secondary transition-3d-hover"
          >
            Reset
          </SpinnerButton>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
