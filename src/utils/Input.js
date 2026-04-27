import React from "react";
import { FieldFeedbackLabel, Util } from "utils";
import {useFormikContext} from "formik";

const getFieldCSSClasses = (touched, errors) => {
  let classes = ["form-control"];
  if (touched && errors) {
    classes.push("is-invalid");
  }

  if (touched && !errors) {
    classes.push("is-valid");
  }

  return classes.join(" ");
};

export function Input({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  isRequired,
  type = "text",
  afterChange = false,
  ...props
}) {
  const {setFieldValue, setFieldTouched} = useFormikContext();
  const thisTouched = Util.getChildValue(touched, field.name);
  const thisErrors = Util.getChildValue(errors, field.name);
  return (
    <>
      {label && <label>{label} {isRequired && <strong className="text-danger">*</strong>}</label>}
      <input
        type={type}
        className={getFieldCSSClasses(thisTouched, thisErrors)}
        {...field}
        {...props}
        onChange={({target: {value}}) => {
          setFieldValue(field.name, value || '');
        }}
        onBlur={() => {setFieldTouched(field.name, true)}}
      />
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={thisErrors}
          touched={thisTouched}
          label={label}
          type={type}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
