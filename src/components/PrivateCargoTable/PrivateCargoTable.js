import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import copy from "copy-to-clipboard";
import Spinner from "react-bootstrap/Spinner";
import { IoMdPin } from "react-icons/io";
import { GiShipBow } from "react-icons/gi";
import { GrCopy } from "react-icons/gr";
import { FcShipped } from "react-icons/fc";
import { FaShippingFast } from "react-icons/fa";
import { useRequest } from "hooks";
import { AuthContext } from "context";
import { toast } from "react-toastify";
import { Util } from "../../utils";
import { useHistory, useLocation } from "react-router";
import { flagEmoji } from "../../utils/FlagEmoji";
import moment from "moment";
import cargosRequest from "requests/cargos";
import ClientParcels from "components/ClientParcels/ClientParcels";
import ClientNav from "components/ClientNav/ClientNav";
import ClientFooter from 'components/Footer/ClientFooter';

const PrivateCargoTable = ({ user }) => {
  const location = useLocation();
  const history = useHistory();
  const [parcels, setParcels] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getCargos] = useRequest(cargosRequest);
  const { auth, setAuth } = useContext(AuthContext);

  const token = auth.accessToken;

  // const url = "http://localhost:5000/api/auth/cargo";

  // const getCargosHandler = () => {
  //   getCargos({ offset: 10, limit: 0, payment_status: "", token })
  //     .then((data) => {
  //       //console.log(JSON.parse(data.request._response).cargos);
  //       //obj2Arr.push(JSON.parse(data.request._response).cargos);
  //       setParcels(data.data);
  //       setLoading(false);
  //       //setParcels(JSON.parse(data.request._response).cargos);
  //     })
  //     .catch((e) => console.error(e, 999));
  // };

  useEffect(
    () => {
      // getCargosHandler();
      // const getData = async () => {
      //   setLoading(true);
      //   await axios(url, {
      //     method: "GET",
      //     headers: { "Content-Type": "application/json" },
      //   })
      //     .then((response) => {
      //       setData(response.data);
      //     })
      //     .catch((err) => {
      //       setError(err);
      //     })
      //     .finally(() => {
      //       setLoading(false);
      //     });
      // };
      // getData();
    },
    [
      /*url*/
    ]
  );

  const copyToClipboard = (i) => {
    copy(`${parcels.cargos[i].tracking_number}`);
    toast.success("Tracking Number Copied");
  };

  return user && (
    <>
      <main id="content" className="bg-light mt-lg-0 mt-xl-8 mt-xxl-8" style={{ minWidth: "308px" }}>
        <div className="container ">
          <div className="row">
            <div className="col-md-3 col-sm-2 col-12 mb-4" style={{ minWidth: "50px" }}>
              <ClientNav user={user} />
            </div>
            <div className="col-md-9 col-sm-10 col-12">
              <ClientParcels />
            </div>
          </div>
        </div>
        <ClientFooter />
      </main>
      {/* <div className="container mt-10">
    <div className="row">
      <div className="col-md-2">
      <nav className="nav nav-pills flex-column">
        <a role = "button" className={"nav-link" + (Util.checkIsActive(location, "dashboard/cargos") ? ' active' : '')} 
        onClick={() => history.push("/dashboard/cargos")} >Cargos</a>
        <a role = "button" className={"nav-link" + (Util.checkIsActive(location, "dashboard/book-courier") ? ' active' : '')} 
        onClick={() => history.push("/dashboard/book-courier")} >Book a courier</a>
        <a role = "button" className={"nav-link" + (Util.checkIsActive(location, "dashboard/payments") ? ' active' : '')} 
        onClick={() => history.push("/dashboard/payments")} >Payments</a>
        <a role = "button" className={"nav-link" + (Util.checkIsActive(location, "dashboard/addresses") ? ' active' : '')} 
        onClick={() => history.push("/dashboard/addresses")} >Addresses</a>
        <a role = "button" className={"nav-link" + (Util.checkIsActive(location, "dashboard/settings") ? ' active' : '')} 
        onClick={() => history.push("/dashboard/settings")}>Settings</a>
      </nav>
      </div>
      <div className="col-md-10">

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Tracking Number</th>
                  <th scope="col">
                    Receiver{" "}
                    <IoMdPin
                      className="my-auto"
                      style={{ transform: "scale(1.4)" }}
                    />
                  </th>
                  <th scope="col">
                    Sender{" "}
                    <IoMdPin
                      className="my-auto"
                      style={{ transform: "scale(1.4)" }}
                    />
                  </th>
                  <th scope="col">
                    Route{" "}
                    <GiShipBow
                      className="my-auto"
                      style={{ transform: "scale(1.4)" }}
                    />
                  </th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Payment status</th>
                </tr>
              </thead>
              <tbody>
              {loading && (
                <div className="d-flex justify-content-center align-items-center m-10">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
              {!loading &&  (parcels.cargos.map((cargo, i) => (
                <tr key={i}>
                    <td className="w-20" onClick={() => copyToClipboard(i)}>
                    <p style={{ cursor: "pointer" }}>
                      {cargo.tracking_number} <GrCopy className="my-auto" />
                    </p>
                  </td>
                  <td className="w-20">
                    {" "}
                    <p>{cargo.shipping_specs.receiver_information.name}</p>
                    <p>{cargo.shipping_specs.receiver_information.email}</p>
                    <p>{cargo.shipping_specs.receiver_information.phone}</p>
                    <p>
                      {
                        cargo.shipping_specs.receiver_information.address
                          .country_code
                      }{" "}
                      {
                        cargo.shipping_specs.receiver_information.address
                          .address_line_1
                      }{" "}
                      {
                        cargo.shipping_specs.receiver_information.address
                          .address_line_2
                      }{" "}
                      {
                        cargo.shipping_specs.receiver_information.address
                          .postal_code
                      }
                    </p>
                  </td>
                  <td className="w-20">
                    {" "}
                    <p>{cargo.shipping_specs.receiver_information.name}</p>
                    <p>{cargo.shipping_specs.receiver_information.email}</p>
                    <p>{cargo.shipping_specs.receiver_information.phone}</p>
                    <p>
                      {
                        cargo.shipping_specs.receiver_information.address
                          .country_code
                      }{" "}
                      {
                        cargo.shipping_specs.receiver_information.address
                          .address_line_1
                      }{" "}
                      {
                        cargo.shipping_specs.receiver_information.address
                          .address_line_2
                      }{" "}
                      {
                        cargo.shipping_specs.receiver_information.address
                          .postal_code
                      }
                    </p>
                  </td>
                  <td>
                      {flagEmoji(cargo.shipping_specs.route.source_country_code)}
                      {" > "}
                      {flagEmoji(cargo.shipping_specs.route.destination_country_code)}
                  </td>
                  <td className="w-20">
                    <p>Weight: {cargo.item.weight}</p>
                    <p>
                      Price: {cargo.invoice.total_amount}{" "}
                      {cargo.item.item_currency_code}
                    </p>
                    <p>
                      Status:
                      {cargo.status === "PICKED_UP" ? (
                        <p>
                          Picked up{" "}
                          <FcShipped
                            className="my-auto"
                            style={{ transform: "scale(1.4)" }}
                          />
                        </p>
                      ) : (
                        <p>
                          {cargo.status}{" "}
                          <FaShippingFast
                            className="my-auto"
                            style={{ transform: "scale(1.4)" }}
                          />
                        </p>
                      )}
                      Created at: {
                        moment(cargo.created_at).format(
                          "Do of MMM YYYY, h:mm a"
                        )
                      }
                    </p>
                  </td>
                  <td>{cargo.invoice.payment_status === "PAID" ? (
                    <b className="text-success">PAID</b>
                  ) : (
                    <a target="_blank" className="text-danger" href={"https://api.georgiancargo.co.uk/billing/payment/stripe?invoice_ids=" + cargo.invoice.invoice_id}>Pay with Stripe</a>
                  )}</td>
                </tr>
                        ))

                    )}
              </tbody>
            </table>

      </div>
    </div>

    </div> */}

    </>
  );
};

export default PrivateCargoTable;
