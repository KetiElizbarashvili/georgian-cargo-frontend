import react, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import { ClientFooter } from "components/Footer";
import { useRequest } from "hooks";
import verifyCustomerEmail from "requests/verifyCustomerEmail";
import { AuthContext } from "context";
import { toast } from "react-toastify";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const VerifyCustomer = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('alert-warning');
  const [verifyCustomerEmailReq] = useRequest(verifyCustomerEmail);
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    verifyCustomerEmailReq({ token })
      .then((response) => {
        if (response.data.error === false) {
          setAuth({
            accessToken: response.data.access_token,
            isLoggedIn: true,
            accountType: "CLIENT",
            staff: response.data.staff,
            sourceCountry: response.data.staff.sourceCountry ?? ''
          });
          setVerificationStatus('alert-success');

          window.setTimeout(function () {
            window.location.href = "/dashboard/cargos";
          }, 5000);

        }
        else {
          console.log(response);
          setVerificationStatus('alert-danger');
          toast.error(response.data.message, toastOptions);
        }
      });
  }, []);
  return (

    <>
      <main id="content" className="mt-lg-0 mt-xl-8 mt-xxl-8 bg-light" style={{ minWidth: "308px" }}>
        <div className="container" style={{ paddingTop: "100px", paddingBottom: "150px" }}>
          <div className="row">
            <div className="col-12 text-center">
              <button className={"alert w-50 mx-auto alert-lg " + (verificationStatus)} type="button" disabled>
                <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span>

                {verificationStatus === 'alert-warning' && (
                  "You getting verified..."
                )}

                {verificationStatus === 'alert-success' && (
                  <>
                    Verification Success <br /> you will be redirected to Dashboard.
                  </>
                )}
                {verificationStatus === 'alert-danger' && (
                  "Verification Error"
                )}

              </button>
            </div>
          </div>
        </div>
        <ClientFooter />
      </main>

    </>
  );

};

export default VerifyCustomer;