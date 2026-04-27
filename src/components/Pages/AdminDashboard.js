import { Button, Container, Nav, Navbar } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import ItemsTable from "../ItemsTable/ItemsTable";
import TransactionsTable from "../TransactionsTable/TransactionsTable";
import CargoStatisticsTable from "../CargoStatisticsTable/CargoStatisticsTable";
import Clients from "../Clients/Clients";
import Client from "../Clients/Client";
import ManagePage from "../ManageSection/ManagePage";
import { Redirect, Route, Switch, Link } from "react-router-dom";
import { Util } from "../../utils";
import { AuthContext } from "../../context";
import Bookings from "components/AgentBookings/AgentBookings";
import PickupForm from "components/Pickup/PickupForm";
import PrivateSummary from "components/PrivateSummary";
import ItemTable from "components/ItemTable";
import { HandleCargo } from "components/HandleCargo";
import StaffProfile from "components/StaffProfile";
import getStaff from "requests/getStaff";
import { useCookies } from "react-cookie";
import { useRequest } from "hooks";
import moment from "moment";
import PrivateCouponsTable from "components/PrivateCouponsTable";
import PrivateAgents from "components/PrivateAgents";
import AdminLoyalty from "components/AdminLoyalty";
import DelayInactive from "components/DelayInactive";

