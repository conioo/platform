import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Module from '../../../../models/Module';
import Segment from '../../../../models/Segment';
import Language from '../../../../types/Language';
import ModuleForm from "../ModuleForm/ModuleForm";
import TargetLanguage from '../../../../types/TargetLanguage';
import './ModuleFormik.scss';
import ReturnButton from '../../../ReturnButton';

const segmentScheme = Yup.object({
    sentence: Yup.string()
        .required(),
    translation: Yup.string()
        .required(),
    sentenceColors: Yup.array()
        .of(Yup.number().required())
        .required(),
    translationColors: Yup.array()
        .of(Yup.number().required())
        .required(),
});

const sectionScheme = Yup.object().shape({
    segments: Yup.array()
        .of(segmentScheme)
        .required(),
    audioId: Yup.string()
        .nullable()//.notRequired()l;
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
        .oneOf(Object.values(TargetLanguage), "invalid target language type")
        .required('Required'),
    voiceName: Yup.string()
        .min(1, 'Must be 1 characters or more')
        .required('Required'),
    sections: Yup.array()
        .of(sectionScheme)
        .required('Required')
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
            <Form className="module-formik">
                <ReturnButton></ReturnButton>
                <ModuleForm></ModuleForm>
            </Form>
        </Formik>
    );
}