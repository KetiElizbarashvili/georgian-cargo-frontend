// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useEffect, useState } from "react";
import { Alert, Modal, Table } from "react-bootstrap";
import { Input, Radio } from "utils";
import { emptyPolicy } from "./PoliciesEditModal";

const collect_options = [
  'HOME', 'OFFICE'
];

export function RouteEditForm2({ routeItem, setRouteItem, saveRoute, route, actionsLoading, onHide }) {
  const [routeData, setRouteData] = useState(null);
  const [activeType, setActiveType] = useState('INDIVIDUAL');

  const handleChangeText = (index, id, name, value) => {
    let tempObj = routeItem.policies.slice();
    if (name.includes('.')) {
      // if (id === '') {
      tempObj.filter(item => item.customer_type === activeType).sort(function (a, b) {
        return (a.id === '') - (b.id === '') || +(a.id > b.id) || -(a.id < b.id);
      })[index][name.split('.')[0]][name.split('.')[1]] = value;
    }
    // else {
    //   tempObj.find(item => item.id === id)[name.split('.')[0]][name.split('.')[1]] = value;
    // }
    // }
    else {
      tempObj.filter(item => item.customer_type === activeType).sort(function (a, b) {
        return (a.id === '') - (b.id === '') || +(a.id > b.id) || -(a.id < b.id);
      })[index][name] = value;
    }
    setRouteItem(routeItem => ({ ...routeItem, policies: tempObj }));
  };

  const generateRandom = (min, max, except) => {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return except.includes(num) ? generateRandom(min, max, except) : num;
  }

  const remove = (index) => {
    let tempObj = routeItem.policies.sort(function (a, b) {
      return (a.id === '') - (b.id === '') || +(a.id > b.id) || -(a.id < b.id);
    }).filter(item => item.customer_type === activeType).slice();
    delete tempObj[index];
    let allLeft = routeItem.policies.filter(item => item.customer_type !== activeType);
    let merged = [...tempObj, ...allLeft];
    merged = merged.filter(function (element) {
      return element !== undefined;
    });
    console.log(merged);
    setRouteItem(routeItem => ({ ...routeItem, policies: merged }));
  };

  const push = () => {
    let tempObj = routeItem.policies.slice();
    let id = generateRandom(tempObj.length, tempObj.length * tempObj.length, tempObj.map(item => item.id));
    let tempEmptyPolicy = JSON.parse(JSON.stringify(emptyPolicy));
    tempEmptyPolicy.customer_type = activeType;
    // tempEmptyPolicy.id = id;
    tempObj.push(tempEmptyPolicy);
    setRouteItem(routeItem => ({ ...routeItem, policies: tempObj }));
  };

  useEffect(() => {
    console.log(routeItem);
  }, [routeItem]);

  useEffect(() => {
    setRouteData(routeItem);
  }, []);
  return (
    <>
      {routeData && (
        <>
          <ul className="nav nav-pills mb-3 ms-4" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                onClick={() => setActiveType('INDIVIDUAL')}
                className="btn btn-primary active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Individual</button>
            </li>
            <li className="nav-item"
              onClick={() => setActiveType('CORPORATE')}
              role="presentation">
              <button className="btn btn-primary" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Corporate</button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">


              <Modal.Body className="overlay overlay-block cursor-default">
                <div className="form form-label-right">
                  <input type="hidden" name="source" value={routeItem.source} />
                  <input type="hidden" name="destination" value={routeItem.destination} />
                  <Table striped>
                    <thead>
                      <tr>
                        <th rowSpan={2}>Collection option</th>
                        <th rowSpan={2}>Packaging Price</th>
                        <th colSpan={2}>Weight</th>
                        <th colSpan={4} className="text-center">Freight</th>
                        <th colSpan={4} className="text-center">Delivery</th>
                      </tr>
                      <tr>
                        <th>min(>)</th>
                        <th>max({`<`} or =)</th>
                        <th>rate</th>
                        <th>min</th>
                        <th>cap</th>
                        <th>fixed</th>
                        <th>rate</th>
                        <th>min</th>
                        <th>cap</th>
                        <th>fixed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeItem.policies && routeItem.policies.length > 0 && routeItem.policies.sort(function (a, b) {
                        return (a.id === '') - (b.id === '') || +(a.id > b.id) || -(a.id < b.id);
                      }).filter(item => item.customer_type === 'INDIVIDUAL').map((policy, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              className="form-control"
                              name={"collection_option"}
                              value={policy.collection_option}
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                            >
                              {collect_options.map((item) => (
                                <option value={item}>{item}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'packaging_price'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.packaging_price} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'weight_bounds.lowerBound'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.weight_bounds.lowerBound} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'weight_bounds.upperBound'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.weight_bounds.upperBound} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'freight.rate'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.freight.rate} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'freight.min'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.freight.min} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'freight.cap'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.freight.cap} />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              name={'freight.fixed'}
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, !policy.freight.fixed)}
                              checked={policy.freight.fixed}
                              type="checkbox" />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'delivery.rate'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.delivery.rate} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'delivery.min'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.delivery.min} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'delivery.cap'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.delivery.cap} />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              name={'delivery.fixed'}
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, !policy.delivery.fixed)}
                              checked={policy.delivery.fixed}
                              type="checkbox" />
                          </td>
                          <td className="align-middle">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => remove(index)}><i className="fa fa-trash" /></button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="13" className="text-end">
                          <button type="button" className="btn btn-outline-success btn-sm" onClick={() => push()}><i className="fa fa-plus" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Modal.Body>


            </div>
            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">


              <Modal.Body className="overlay overlay-block cursor-default">
                <div className="form form-label-right">
                  <input type="hidden" name="source" value={routeItem.source} />
                  <input type="hidden" name="destination" value={routeItem.destination} />
                  <Table striped>
                    <thead>
                      <tr>
                        <th rowSpan={2}>Collection option</th>
                        <th rowSpan={2}>Packaging Price</th>
                        <th colSpan={2}>Weight</th>
                        <th colSpan={4} className="text-center">Freight</th>
                        <th colSpan={4} className="text-center">Delivery</th>
                      </tr>
                      <tr>
                        <th>min(>)</th>
                        <th>max({`<`} or =)</th>
                        <th>rate</th>
                        <th>min</th>
                        <th>cap</th>
                        <th>fixed</th>
                        <th>rate</th>
                        <th>min</th>
                        <th>cap</th>
                        <th>fixed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeItem.policies && routeItem.policies.length > 0 && routeItem.policies.sort(function (a, b) {
                        return (a.id === '') - (b.id === '') || +(a.id > b.id) || -(a.id < b.id);
                      }).filter(item => item.customer_type === 'CORPORATE').map((policy, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              className="form-control"
                              name={"collection_option"}
                              value={policy.collection_option}
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                            >
                              {collect_options.map((item) => (
                                <option value={item}>{item}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'packaging_price'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.packaging_price} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'weight_bounds.lowerBound'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.weight_bounds.lowerBound} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'weight_bounds.upperBound'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.weight_bounds.upperBound} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'freight.rate'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.freight.rate} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'freight.min'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.freight.min} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'freight.cap'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.freight.cap} />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              name={'freight.fixed'}
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, !policy.freight.fixed)}
                              checked={policy.freight.fixed}
                              type="checkbox" />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'delivery.rate'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.delivery.rate} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'delivery.min'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.delivery.min} />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={'delivery.cap'}
                              className="form-control"
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, e.target.value)}
                              value={policy.delivery.cap} />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              name={'delivery.fixed'}
                              onChange={(e) => handleChangeText(index, policy.id, e.target.name, !policy.delivery.fixed)}
                              checked={policy.delivery.fixed}
                              type="checkbox" />
                          </td>
                          <td className="align-middle">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => remove(index)}><i className="fa fa-trash" /></button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="13" className="text-end">
                          <button type="button" className="btn btn-outline-success btn-sm" onClick={() => push()}><i className="fa fa-plus" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Modal.Body>
            </div>
          </div>


          <Modal.Footer>
            <button
              type="button"
              className="btn btn-light btn-elevate"
              onClick={onHide}
            >
              Cancel
            </button>
            <> </>
            <button
              disabled={actionsLoading}
              type="submit"
              onClick={() => saveRoute(routeItem)}
              className="btn btn-secondary btn-elevate"
            >
              Save
            </button>
          </Modal.Footer>
        </>
      )}
    </>
  );
}
