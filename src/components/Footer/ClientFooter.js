import React, { useState } from "react";
import ClientFeedbackForm from "./ClientFeedbackForm";
import { Link } from "react-router-dom";
import { flagEmoji } from "../../utils/FlagEmoji";
import ContactForm from "components/ContactUs/ContactForm";
import { Modal } from "react-bootstrap";
import OrderContainer from "components/OrderContainer";

const ClientFooter = ({ feedback }) => {
  const [choosenEnquery, setChoosenEnquery] = useState('General');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOrderContainerForm, setShowOrderContainerForm] = useState(false);

  const handleContactFormPopup = (enquery) => {
    setChoosenEnquery(enquery);
    setShowContactForm(true);
  };

  return (
    <>

      <footer className="bg-primary mt-4">
        <div className="container pb-1 pb-lg-5">
          <div className="row content-space-t-1">

            <div className="text-center text-sm-center text-md-start text-lg-start text-xl-start text-xxl-start col-12 col-sm-12 col-md-6 mb-7 col-lg-3 col-xl-3 col-xxl-3 mb-sm-0 mb-md-4 mb-sm-4">
              <h5 className="text-white mb-3 pb-2" style={{ borderBottom: "1px solid #2bb1ea" }}>Terms Of Use</h5>

              <ul className="list-unstyled list-py-1 mb-0">
                <li><a className="link-sm link-light" target="_blank" href="https://drive.google.com/file/d/11QGFmVGK__noTfeE9N61cSATQIydt7hR/view">Terms And Conditions <i className="bi-box-arrow-up-right small ms-1"></i></a></li>
                <li><Link className="link-sm link-light" to="/privacy-policy">Privacy Policy</Link></li>
                <li><a className="link-sm link-light" href="#">Refund Policy</a></li>
                <li><a className="link-sm link-light" href="#">Payment Security</a></li>
              </ul>
            </div>

            <div className="text-center text-sm-center text-md-start text-lg-start text-xl-start text-xxl-start col-12 col-sm-12 mb-7 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-md-4 mb-sm-4">
              <h5 className="text-white mb-3 pb-2" style={{ borderBottom: "1px solid #2bb1ea" }}>Service & Updates</h5>

              <ul className="list-unstyled list-py-1 mb-0">
                <li><a className="link-sm link-light" href="#">Parcel Delivery</a></li>
                <li><a className="link-sm link-light" href="#">Freight Services</a></li>
                <li><a role="button" className="link-sm link-light" onClick={() => setShowOrderContainerForm(true)}>Order Container <span className="badge bg-warning text-dark rounded-pill ms-1">New</span></a></li>
                <li><a role="button" className="link-sm link-light" onClick={() => handleContactFormPopup('Franchise')}>Franchise Enquery</a></li>
                <li><a role="button" className="link-sm link-light" onClick={() => handleContactFormPopup('Agent')}>Become Agent</a></li>
                <li><Link className="link-sm link-light" to="/home#booking">Booking <span className="badge bg-warning text-dark rounded-pill ms-1">New</span></Link></li>
                <li><Link className="link-sm link-light" to="/home#tracking">Tracking</Link></li>
              </ul>
            </div>

            <div className="text-center text-sm-center text-md-start text-lg-start text-xl-start text-xxl-start col-12 col-sm-12 mb-7 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-md-4 mb-sm-4">
              <h5 className="text-white mb-3 pb-2" style={{ borderBottom: "1px solid #2bb1ea" }}>About Us</h5>

              <ul className="list-unstyled list-py-1 mb-0">
                <li><Link to="/about" className="link-sm link-light" href="#">About</Link></li>
              </ul>
            </div>

            <div className="text-start col-12 col-sm-12 mb-7 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-lg-0">
              <h5 className="text-white mb-3 pb-2" style={{ borderBottom: "1px solid #2bb1ea" }}><></>Contact Us</h5>
              <ul className="list-unstyled list-py-1">
                <li><Link className="link-sm link-light" to="/contact-us"><i className="bi bi-person-lines-fill me-1"></i> Contact Form</Link></li>
                <li><a className="link-sm link-light" href="mailto:admin@georgiancargo.co.uk"><i className="bi bi-envelope-fill me-1"></i> admin@georgiancargo.co.uk</a></li>
                <li>
                  <a className="link-sm link-light" href="https://goo.gl/maps/Pzdwn7sdzSNy4zAW7" target="_blank"><i className="bi-geo-alt-fill me-1"></i>&nbsp;25 Nadira Khosharauli Street, street,  0119, Tbilisi, Georgia</a>
                  <div className=""> <a className="link-sm link-light" href="tel:+995322050884"><i className="bi bi-telephone-fill me-1"></i> +995 3 22 050 884</a></div>
                  <div className=""> <a className="link-sm link-light" href="tel:+99579885826"><i className="bi bi-telephone-fill me-1"></i> +99 579 885 826</a></div>

                </li>

                <li>
                  <a className="link-sm link-light" href="https://g.page/GergianCargo?share" target="_blank"><i className="bi-geo-alt-fill me-1"></i>&nbsp;Georgian Cargo, (Safe Store), 105 Mayes Rd, London N22 6UP</a>
                  <div className=""><a className="link-sm link-light" href="tel:+442036427952"><i className="bi bi-telephone-fill me-1"></i> +44 203 6427 952</a></div>
                  <div className=""><a className="link-sm link-light" href="tel:+447398295045"><i className="bi bi-telephone-fill me-1"></i> +44 739 8295 045</a></div>
                </li>


              </ul>
              <br />

              <ul className="list-unstyled list-py-0">
                <li>
                  <div className="">{flagEmoji('IE')} <a className="link-sm link-light" href="tel:+3530818000166">+353 08 1800 0166</a></div>
                </li>
                <li>
                  <div className="">{flagEmoji('SE')} <a className="link-sm link-light" href="tel:+46844687232">+46 8 4468 7232</a></div>
                </li>
              </ul>
              <div className="col-sm-auto">
                <ul className="list-inline mb-0 mt-2">
                  <span className="text-light">Follow us: </span>
                  <li className="list-inline-item">
                    <a className="btn btn-soft-light btn-sm btn-icon" target="_blank" href="https://www.facebook.com/georgiancargoworld/">
                      <i className="bi-facebook" style={{ fontSize: "20px" }}></i>
                    </a>
                  </li>

                  {/* <li className="list-inline-item">
                  <a className="btn btn-soft-light btn-xs btn-icon" href="#">
                    <i className="bi-google"></i>
                  </a>
                </li>

                <li className="list-inline-item">
                  <a className="btn btn-soft-light btn-xs btn-icon" href="#">
                    <i className="bi-twitter"></i>
                  </a>
                </li>

                 <li className="list-inline-item">
                  <div className="btn-group">
                    <button type="button" className="btn btn-soft-light btn-xs dropdown-toggle" id="footerDarkSelectLanguage" data-bs-toggle="dropdown" aria-expanded="false" data-bs-dropdown-animation>
                      <span className="d-flex align-items-center">
                        <img className="avatar avatar-xss avatar-circle me-2" src="../assets/vendor/flag-icon-css/flags/1x1/us.svg" alt="Image description" width="16" />
                        <span>English (US)</span>
                      </span>
                    </button>

                    <div className="dropdown-menu" aria-labelledby="footerDarkSelectLanguage">
                      <a className="dropdown-item d-flex align-items-center active" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="../assets/vendor/flag-icon-css/flags/1x1/us.svg" alt="Image description" width="16" />
                        <span>English (US)</span>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="../assets/vendor/flag-icon-css/flags/1x1/de.svg" alt="Image description" width="16" />
                        <span>Deutsch</span>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="../assets/vendor/flag-icon-css/flags/1x1/es.svg" alt="Image description" width="16" />
                        <span>Español</span>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <img className="avatar avatar-xss avatar-circle me-2" src="../assets/vendor/flag-icon-css/flags/1x1/cn.svg" alt="Image description" width="16" />
                        <span>中文 (繁體)</span>
                      </a>
                    </div>
                  </div>
                </li> */}
                </ul>
              </div>
            </div>

          </div>

          <div className="border-top border-white-10 my-2"></div>

          <div className="row mb-7">



          </div>

          <div className="w-md-85 text-lg-center mx-lg-auto">
            <p className="text-white-50 small text-center">© Georgian Cargo. 2009-{new Date().getFullYear()}. All rights reserved.</p>
            <p className="text-white-50 small text-center">When you visit or interact with our sites, services or tools, we or our authorised service providers may use cookies for storing information to help provide you with a better, faster and safer experience and for marketing purposes.</p>
          </div>
        </div>
      </footer>

      <Modal
        size="lg"
        onHide={() => setShowContactForm(false)}
        show={showContactForm}
        aria-labelledby="create-route-title"
        centered
        className="p-0"
      >
        <Modal.Header closeButton className="p-2">
        </Modal.Header>

        <Modal.Body className="p-0">
          <>
            <ContactForm selectedEnquery={choosenEnquery} />
          </>
        </Modal.Body>
      </Modal>
      <OrderContainer
        showOrderContainerForm={showOrderContainerForm}
        setShowOrderContainerForm={setShowOrderContainerForm} />
    </>
  );
};

export default ClientFooter;
