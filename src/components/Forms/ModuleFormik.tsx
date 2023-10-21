import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import Module from "../../models/Module";
import '../../css/Record.css';
import '../../css/Buttons.css';
import '../../css/Colouring.css';
import '../../css/ModuleForm.css';
import ModuleForm from "./ModuleForm";
import * as Yup from 'yup';
import Language from '../../types/Language';
import Segment from '../../models/Segment';

const moduleScheme = Yup.object({
    name: Yup.string()
        .min(1, 'Must be 1 characters or more')
        .required('Required'),
    language: Yup.number()
        .oneOf([Language.English, Language.German], "invalid language type")
        .required('Required'),
    voiceName: Yup.string()
        .min(1, 'Must be 1 characters or more')
        .required('Required'),
    segments: Yup.array<undefined, Segment>()
        .min(1, 'Must be at least 1 element')
        .required('Required'),
});

const formikValuesScheme = Yup.object({
    content: Yup.string()
        .min(1, 'Must be 1 characters or more')
        .required('Required'),

    module: moduleScheme
});

export type FormikValuesType = Yup.InferType<typeof formikValuesScheme>;

interface ModuleFormProps {
    initialContent?: string;
    module?: Module;
    onSubmit: (values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) => void | Promise<any>;
}

export default function ModuleFormik({ module = new Module(), initialContent = "", onSubmit }: ModuleFormProps) {
    return (
        <Formik
            initialValues={{ module, content: initialContent }}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
        >
            <Form className="module-form">
                <ModuleForm></ModuleForm>
            </Form>
        </Formik>
    );
}