import { FormikErrors } from "formik";

export default function ErrorAlerts(errors: FormikErrors<any>) {

    let errorMessage = "";

    for (let key in errors) {
        if (key !== undefined) {
            if (errors.hasOwnProperty(key)) {
                errorMessage += key + ": " + errors[key] + "\n";
            }
        }
    }

    if (errorMessage.length > 0) {
        alert(errorMessage);
    }
}