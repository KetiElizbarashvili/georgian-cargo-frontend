import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import useRequest from "../../hooks/useRequest";
import { GetItemsRequest } from "../../routes/GetRoutesRequest";
import { Route, Switch, useHistory } from "react-router";
import { countryCodes } from "utils";
import { PoliciesEditDialog } from "./PoliciesEditModal";
import { RouteCreateDialog } from "./RouteCreateModal";
import getPackagingPrice from "requests/getPackagingPrice";
import updatePackagingPrice from "requests/updatePackagingPrice";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

function ManagePage() {
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const [routes, setRoutes] = useState([]);
  const [packagingPrice] = useRequest(getPackagingPrice);
  const [newPackagingPrice] = useRequest(updatePackagingPrice);
  const [getItems,] = useRequest(GetItemsRequest);
  const history = useHistory();
  const [packagingPriceVal, setPackagingPriceVal] = useState(0.00);
  const [loadingPackagingPrice, setLoadingPackagingPrice] = useState(true);

  const loadItems = () => {
    setRoutes([]);
    getItems().then(({ data }) => {
      setRoutes(data.routes);
    }).catch((e) => { });
  }
  const editRoute = (route) => {
    history.push(`/manage/routes/edit/${route}`);
  }
  const editRoutePolicies = (route) => {
    history.push(`/manage/routes/editPolicies/${route}`);
  }

  const loadPackagingPrice = () => {
    setLoadingPackagingPrice(true);
    packagingPrice().
      then((response) => {
        setPackagingPriceVal(response.data.packaging_price.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      });
  };

  const updatePackagingPriceHandle = (price) => {
    newPackagingPrice({ packaging_price: packagingPriceVal })
      .then((response) => {
        toast.success("Packaging Price updated!", toastOptions);
      }).catch((e) => {
        toast.error("Error occured!", toastOptions);
      });
  };


  useEffect(() => {
    loadItems();
    loadPackagingPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoadingPackagingPrice(false);
  }, [packagingPriceVal]);
  return (
    <>
      {/* <h3>Manage packaging price</h3> */}
      {loadingPackagingPrice && (
        <LoadingSpinner />
      )}
      {!loadingPackagingPrice && (

        <>
          {/* <div class="input-group mb-3 col-md-3">
  <input type="text" class="form-control" 
  name="packaging_price"
    {...register("packaging_price", { required: true, min: 0.00})}
    onChange={e => setPackagingPriceVal(e.target.value)}
    value={packagingPriceVal}/>
  <div class="input-group-append">
    <button class="btn btn-outline-secondary btn-secondary text-dark" type="button"
    onClick={handleSubmit(updatePackagingPriceHandle)}
    >Save</button>
  </div>
</div>

  {errors.packaging_price && <p className="text-danger d-block w-full">Please check price</p>} */}

          <hr />
        </>
      )}
      <Row>
        <Col><h1>Manage routes</h1></Col>
        <Col className="text-end"><Button type="button" variant="success" onClick={() => history.push(`/manage/routes/create`)}>Add route</Button></Col>
      </Row>
      <Table responsive="sm" striped bordered hover>
        <thead>
          <tr>
            <th>Source Country Code</th>
            <th>Destination Country Code</th>
            <th>Currency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => {
            return (
              <tr key={`${route.source_country_code}${route.destination_country_code}`}>
                <td className="align-middle">{countryCodes[route.source_country_code]} ({route.source_country_code})</td>
                <td className="align-middle">{countryCodes[route.destination_country_code]} ({route.destination_country_code})</td>
                <td className="align-middle">{route.currency_code}</td>
                <td>
                  <button type="button" className="btn btn-outline-warning btn-sm me-2" onClick={() => editRoute(`${route.source_country_code}-${route.destination_country_code}`)}><i className="fa fa-edit" /></button>
                  <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => editRoutePolicies(`${route.source_country_code}-${route.destination_country_code}`)}><i className="fa fa-table" /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Switch>
        <Route path="/manage/routes/editPolicies/:route">
          {({ history, match }) => (
            <PoliciesEditDialog
              show={match != null}
              route={match && match.params.route}
              onHide={() => {
                history.push("/manage/routes");
                loadItems();
              }}
            />)
          }
        </Route>
        <Route path={["/manage/routes/edit/:route", "/manage/routes/create"]}>
          {({ history, match }) => (
            <RouteCreateDialog
              show={match != null}
              route={match && match.params.route}
              onHide={() => {
                history.push("/manage/routes");
                loadItems();
              }}
            />)
          }
        </Route>
      </Switch>
    </>
  );
}

export default ManagePage;
