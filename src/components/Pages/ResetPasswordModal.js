import { EmailLoginForm, UsernameLoginForm } from "components/LoginForm";
import { AuthContext } from "context";
import { useContext } from "react";
import { Redirect } from "react-router";
import RoutedModal from "utils/RoutedModal";
import ResetPasswordForm from "components/ResetPasswordForm/ResetPasswordForm";
import { useParams } from "react-router-dom";

const ResetPasswordModal = (props) => {
  const { token } = useParams();
  const {
    auth: { isLoggedIn, accountType },
  } = useContext(AuthContext);
  if (isLoggedIn && accountType === "CLIENT") {
    return <Redirect to={props.match.params[0]} />;
  } else {
    return (
      <RoutedModal
        header="Reset Password"
        back={props.match.params[0]}
        className="col-10 col-md-6 col-lg-4"
      >
        {/* <EmailLoginForm /> */}
        <ResetPasswordForm token={token} />
      </RoutedModal>
    );
  }
};

export default ResetPasswordModal;
