import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import './css/Buttons.css';
import './css/Colouring.css';
import './css/ModuleForm.css';
import Module from '../../../models/Module';
import Segment from '../../../models/Segment';
import Language from '../../../types/Language';
import ModuleForm from "./ModuleForm";
import TargetLanguage from '../../../types/TargetLanguage';

const segmentScheme = Yup.object().shape({
});

const sectionScheme = Yup.object().shape({
    segments: Yup.array<Segment>()
        .required()
});

const moduleScheme = Yup.object({
    name: Yup.string()
        .min(1, 'Must be 1 characters or more')
        .required('Required'),
    language: Yup.mixed<Language>()
    .oneOf(Object.values(Language), "invalid language type")
        .required('Required'),
    targetLanguage: Yup.mixed<TargetLanguage>()
        .oneOf(Object.values(TargetLanguage), "invalid language type")
        .required('Required'),
    voiceName: Yup.string()
        .min(1, 'Must be 1 characters or more')
        .required('Required'),
    sections: Yup.array()
        .of(sectionScheme)
        .required()
    // segments: Yup.array<undefined, Segment>()
    //     .min(1, 'Must be at least 1 element')
    //     .required('Required'),
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