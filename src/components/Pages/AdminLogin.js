import { Alert, Col, Container, Row } from "react-bootstrap";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { useRequest } from "../../hooks";
import LoginRequest from "../../routes/LoginRequest";
import UsernameLoginForm from "../UsernameLoginForm/UsernameLoginForm";
import { AuthContext } from "../../context";

function AdminLogin() {
  const [login, isLoggingIn] = useRequest(LoginRequest);
  const [hasError, setHasError] = useState(false);
  const { setAuth } = useContext(AuthContext);

  const history = useHistory();
  const handleLogin = ({ username, password }) => {
    login({ username, password })
      .then((response) => {
        // console.log(response.data.access_token, "admin acess token");
        setAuth({
          accessToken: response.data.access_token,
          isLoggedIn: true,
          accountType: "ADMIN",
          routes: response.data.staff.routes || [],
          accountId: response.data.staff.id,
          staff: {
            id: response.data.staff.id,
            username: response.data.staff.username,
            privileges: response.data.staff.privileges,
          }
        });
        history.push("/manage");
      })
      .catch((e) => {
        setHasError(true);
      });
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>Admin login</h1>
            <span>Please enter your credentials below</span>
          </Col>
        </Row>
        <Row>
          <Col>
            {hasError && (
              <Alert variant={"danger"}>Wrong username or password</Alert>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <UsernameLoginForm
              onFormSubmit={handleLogin}
              disabled={isLoggingIn}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminLogin;
