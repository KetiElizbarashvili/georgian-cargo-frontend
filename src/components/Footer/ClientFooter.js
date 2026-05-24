import React, { useState } from "react";
import { Link } from "react-router-dom";
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
      <footer className="gc-footer mt-4">

        {/* ── main grid ── */}
        <div className="container gc-footer__body">
          <div className="row g-4">

            {/* Brand + social */}
            <div className="col-12 col-lg-4">
              <div className="gc-footer__brand">
              <img
                src="/logo2.png"
                alt="Georgian Cargo"
                width="168"
                height="52"
                className="gc-footer__brand-logo"
              />
              <span className="gc-footer__brand-badge">Global Delivery Network</span>
              <p className="gc-footer__tagline">
                Connecting Georgia with the world — fast, safe, and affordable.
              </p>
              <div className="gc-social mt-3">
                <span className="gc-social__label">Follow us</span>
                <div className="gc-social__icons mt-2">
                  <a className="gc-social__btn gc-social__btn--fb" href="https://www.facebook.com/georgiancargoworld/" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                  </a>
                  <a className="gc-social__btn gc-social__btn--ms" href="https://m.me/georgiancargoworld" target="_blank" rel="noreferrer" aria-label="Messenger">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                      <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.626 0 12-4.974 12-11.111S18.626 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
                    </svg>
                  </a>
                </div>
              </div>
              </div>
            </div>

            {/* Terms of use */}
            <div className="col-6 col-md-4 col-lg-2">
              <h6 className="gc-footer__heading">Terms Of Use</h6>
              <ul className="list-unstyled gc-footer__links">
                <li><a href="https://drive.google.com/file/d/11QGFmVGK__noTfeE9N61cSATQIydt7hR/view" target="_blank" rel="noreferrer"><i className="bi bi-file-earmark-text me-1"></i>Terms &amp; Conditions</a></li>
                <li><Link to="/privacy-policy"><i className="bi bi-shield-lock me-1"></i>Privacy Policy</Link></li>
                <li><button type="button"><i className="bi bi-arrow-counterclockwise me-1"></i>Refund Policy</button></li>
                <li><button type="button"><i className="bi bi-credit-card me-1"></i>Payment Security</button></li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-6 col-md-4 col-lg-3">
              <h6 className="gc-footer__heading">Services</h6>
              <ul className="list-unstyled gc-footer__links">
                <li><button type="button"><i className="bi bi-box-seam me-1"></i>Parcel Delivery</button></li>
                <li><button type="button"><i className="bi bi-truck me-1"></i>Freight Services</button></li>
                <li><button type="button" onClick={() => setShowOrderContainerForm(true)}><i className="bi bi-grid me-1"></i>Order Container <span className="badge bg-warning text-dark ms-1" style={{ fontSize: "0.6rem" }}>New</span></button></li>
                <li><button type="button" onClick={() => handleContactFormPopup('Franchise')}><i className="bi bi-shop me-1"></i>Franchise Enquiry</button></li>
                <li><button type="button" onClick={() => handleContactFormPopup('Agent')}><i className="bi bi-person-badge me-1"></i>Become Agent</button></li>
                <li><Link to="/home#booking"><i className="bi bi-calendar-check me-1"></i>Booking <span className="badge bg-warning text-dark ms-1" style={{ fontSize: "0.6rem" }}>New</span></Link></li>
                <li><Link to="/home#tracking"><i className="bi bi-search me-1"></i>Tracking</Link></li>
                <li><Link to="/about"><i className="bi bi-info-circle me-1"></i>About Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-12 col-md-4 col-lg-3">
              <h6 className="gc-footer__heading">Contact Us</h6>
              <ul className="list-unstyled gc-footer__links">

                <li>
                  <Link to="/contact-us"><i className="bi bi-person-lines-fill me-1"></i>Contact Form</Link>
                </li>
                <li>
                  <a href="mailto:admin@georgiancargo.co.uk"><i className="bi bi-envelope-fill me-1"></i>admin@georgiancargo.co.uk</a>
                </li>
              </ul>

              <div className="gc-footer__offices mt-3">

                {/* Georgia office */}
                <div className="gc-footer__office gc-footer__office--card">
                  <div className="gc-footer__office-label">
                    <span>Georgia</span>
                  </div>
                  <a className="gc-footer__address" href="https://goo.gl/maps/Pzdwn7sdzSNy4zAW7" target="_blank" rel="noreferrer">
                    <i className="bi bi-geo-alt-fill me-1"></i>Nadira Khosharauli #3
                  </a>
                  <a href="tel:+995322050884"><i className="bi bi-telephone-fill me-1"></i>+995 3 22 050 884</a>
                  <a href="tel:+99579885826"><i className="bi bi-telephone-fill me-1"></i>+99 579 885 826</a>
                </div>

                {/* UK office */}
                <div className="gc-footer__office gc-footer__office--card">
                  <div className="gc-footer__office-label">
                    <span>United Kingdom</span>
                  </div>
                  <a className="gc-footer__address" href="https://g.page/GergianCargo?share" target="_blank" rel="noreferrer">
                    <i className="bi bi-geo-alt-fill me-1"></i>Georgian Cargo, Safe Store, 105 Mayes Rd, London N22 6UP
                  </a>
                  <a href="tel:+442036427952"><i className="bi bi-telephone-fill me-1"></i>+44 203 6427 952</a>
                  <a href="tel:+447398295045"><i className="bi bi-telephone-fill me-1"></i>+44 739 8295 045</a>
                </div>

                {/* Other countries */}
                <div className="gc-footer__office gc-footer__office--card">
                  <div className="gc-footer__office-label">
                    <span>Ireland</span>
                  </div>
                  <a href="tel:+3530818000166"><i className="bi bi-telephone-fill me-1"></i>+353 08 1800 0166</a>
                </div>

                <div className="gc-footer__office gc-footer__office--card">
                  <div className="gc-footer__office-label">
                    <span>Sweden</span>
                  </div>
                  <a href="tel:+46844687232"><i className="bi bi-telephone-fill me-1"></i>+46 8 4468 7232</a>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ── bottom bar ── */}
        <div className="gc-footer__bottom">
          <div className="container">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
              <p className="mb-0 small text-white-50">© Georgian Cargo 2009–{new Date().getFullYear()}. All rights reserved.</p>
              <p className="mb-0 small text-white-50 text-center text-md-end" style={{ maxWidth: "520px" }}>
                We use cookies to provide a better, faster and safer experience. By using our site you accept our cookie policy.
              </p>
            </div>
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
