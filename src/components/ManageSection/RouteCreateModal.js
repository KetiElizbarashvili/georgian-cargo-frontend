import useRequest from "../../hooks/useRequest";
import { GetItemRequest, updateRouteRequest } from "../../routes/GetRoutesRequest";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { RouteCreateForm } from "./RouteCreateForm";

const defaultRoute = {
  source: "GE",
  destination: "GE",
  currency: 'EUR'
};
export function RouteCreateDialog({ route, show, onHide }) {
  const [fetchRoute,] = useRequest(GetItemRequest);
  const [updateRoute,] = useRequest(updateRouteRequest);
  const [actionsLoading, setLoading] = useState(false);
  const [routeItem, setRouteItem] = useState(defaultRoute);
  useEffect(() => {
    if (route) {
      let routes = route.split('-');
      setLoading(true);
      fetchRoute({ source: routes[0], destination: routes[1] }).then(({ data }) => {
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
  const saveRoute = (routeData, setStatus) => {
    updateRoute(routeData).then(({ data }) => {
      setLoading(true);
      if (data.message === "success") {
        onHide();
        toast.success("Saved!", toastOptions);
      } else {
        setStatus(data.message);
      }
    }).catch(e => {
      toast.error("Error!", toastOptions);
    }).then(() => { setLoading(false); });
  };

  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      aria-labelledby="create-route-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="create-route-title">{routeItem.source && routeItem.destination ? (`Edit route ${routeItem.source}-${routeItem.destination}`) : (`Create new route`)}</Modal.Title>
      </Modal.Header>
      <RouteCreateForm
        saveRoute={saveRoute}
        actionsLoading={actionsLoading}
        routeItem={routeItem}
        onHide={onHide}
      />
    </Modal>
  );
}
