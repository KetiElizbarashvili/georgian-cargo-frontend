import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, ButtonGroup, Col, Row, Spinner, Table } from "react-bootstrap";
import useRequest from "../../hooks/useRequest";
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from "../../context";
import Chart from "react-apexcharts";
import { currency_symbols } from "../../utils/Currency";
import clientStatisticRequest from "requests/clientStatistic";
import { flagEmoji } from "../../utils/FlagEmoji";
import moment from "moment";
import ClientParcels from "components/ClientParcels/ClientParcels";
import ClientParcelsForStaff from "./ClientParcelsForStaff";
import ClientActivityForStaff from "./ClientActivityForStaff";
import { useAxios } from "hooks";
import getClientNotes from "requests/getClientNotes";
import saveClientNote from "requests/saveClientNote";
import { toast } from "react-toastify";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};


const initClient = { id: null };

function Client() {
  const [getCustomerStatistics] = useRequest(clientStatisticRequest);
  const [getHandleClientNotes] = useRequest(getClientNotes);
  const [saveHandleClientNotes] = useRequest(saveClientNote);
  const { auth, setAuth } = useContext(AuthContext);
  const [clientId, setClientId] = useState(initClient);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [clienInfo, setClientInfo] = useState(null);
  const [clientNotes, setClientNotes] = useState([]);
  const [graphs, setGraphs] = useState([]);
  const { auth: { routes, accountType, accountId } } = useContext(AuthContext);
  const params = useParams()
  let history = useHistory();
  const [filter, setFilter] = useState({
    start: 0,
    limit: 7
  });
  const [newNote, setNewNote] = useState({
    note: "",
    email: ""
  });
  


  const options = {
    title: {
      text: "",
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238",
      },
    },
    theme: {
      mode: "light",
      palette: "palette2",
      monochrome: {
        enabled: false,
        color: "#255aee",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    series: [],
    chart: {
      width: 650,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {},
    },
  };
  const axiosInstance = useAxios();

  const handleCsvDownload = () => {
    axiosInstance({
        url: '/statistics/customer?id=' + params.id,
        method: 'GET',
        responseType: 'blob',
        headers: {
            Accept: 'text/csv'
        },
        data: {
            filter_specification: [],
            paging_specification: {
                page_offset: 0,
                page_size: 200000000
            }
        }
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'export.csv'); //or any other extension
        document.body.appendChild(link);
        link.click();
    }).catch((e) => {
        console.error(e);
    });
};

  const getCustomerStatisticsHandler = () => {
    setLoading(true);
    getCustomerStatistics({ clientId })
      .then((response) => {
        setClientData(response.data.customer.data)
        setClientInfo({
          email: response.data.customer.email,
          id: response.data.customer.id,
          name: response.data.customer.name,
          username: response.data.customer.username,
          activity: response.data.customer.activity,
          parcels: response.data.customer.parcels,
        });
      })
      .catch((e) => console.error(e, 999));
  };

  useEffect(() => {
    if(clienInfo){
      setNewNote({...newNote, email: clienInfo.email});
      getHandleClientNotes({email: clienInfo.email, start: filter.start, limit: filter.limit})
      .then((response) => {
        setClientNotes(response.data.notes);
      });
    }
  }, [clienInfo, filter.start]);

  const saveNote = () => {
    saveHandleClientNotes({email: newNote.email, note: newNote.note})
    .then((response) => {
      if(response.status){
        setNewNote({...newNote, note: ""});
        setFilter({...filter, start: 0});
        setClientInfo({...clienInfo, email: clienInfo.email});
        toast.success("Note added", toastOptions);
      } else {
        toast.error("Note was not added", toastOptions);
      }
    })
  };

  const handleNext = () => {
    setFilter({ ...filter, start: (parseInt(filter.start) + 7) });
  };

  const handlePrev = () => {
    let strt = parseInt(filter.start) < 7 ? 0 : parseInt(filter.start) - 7;
    setFilter({ ...filter, start: strt });
  };

  useEffect(() => {
    console.log(clientData);
    clientData.map((item, index) => {
      let opts = JSON.parse(JSON.stringify(options));
      let keys = Object.keys(item);
      let filteredKeys = keys.filter(function (e) { return e !== 'currency' && e !== 'source_country_code' && e !== 'destination_country_code' });

      opts.title.text =
        flagEmoji(item.source_country_code) +
        " > " +
        flagEmoji(item.destination_country_code) +
        " (" +
        item.currency +
        ")";
      filteredKeys.map((fkey) => {
        opts.series.push({
          name: fkey.charAt(0).toUpperCase() + fkey.slice(1).split("_").join(" "),
          data: [item[fkey]],
        });
      });
      opts.xaxis.categories.push(opts.title.text);
      opts.tooltip.y.formatter = function (val) {
        return (
          currency_symbols(item.currency) +
          val
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      };
      setGraphs(oldArray => [...oldArray, opts]);
    });
  }, [clientData]);

  useEffect(() => {
    setLoading(false);
  }, [graphs]);

  useEffect(() => {
    setClientId(params.id);
  }, []);

  useEffect(() => {
    getCustomerStatisticsHandler();
  }, [clientId]);

  useEffect(() => {

  }, [clientData, clienInfo]);

  return (
    <>
      {loading && (
        <>
          <style>{`
        .spinner-border {
          width: 4rem; height: 4rem;
        }
          `}
          </style>
          <center>
            <div className="m-4 spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </center>
        </>
      )}
      {!loading && (
        <>
          <nav aria-label="breadcrumb">
            <ul class="breadcrumb">
              <li class="breadcrumb-item text-warning"><a role="button" onClick={() => history.push("/manage/clients")}>Clients</a></li>
              <li class="breadcrumb-item active" aria-current="page">{clienInfo.name}</li>
            </ul>
          </nav>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="w-100" id="user-card">
                <div className="col-md-12 jobs_index_middle_panels">
                  <div className="card ms-4">
                    <div className="card-header" id="user-full-name">{clienInfo.email}</div>
                    <div className="card-body">
                      <ul>{clientData.map((v, i) => (
                        <li className={v.unpaid > 0 ? "text-danger" : ""}>Unpaid {currency_symbols(v.currency)}{v.unpaid}</li>
                      ))}</ul>
                      <hr />
                      <a href="javascript:alert('soon...');" className="btn btn-secondary"
                      >Send email</a
                      >
                      &nbsp;
                      <a onClick={handleCsvDownload} className="btn btn-success"
                      >Download Data</a
                      >
                      &nbsp;
                      <a onClick={() => setShowNotes(true)} className="btn btn-warning"
                      >Notes</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div id="apex-charts" className="">
                {graphs.map(function (chrt, index) {
                  return (
                    <>
                      <style>{
                        `#chart` + index + ` {
              height: 300px;
            }
              `}
                      </style>
                      <div
                        id={"#chart" + index}
                        key={chrt.title.text}
                        className="ms-4 mb-4 card float-start"
                      >
                        <Chart
                          options={chrt}
                          series={chrt.series}
                          type="bar"
                          width="650"
                        />
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col">
                      <h2 className="h3 fw-extrabold">Last 10 parcels</h2>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col">Tracking number</th>
                        <th className="border-bottom" scope="col">Source Country</th>
                        <th className="border-bottom" scope="col">Status</th>
                        <th className="border-bottom" scope="col">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!clienInfo.parcels) ? (
                        <Spinner />
                      ) : (
                        <>
                          {clienInfo.parcels && clienInfo.parcels.length > 0 && clienInfo.parcels.map((parcel, i) => (
                            <tr key={i}>
                              <td className="text-gray-900" scope="row">
                                <Link to={`/manage/item/${parcel.tracking_number}`} >{parcel.tracking_number}</Link>

                              </td>
                              <td className="fw-bolder text-gray-500">
                                {flagEmoji(parcel.shipping_specs.route.source_country_code)}
                              </td>
                              <td className="fw-bolder text-gray-500" style={{ textTransform: "capitalize" }}>
                                {parcel.status.toLowerCase().replace('_', ' ')}
                              </td>
                              <td className="fw-bolder text-gray-500">
                                {parcel.invoice.payment_status === 'PAID' ? (
                                  <span class="badge text-bg-success">{parcel.invoice.payment_status.toLowerCase()}</span>
                                ) : (
                                  <span class="badge text-bg-warning">{parcel.invoice.payment_status.toLowerCase()}</span>
                                )}

                              </td>
                            </tr>

                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#allParcels">View all</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow">
                <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom">
                  <div className="d-block">
                    <h2 className="h3 fw-extrabold">Last 10 activity</h2>
                  </div>
                </div>
                <div className="card-body p-2">
                  <div className="table-responsive">
                    <table className="table table-borderless align-items-center table-flush">
                      <tbody>
                        {(!clienInfo.activity) ? (
                          <Spinner />
                        ) : (
                          clienInfo.activity.map((act, i) => (
                            <tr key={act.id}>
                              <th className="text-gray-900" scope="row">{act.id}</th>
                              <td className="text-gray-300">
                                {act.type === 'REGISTER' && (
                                  <>
                                    <i style={{ fontSize: "20px" }} className="bi bi-person-fill"></i>
                                  </>
                                )}
                                {act.type === 'BOOKING' && (
                                  <>
                                    <i style={{ fontSize: "20px" }} className="bi bi-card-list"></i>
                                  </>
                                )}
                                {act.type === 'PAYMENT' && (
                                  <>
                                    <i style={{ fontSize: "20px" }} className="bi bi-currency-exchange"></i>
                                  </>
                                )}
                                {act.type === 'HANDLE' && (
                                  <>
                                    <i style={{ fontSize: "20px" }} className="bi bi-box-seam-fill"></i>
                                  </>
                                )}
                              </td>
                              <td className="text-gray-300">
                                {act.type === 'BOOKING' && (
                                  <>
                                    <b><Link to={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).customer_name}</Link></b> has created booking
                                  </>
                                )}
                                {act.type === 'REGISTER' && (
                                  <>
                                    <b><Link to={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).name}</Link></b> has registered on website
                                  </>
                                )}
                                {act.type === 'PAYMENT' && (
                                  <>
                                    <b><Link to={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).customer_name}</Link></b>
                                    {' has paid '}
                                    {console.log(JSON.parse(act.data).amount)}
                                    <b>{currency_symbols(JSON.parse(act.data).currency) + parseFloat(JSON.parse(act.data).amount).toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                                    {' with '}
                                    <b>
                                      {JSON.parse(act.data).method.toLowerCase()}
                                    </b>
                                    {' for parcel: '}
                                    <b>
                                      <Link to={`/manage/item/${JSON.parse(act.data).tracking}`} >{JSON.parse(act.data).tracking}</Link>
                                    </b>
                                  </>
                                )}
                                {act.type === 'HANDLE' && (
                                  <>
                                    <b>{JSON.parse(act.data).staff}</b>
                                    {' has changed status on parcel: '}
                                    <b><Link to={`/manage/item/${JSON.parse(act.data).tracking}`} >{JSON.parse(act.data).tracking}</Link></b>
                                    {' to '}
                                    <b>{JSON.parse(act.data).type}</b>
                                  </>
                                )}
                              </td>
                              <td
                                title={moment(act.created_at).format(
                                  "D MMMM, YYYY, h:mm:ss a"
                                )}
                                className="fw-bolder text-gray-500">
                                {
                                  moment(act.created_at).fromNow()
                                }
                              </td>
                            </tr>

                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#allActivity">View all</button>
                </div>
              </div>
            </div>
          </div >

        </>
      )
      }
      <div class="modal fade" id="allParcels" tabindex="-1" aria-labelledby="allParcelsLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="allParcelsLabel">User parcels</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <ClientParcelsForStaff />
            </div>
            {/* <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            </div> */}
          </div>
        </div>
      </div>
      <div class="modal fade" id="allActivity" tabindex="-1" aria-labelledby="allParcelsLabel" data-backdrop="false" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="allActivityLabel">User activity</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <ClientActivityForStaff />
            </div>
            {/* <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            </div> */}
          </div>
        </div>
      </div>

      {clienInfo && (
        <Modal
          size="xl"
          onHide={() => setShowNotes(false)}
          show={showNotes}
          aria-labelledby="create-route-title"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="create-route-title">Notes for <b>{clienInfo.email}</b></Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <>
              <div className="row">
                  <ul class="notes">
                    <li>
                        <div className="">
                            <h4>New note</h4>
                            <textarea
                              rows={4}
                              onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                              value={newNote.note}
                              className={"form-control form-control-sm mb-2"}/>
                            <button className="btn btn-sm btn-success float-end" onClick={() => saveNote()}>Add</button>
                        </div>
                    </li>  
                    {clientNotes.length > 0 && clientNotes.map((note) => (
                          <li>
                              <div class={["rotate-" + (parseInt(note.staff_id)%2 === 0 ? '1' : '2')] + " " + [parseInt(note.staff_id) === 1 ? "bg-danger" : "bg-warning"]}>
                                  <small>{note.created_at}</small>
                                  <h4>Note by {note.staff_username}</h4>
                                  <p>{note.note}</p>
                              </div>
                          </li>   
                    ))}
                  </ul>  
              </div>
              {clientNotes && (clientNotes?.length > 0 || clientNotes !== undefined) && (
                <div className="text-center">
                  <nav aria-label="Page navigation" className="d-inline-block">
                    <ul className="pagination">
                      <li className={"page-item" + (filter.start == "0" ? " disabled" : "")}>
                        <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                      </li>
                      <li className={"page-item" + (clientNotes.length < 7 ? " disabled" : "")}>
                        <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-sm btn-white " onClick={() => setShowNotes(false)}>Close</button>
          </Modal.Footer>
        </Modal>
      )}

    </>
  );
}

export default Client;