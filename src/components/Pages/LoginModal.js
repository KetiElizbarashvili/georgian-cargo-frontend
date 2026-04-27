import { EmailLoginForm, UsernameLoginForm } from "components/LoginForm";
import LoginPage from "components/LoginPage";
import { AuthContext } from "context";
import { useContext } from "react";
import { Redirect } from "react-router";
import RoutedModal from "utils/RoutedModal";

const LoginModal = (props) => {
  const {
    auth: { isLoggedIn, accountType },
  } = useContext(AuthContext);
  if (isLoggedIn && accountType === "CLIENT") {
    return <Redirect to={props.match.params[0]} />;
  } else {
    return (
      <RoutedModal
        header="Login"
        style={{ minWidth: "267px" }}
        back={props.match.params[0]}
        className="w-100 w-sm-100 w-md-50 "
      >
        <LoginPage />
        {/* <EmailLoginForm /> */}
        {/* <UsernameLoginForm /> */}
      </RoutedModal>
    );
  }
};

export default LoginModal;
