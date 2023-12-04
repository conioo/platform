import { Form, Formik, FormikHelpers } from 'formik';
import { useCookies } from 'react-cookie';
import { useSelector, useStore } from 'react-redux';
import * as Yup from 'yup';
import { ModuleOptionsState, selectAllOptions, setOptions } from '../../../../redux/slices/moduleOptions';
import OptionsModuleForm from '../OptionsModuleForm';
import './OptionsModuleFormik.scss';
import ViewModes from '../../../../types/ViewModes';

interface OptionsModuleFormikProps {
    closeModal: () => void;
    defaultVoiceName: string;
    show: boolean;
}

export default function OptionsModuleFormik({ show, closeModal, defaultVoiceName }: OptionsModuleFormikProps) {
    const store = useStore();

    let allOptions = useSelector(selectAllOptions);

    const [cookie, setCookie] = useCookies(['view-options']);

    const yupScheme = Yup.object({
        playBackSpeed: Yup.number()
            .min(0.1, "Must be at least 0.1")
            .max(2, "Must be less than 2")
            .required('Required'),
        displayMode: Yup.mixed<ViewModes>()
            .oneOf(Object.values(ViewModes), "invalid view mode")
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
            <Form className="options-module-formik">
                <OptionsModuleForm show={show} closeModal={closeModal} defaultVoiceName={defaultVoiceName}></OptionsModuleForm>
            </Form>
        </Formik>
    );

    function onSubmit(values: ModuleOptionsState, formikHelpers: FormikHelpers<ModuleOptionsState>) {
        console.log("koniec");

        store.dispatch(setOptions(values));
        setCookie('view-options', values);

        closeModal();
    }
}