import React from "react";
import { useFormikContext } from "formik";
import { Util } from "utils";

export function Radio({ type, label, size, className, ...props }) {
  const { setFieldValue } = useFormikContext();
  const { field } = props;
  const thisValue = Util.getChildValue(props.form.values, field.name);
  console.log(thisValue);
  const nextValue = type === "radio" ? props.value : !thisValue;
  const isChecked = type === "radio" ? thisValue === props.value : thisValue;
  const typeD = type === "radio" ? type : "checkbox";
  let classes = [typeD];
  if (className) {
    classes.push(className);
  }
  if (size === 'lg') {
    classes.push(`${typeD}-lg`);
  }
  if (typeD === 'checkbox') {
    classes.push(`checkbox-single`);
  }
  return (
    <>
      <label className={classes.join(' ')}>
        <input type={typeD} name={field.name} checked={isChecked} onChange={() => setFieldValue(field.name, nextValue)} />
        <span className="mr-3" />
        {label}
      </label>
    </>
  );
}
