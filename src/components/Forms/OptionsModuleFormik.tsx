import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import OptionsModuleForm from './OptionsModuleForm';
import '../../css/Forms/OptionsModuleFormik.css';
import { useStore, useSelector } from 'react-redux';
import { ModuleOptionsState, selectAllOptions, setVoiceName } from '../../redux/slices/moduleOptions';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

interface OptionsModuleFormikProps {
    closeModal: () => void;
}

export default function OptionsModuleFormik({ closeModal }: OptionsModuleFormikProps) {
    const store = useStore();

    let allOptions = useSelector(selectAllOptions);

    const [cookie, setCookie] = useCookies(['view-options']);

    return (
        <Formik
            initialValues={allOptions}
            onSubmit={onSubmit}
            validate={onValidate}
            validateOnChange={false}
            validateOnBlur={false}
        >
            <Form className="options-module-form">
                <OptionsModuleForm closeModal={closeModal}></OptionsModuleForm>
            </Form>
        </Formik>
    );

    function onSubmit(values: ModuleOptionsState, formikHelpers: FormikHelpers<ModuleOptionsState>) {
        setCookie('view-options', values);

        closeModal();
    }

    function onValidate(values: ModuleOptionsState): FormikErrors<ModuleOptionsState> {
        let errors: FormikErrors<ModuleOptionsState> = {};

        console.log(values);
        return errors;
    }
}