import useRequest from "../../hooks/useRequest";
import { GetItemRequest, updateItemRequest } from "../../routes/GetRoutesRequest";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { RouteEditForm2 } from "./RouteEditForm2";

export const emptyPolicy = {
  "id": "",
  "weight_bounds": {
    "lowerBound": 0,
    "upperBound": 0
  },
  "parcel_type": "PARCEL",
  "collection_option": "HOME",
  "packaging_price": 0,
  "customer_type": "INDIVIDUAL",
  "freight": {
    "rate": 0,
    "min": 0,
    "cap": 0,
    "fixed": false
  },
  "delivery": {
    "rate": 0,
    "min": 0,
    "cap": 0,
    "fixed": false
  }
};
const defaultRoute = {
  "source": "",
  "destination": "",
  "policies": [emptyPolicy]
};
export function PoliciesEditDialog({ route, show, onHide }) {
  const [fetchRoute,] = useRequest(GetItemRequest);
  const [updateRoute,] = useRequest(updateItemRequest);
  const [actionsLoading, setLoading] = useState(false);
  const [routeItem, setRouteItem] = useState(defaultRoute);
  useEffect(() => {
    if (route) {
      let routes = route.split('-');
      setLoading(true);
      fetchRoute({ source: routes[0], destination: routes[1] }).then(({ data }) => {
        console.log(data.route);
        setRouteItem(data.route);
        setLoading(false);
      }).catch((e) => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
  };
  const saveRoute = (routeData) => {
    // console.log(routeData);
    updateRoute(routeData).then(({ data }) => {
      // console.log(data);
      // setStatus(false);
      if (data.message === "success") {
        onHide();
        toast.success("Saved!", toastOptions);
      } else {
        // setStatus(data.data.errors);
      }
    }).catch(e => {
      // setStatus(e.response.data.data.errors);
      // toast.error("Error!", toastOptions);
    });
  };

  return (
    <Modal
      size="xl"
      dialogClassName="w-90 mw-100"
      show={show}
      onHide={onHide}
      aria-labelledby="edit-policies-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="edit-policies-title">Edit Route {routeItem.source} -> {routeItem.destination} Policies</Modal.Title>
      </Modal.Header>
      <RouteEditForm2
        saveRoute={saveRoute}
        actionsLoading={actionsLoading}
        route={routeItem}
        routeItem={routeItem}
        setRouteItem={setRouteItem}
        onHide={onHide}
      />
    </Modal>
  );
}
