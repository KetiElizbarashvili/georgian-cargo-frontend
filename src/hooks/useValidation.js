import {useState} from "react";

export default function useValidation(vest) {
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    const validate = async (subject, field = false) => {
        return new Promise((resolve, reject) => {
            let validation = {};
            if (!field) {
                validation = vest(subject, null);
            } else {
                validation = vest(subject, field);
            }
            setHasErrors(validation.hasErrors());
            if (validation.hasErrors()) {
                let nextErrors = {...errors};
                for (const key of Object.keys(validation.tests)) {
                    const err = validation.tests[key].errors;
                    if (!err || err.length === 0)
                        nextErrors = {...nextErrors, [key]: null};
                    else nextErrors = {...nextErrors, [key]: err[0]};
                }
                // Set errors
                setErrors(nextErrors);
                reject(validation.getErrors());
            } else {
                if (!field) {
                    setErrors({});
                } else {
                    setErrors({...errors, [field]: null});
                }
                resolve();
            }
        });
    };

    const resetErrors = () => {
        setErrors({});
        setHasErrors(false);
    };

    const addCustomError = (field, error) => {
        const oldErrors = errors[field] || [];
        setErrors({...errors, [field]: [...oldErrors, error]});
        setHasErrors(true);
    };
    const addErrors = (errors) => {
        setErrors(errors);
        setHasErrors(true);
    };

    return {validate, errors, hasErrors, addCustomError, resetErrors, addErrors};
}
