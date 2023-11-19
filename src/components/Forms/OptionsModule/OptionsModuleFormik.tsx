import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import OptionsModuleForm from './OptionsModuleForm';
import '../../../styles/Forms/OptionsModuleFormik.css';
import { useStore, useSelector } from 'react-redux';
import { ModuleOptionsState, selectAllOptions, setVoiceName } from '../../../redux/slices/moduleOptions';
import { useCookies } from 'react-cookie';
import * as Yup from 'yup';

interface OptionsModuleFormikProps {
    closeModal: () => void;
    defaultVoiceName: string;
}

export default function OptionsModuleFormik({ closeModal, defaultVoiceName }: OptionsModuleFormikProps) {
    const store = useStore();

    let allOptions = useSelector(selectAllOptions);

    const [cookie, setCookie] = useCookies(['view-options']);

    const yupScheme = Yup.object({
        playBackSpeed: Yup.number()
            .min(0.1, "Must be at least 0.1")
            .max(2, "Must be less than 2")
            .required('Required'),
        displayMode: Yup.string()
            .oneOf(["classic", "vertical", "overlay"], "Must be classic or vertical")
            .required('Required'),
        voiceName: Yup.string()
            .min(1, "Must be at least 1 sign")
            .required('Required')
    });

    return (
        <Formik
            initialValues={allOptions}
            onSubmit={onSubmit}
            validationSchema={yupScheme}
            validateOnChange={false}
            validateOnBlur={false}
        >
            <Form className="options-module-form">
                <OptionsModuleForm closeModal={closeModal} defaultVoiceName={defaultVoiceName}></OptionsModuleForm>
            </Form>
        </Formik>
    );

    function onSubmit(values: ModuleOptionsState, formikHelpers: FormikHelpers<ModuleOptionsState>) {
        setCookie('view-options', values);

        closeModal();
    }
}