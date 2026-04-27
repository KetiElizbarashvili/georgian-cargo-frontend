// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { setLocale } from "yup";
import SingleSelect from "../../utils/SingleSelect";
import { countries, currencies } from "../../utils";

setLocale({
  string: {
    required: 'Field is required',
  },
});

const RouteCreateSchema = Yup.object().shape({
  source: Yup.string().required(),
  destination: Yup.string().required(),
  currency: Yup.string().required(),
});
export function RouteCreateForm({ routeItem, saveRoute, actionsLoading, onHide }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={routeItem}
        validationSchema={RouteCreateSchema}
        onSubmit={(values, actions) => {
          saveRoute(values, actions.setStatus);
        }}
      >
        {({ handleSubmit, values, status }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              {status && <Alert variant="danger">{status}</Alert>}
              <Form className="form form-label-right">
                <Row>
                  <Col>
                    <Field
                      name="source"
                      component={SingleSelect}
                      options={countries}
                      defaultValue={values.source}
                      readOnly={!!values.source}
                      label="Source country"
                    />
                  </Col>
                  <Col>
                    <Field
                      name="destination"
                      component={SingleSelect}
                      options={countries}
                      defaultValue={values.destination}
                      readOnly={!!values.destination}
                      label="Destination country"
                    />
                  </Col>
                  <Col>
                    <Field
                      name="currency"
                      component={SingleSelect}
                      options={currencies}
                      defaultValue={values.currency}
                      label="Currency code"
                    />
                  </Col>
                </Row>
                <input type="hidden" name="destination" value={values.destination} />
              </Form>
            </Modal.Body>
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
                onClick={() => handleSubmit()}
                className="btn btn-secondary btn-elevate"
              >
                Create
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
