import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import Module from "../../models/Module";
import '../../css/Record.css';
import '../../css/Buttons.css';
import '../../css/Colouring.css';
import '../../css/ModuleForm.css';
import ModuleForm from "./ModuleForm";
import * as Yup from 'yup';
import Language from '../../types/Language';

export interface FormikValuesType {
    module: Module;
    content: string;
}

interface ModuleFormProps {
    initialContent?: string;
    module?: Module;
    onSubmit: (values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) => void | Promise<any>;
}

export default function ModuleFormik({ module = new Module(), initialContent = "", onSubmit }: ModuleFormProps) {
    // const yupScheme = Yup.object({
    //     firstName: Yup.string()
    //       .max(15, 'Must be 15 characters or less')
    //       .required('Required'),
    //     lastName: Yup.string()
    //       .max(20, 'Must be 20 characters or less')
    //       .required('Required'),
    //     email: Yup.string().email('Invalid email address').required('Required'),
    //   });
    return (
        <Formik
            initialValues={{ module, content: initialContent }}
            onSubmit={onSubmit}
            validate={onValidate}
            validateOnChange={false}
            validateOnBlur={false}
        >
            <Form className="module-form">
                <ModuleForm></ModuleForm>
            </Form>
        </Formik>
    );
}

function onValidate(values: FormikValuesType): FormikErrors<FormikValuesType> {
    let errors: FormikErrors<FormikValuesType> = {};
    let moduleErrors: FormikErrors<Module> = {};

    console.log(values);

    if (values.module.name.length < 1) {
        errors.module = moduleErrors;
        errors.module.name = `the module name should have at least 1 character, now it has ${values.module.name.length}`;
    }

    if (values.module.language !== Language.English && values.module.language !== Language.German) {
        errors.module = moduleErrors;
        errors.module.language = `invalid language type ${values.module.language}`;
    }

    if (values.module.voiceType < 0 || values.module.voiceType > 3) {
        errors.module = moduleErrors;
        errors.module.voiceType = `invalid voice type ${values.module.voiceType}`;
    }

    if (values.module.segments.length < 1 || (values.module.segments.length === 1 && values.module.segments[0].sentence === "")) {
        errors.module = moduleErrors;
        errors.module.segments = "the module name should have at least 1 segment";
    }

    if (errors.module) {
        alert(JSON.stringify(errors));
    }

    return errors;
}