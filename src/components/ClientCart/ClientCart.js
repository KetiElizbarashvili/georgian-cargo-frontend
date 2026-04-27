import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { Link, useHistory, useLocation } from "react-router-dom";
import { currency_symbols } from "../../utils/Currency";
import axios from "axios";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const ClientCart = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['parcelsCart']);
  const [cart, setCart] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const handleRemoveCart = (trackingNumber) => {
    let arr = cookies.parcelsCart;
    let index = arr.findIndex(x => x.trackingNumber == trackingNumber);
    if (index > -1) {
      removeCookie('parcelsCart', { path: '/' });
      setCart([]);
      arr.splice(index, 1);
      setCookie('parcelsCart', JSON.stringify(arr), { path: '/' });
      setCart(cookies.parcelsCart);
      toast.success("Removed from cart!", toastOptions);
    }
  };

  useEffect(() => {
    setCart(cookies.parcelsCart);
  }, []);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <>


      {undefined === cart || cart.length == 0 && (
        <div className=" ms-4">Cart is empty!</div>
      )}
      {cart && cart.map((item, i) => (
        <div className="card mb-4" key={i}>
          <div className="card-body p-4">

            <div className="row align-items-center">
              <div className="col-md-2">
                {i + 1}
              </div>
              <div className="col-md-5 d-flex justify-content-center">
                <div>
                  <p className="small text-muted mb-4 pb-2">Tracking number</p>
                  <p className=" mb-0">{item.trackingNumber}</p>
                </div>
              </div>
              <div className="col-md-3 d-flex justify-content-center">
                <div>
                  <p className="small text-muted mb-4 pb-2">Amount</p>
                  <p className="lead fw-normal mb-0">
                    {currency_symbols(item.currency)}{item.total.toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
              </div>
              <div className="col-md-2">
                <button className="btn  btn-white btn-sm" onClick={() => handleRemoveCart(item.trackingNumber)}><i className="bi bi-x-lg"></i></button>
              </div>
            </div>

          </div>
        </div>
      ))}

      {undefined !== cart && cart.length !== 0 && (
        <div className="card mb-5">
          <div className="card-body p-4">

            <div className="float-end">
              <p className="mb-0 me-5 float-start">
                <span className="text-muted me-2">Total:&nbsp;</span><span
                  className="lead fw-normal">{cart.length == 0 ? "0.00" : currency_symbols(cart[0].currency) + cart.map(item => item.total).reduce((prev, next) => prev + next).toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              </p>
              <p className="float-end">
                <a target="_blank" className="btn btn-danger  text-white" href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cart.map(function (item) { return item.invoiceId; }).join(",")}>
                  <i className="bi bi-cash-stack"></i> Pay with stripe
                </a>
              </p>
            </div>

          </div>
        </div>
      )}


      <div className="d-flex justify-content-end">
        <button onClick={() => history.push("/dashboard/cargos")} type="button" className="btn  btn-secondary btn-sm me-2">Go to your parcels</button>
      </div>
    </>
  );
};

export default ClientCart;