function AdminDashboard() {
  const location = useLocation();
  const history = useHistory();
  const [getStaffReq] = useRequest(getStaff);
  const [cookies, setCookie, removeCookie] = useCookies(['checked_mentions_at']);

  useEffect(() => {
    if (localStorage.getItem('checked_mentions_at') === undefined) {
      resetLastCheckedAtCookie();
    }
    // if (cookies.checked_mentions_at === undefined) {
    //   resetLastCheckedAtCookie();
    // }
    let tenMin = 60000;
    if ((Math.floor(new Date().getTime() - (+localStorage.getItem('checked_mentions_at'))) / tenMin) > 10) {
      getStaffReq({ start: 0 })
        .then(response => {
          if (response.data.mentions[0]) {
            let dat = JSON.stringify({ last_mentioned_id: response.data.mentions[0].id, expires: moment().add(1, "days").toDate() })
            localStorage.setItem('last_mentioned_id', dat);
            window.location.reload();
            // setCookie('last_mentioned_id', response.data.mentions[0].id, { path: '/', expires: moment().add(1, "days").toDate() });
          }
        });
      resetLastCheckedAtCookie();
    }
  }, []);

  const resetLastCheckedAtCookie = () => {
    let dat = JSON.stringify({ checked_mentions_at: new Date().getTime(), expires: moment().add(1, "days").toDate() })
    localStorage.setItem('checked_mentions_at', dat);
    // setCookie('checked_mentions_at', new Date().getTime(), { path: '/', expires: moment().add(1, "days").toDate() });
  };
  const handleLogout = () => {
    localStorage.clear();
    history.push("/manage/logout");
  };
  const { auth } = useContext(AuthContext);
  let access_token = auth.accessToken;
  let customerRoute = `${"/reports/customers.html#" + access_token}`;
  let cargoRoute = `${"/reports/cargo.html#" + access_token}`;
  let editStaffRoute = `${"/reports/staffforms.html#" + access_token}`;

  // document.querySelectorAll("a").forEach(function (item) {
  //   var getHref = item.href;
  //   var newHref = getHref + access_token;
  //   item.setAttribute("href", newHref);
  // });
  const isAdmin = auth.accountType === "ADMIN" && auth.accountId === "1";
  const isSubAdmin = auth.staff.privileges.includes('SUB_ADMIN');
  const canViewStatistics = auth.staff.privileges.includes('VIEW_CARGO_STATISTICS');
  const canEditRoutes = auth.staff.privileges.includes('EDIT_ROUTES');
  const canHandleBookings = auth.staff.privileges.includes('HANDLE_BOOKINGS');
  const canListPayments = auth.staff.privileges.includes('LIST_PAYMENTS');
  const editBookingProceed = auth.staff.privileges.includes('EDIT_BOOKING_PROCEED');
  const listRouteCargo = auth.staff.privileges.includes('LIST_ROUTE_CARGO');
  const listOwnCargoHistory = auth.staff.privileges.includes('LIST_OWN_CARGO_HISTORY');
  const canHandleCargo = auth.staff.privileges.includes('HANDLE_CARGO');
  const canGenerateCoupons = auth.staff.privileges.includes('MANAGE_COUPONS');
  const editLoyaltySettings = auth.staff.privileges.includes('MANAGE_LOYALTY');
  const viewInactive = auth.staff.privileges.includes('VIEW_INACTIVE');
  const viewDelayed = auth.staff.privileges.includes('VIEW_DELAY');
  const viewClient = auth.staff.privileges.includes('VIEW_CLIENT');

  const [expanded, setExpanded] = useState(false);


  return (
    <>
      <Navbar expanded={expanded} expand="lg" bg="light" variant="light">
        <Container fluid={true} className="px-3">
          <Navbar.Brand className="me-md-3">
            <img
              src="/logo.png"
              className="d-inline-block align-top"
              style={{ width: "100px" }}
              alt="Georgian Cargo"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")}>
            <i className="bi bi-list" style={{ fontSize: "30px" }}></i>
            {((JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== undefined && JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention === undefined) || (JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention !== undefined && JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention)) && (
              <span className="position-absolute top-20 start-80 translate-middle p-2 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            )}</Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {(isAdmin || canViewStatistics) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/summary")}
                    onClick={() => (setExpanded(false), history.push("/manage/summary"))}
                  >
                    Summary
                  </Nav.Link>
                </Nav.Item>
              )}

              {(isAdmin || canEditRoutes) && (

                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/routes")}
                    onClick={() => (setExpanded(false), history.push("/manage/routes"))}
                  >
                    Manage
                  </Nav.Link>
                </Nav.Item>
              )}
              <Nav.Item>
                <Nav.Link
                  className="justify-content-end"
                  active={Util.checkIsActive(location, "/manage/items")}
                  onClick={() => (setExpanded(false), history.push("/manage/items"))}
                >
                  Items
                </Nav.Link>
              </Nav.Item>

              {(isAdmin || isSubAdmin || canHandleCargo) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/processing")}
                    onClick={() => (setExpanded(false), history.push("/manage/processing"))}
                  >
                    Handle
                  </Nav.Link>
                </Nav.Item>
              )}

              {(isAdmin || canListPayments) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/transactions")}
                    onClick={() => (setExpanded(false), history.push("/manage/transactions"))}
                  >
                    Transactions
                  </Nav.Link>
                </Nav.Item>
              )}
              {/* {(isAdmin || canViewStatistics) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/cargo/statistics")}
                    onClick={() => history.push("/manage/cargo/statistics")}
                  >
                    Statistics
                  </Nav.Link>
                </Nav.Item>
              )} */}
              {(isAdmin || viewClient) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/clients")}
                    onClick={() => (setExpanded(false), history.push("/manage/clients"))}
                  >
                    Clients
                  </Nav.Link>
                </Nav.Item>
              )}

              {(isAdmin || canHandleBookings || editBookingProceed) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/bookings")}
                    onClick={() => (setExpanded(false), history.push("/manage/bookings"))}
                  >
                    Bookings
                  </Nav.Link>
                </Nav.Item>
              )}
              {(isAdmin || isSubAdmin || editLoyaltySettings) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/loyalty")}
                    onClick={() => (setExpanded(false), history.push("/manage/loyalty"))}>
                    Loyalty
                  </Nav.Link>
                </Nav.Item>
              )}
              {(isAdmin || isSubAdmin || canGenerateCoupons) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/coupons")}
                    onClick={() => (setExpanded(false), history.push("/manage/coupons"))}>
                    Coupons
                  </Nav.Link>
                </Nav.Item>
              )}
              {(isAdmin || isSubAdmin) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/agents")}
                    onClick={() => (setExpanded(false), history.push("/manage/agents"))}>
                    Agents
                  </Nav.Link>
                </Nav.Item>
              )}
              {(isAdmin || isSubAdmin || viewInactive || viewDelayed) && (
                <Nav.Item>
                  <Nav.Link
                    className="justify-content-end"
                    active={Util.checkIsActive(location, "/manage/inactive-delayed")}
                    onClick={() => (setExpanded(false), history.push("/manage/inactive-delayed"))}>
                    Inactive/Delayed
                  </Nav.Link>
                </Nav.Item>
              )}
              {/* {(isAdmin || isSubAdmin) && (
                <Nav.Item>
                  <Nav.Link href={editStaffRoute}>
                    Edit agent
                  </Nav.Link>
                </Nav.Item>
              )} */}
              <Nav.Item>
                <Link className="text-success" to="/">
                  Back to site
                </Link>
              </Nav.Item>
            </Nav>
            <div className="navbar">
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Hello, {auth.staff.username}

                  {((
                    JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== undefined
                    &&
                    JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention === undefined)
                    || (JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention !== undefined && JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention)) && (
                      <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    )}
                </button>
                <ul className="dropdown-menu dropdown-menu-start">
                  <li><Link className="dropdown-item position-relative" to="#" onClick={() => (setExpanded(false), history.push("/manage/profile"))}>
                    {/* {console.log(parseInt(JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id ) === JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention)} */}
                    Profile
                    {((JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== undefined && JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention === undefined) || (JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention !== undefined && JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention)) && (
                      <span className="position-absolute top-10 start-50 translate-middle p-2 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    )}
                  </Link></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleLogout()}>Logout</a></li>
                </ul>
              </div>
            </div>

          </Navbar.Collapse>
        </Container>
      </Navbar >
      <Container fluid={true}>
        <Switch>
          <Redirect exact={true} from="/manage" to="/manage/items" />
          <Route path="/manage/items" component={ItemsTable} />
          <Route path="/manage/pickup" component={PickupForm} />
          {(isAdmin || isSubAdmin) && <Route path="/manage/agents" component={PrivateAgents} />}
          <Route path="/manage/summary" component={PrivateSummary} />
          <Route path="/manage/profile" component={StaffProfile} />
          <Route path="/manage/transactions" component={TransactionsTable} />
          {(isAdmin || isSubAdmin || canHandleCargo) && <Route path="/manage/processing" component={HandleCargo} />}
          {(isAdmin || isSubAdmin || canViewStatistics) && <Route path="/manage/cargo/statistics" component={CargoStatisticsTable} />}
          {(isAdmin || canGenerateCoupons) && <Route path="/manage/coupons" component={PrivateCouponsTable} />}
          {(isAdmin || editLoyaltySettings) && <Route path="/manage/loyalty" component={AdminLoyalty} />}
          {(isAdmin || viewClient) && <Route path="/manage/clients" component={Clients} />}
          {(isAdmin || viewClient) && <Route path="/manage/client/:id" component={Client} />}
          {(isAdmin || canHandleBookings || editBookingProceed) && <Route path="/manage/bookings" component={Bookings} />}
          {(isAdmin || canEditRoutes) && <Route path="/manage/routes/" component={ManagePage} />}
          {(isAdmin || isSubAdmin || (listRouteCargo || listRouteCargo)) && <Route path="/manage/item/:id" component={ItemTable} />}
          {(isAdmin || isSubAdmin || viewInactive || viewDelayed) && <Route path="/manage/inactive-delayed" component={DelayInactive} />}
        </Switch>
      </Container>
    </>
  );
}

export default AdminDashboard;
