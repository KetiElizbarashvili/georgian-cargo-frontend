// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Alert, Modal, Table } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Input, Radio } from "utils";
import { setLocale } from "yup";
import SingleSelect from "../../utils/SingleSelect";
import { emptyPolicy } from "./PoliciesEditModal";


setLocale({
  string: {
    required: 'Field is required',
  },
  number: {
    required: 'Field is required',
    // eslint-disable-next-line no-template-curly-in-string
    min: 'Min value is ${min}',
  },
});
const numSchema = Yup.number().typeError("Invalid number");
const collect_options = [
  'HOME', 'OFFICE'
];

export const RouteEditSchema = Yup.object().shape({
  policies: Yup.array().of(
    Yup.object().shape({
      collection_option: Yup.string().required(),
      packaging_price: numSchema.required().min(0),
      weight_bounds: Yup.object().shape({
        lowerBound: numSchema.required().min(0),
        upperBound: numSchema.required().min(Yup.ref('lowerBound')),
      }),
      freight: Yup.object().shape({
        rate: Yup.number().required().min(0),
        min: numSchema.required().min(0),
        cap: numSchema.required().min(Yup.ref('min')),
        fixed: Yup.bool()
      }),
      delivery: Yup.object().shape({
        rate: numSchema.required().min(0),
        min: numSchema.required().min(0),
        cap: numSchema.required().min(0),
        fixed: Yup.bool()
      }),
    })
  )
});
export function RouteEditForm({ saveRoute, route, actionsLoading, onHide }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={route}
        validationSchema={RouteEditSchema}
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
              {status && <Alert variant="danger">{status.map((err, index) => (<p key={index} className="m-0">{err}</p>))}</Alert>}
              <Form className="form form-label-right">
                <input type="hidden" name="source" value={values.source} />
                <input type="hidden" name="destination" value={values.destination} />
                <FieldArray name="policies" render={({ remove, push }) => (
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
                      {values.policies && values.policies.length > 0 && values.policies.map((policy, index) => (
                        <tr key={index}>
                          <td>
                            <input type="hidden" name={`policies.${index}.id`} defaultValue={values.policies[index].id} readOnly />
                            <Field
                              name={`policies.${index}.collection_option`}
                              component={SingleSelect}
                              options={collect_options}
                              value={values.policies[index].collection_option}
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.packaging_price`}
                              component={Input}
                              value={values.policies[index].packaging_price}
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.weight_bounds.lowerBound`}
                              component={Input}
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.weight_bounds.upperBound`}
                              component={Input}
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.freight.rate`}
                              component={Input}
                              placeholder="rate"
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.freight.min`}
                              component={Input}
                              placeholder="min"
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.freight.cap`}
                              component={Input}
                              placeholder="cap"
                              label={false}
                            />
                          </td>
                          <td className="align-middle">
                            <Field
                              name={`policies.${index}.freight.fixed`}
                              component={Radio}
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.delivery.rate`}
                              component={Input}
                              placeholder="rate"
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.delivery.min`}
                              component={Input}
                              placeholder="min"
                              label={false}
                            />
                          </td>
                          <td>
                            <Field
                              name={`policies.${index}.delivery.cap`}
                              component={Input}
                              placeholder="cap"
                              label={false}
                            />
                          </td>
                          <td className="align-middle">
                            <Field
                              name={`policies.${index}.delivery.fixed`}
                              component={Radio}
                              label={false}
                            />
                          </td>
                          <td className="align-middle">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => remove(index)}><i className="fa fa-trash" /></button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="12" className="text-end">
                          <button type="button" className="btn btn-outline-success btn-sm" onClick={() => push(emptyPolicy)}><i className="fa fa-plus" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )} />
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
                Save
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
