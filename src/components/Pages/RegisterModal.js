import RegisterPage from "components/RegisterPage";
import { RegistrationForm } from "components/RegistrationForm";
import { AuthContext } from "context";
import { useContext, useState } from "react";
import { Redirect } from "react-router";
import RoutedModal from "utils/RoutedModal";
const RegisterModal = (props) => {
  const [form, setForm] = useState([]);

  const {
    auth: { isLoggedIn, accountType },
  } = useContext(AuthContext);

  if (isLoggedIn && accountType === "CLIENT") {
    return <Redirect to={props.match.params[0]} />;
  } else {
    return (
      <RoutedModal
        header="Welcome to Georgian Cargo"
        back={props.match.params[0]}
        className="w-100 w-sm-100 w-md-75 "
      >
        <RegisterPage />
        {/* <RegistrationForm /> */}
      </RoutedModal>
    );
  }
};

export default RegisterModal;
