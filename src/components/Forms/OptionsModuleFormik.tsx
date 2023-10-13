import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import OptionsModuleForm from './OptionsModuleForm';
import '../../css/Forms/OptionsModuleFormik.css';
import { useStore } from 'react-redux';
import { selectAllOptions, selectDisplayMode, setDisplayMode, setIsHidden, setPlayBackSpeed } from '../../redux/slices/moduleOptions';
import { useSelector } from 'react-redux';

export interface FormikValuesType {
    displayMode: string;
    playBackSpeed: number;
    isHidden: boolean;
}

interface OptionsModuleFormikProps {
    closeModal: () => void;
}

export default function OptionsModuleFormik({ closeModal }: OptionsModuleFormikProps) {
    const store = useStore();
    let allOptions = useSelector(selectAllOptions);
    return (
        <Formik
            initialValues={{ displayMode: allOptions.displayMode, playBackSpeed: allOptions.playBackSpeed, isHidden: allOptions.isHidden }}
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

    function onSubmit(values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) {
        store.dispatch(setDisplayMode(values.displayMode));
        store.dispatch(setPlayBackSpeed(values.playBackSpeed));
        store.dispatch(setIsHidden(values.isHidden));

        // ciasteczka

        closeModal();
    }

    function onValidate(values: FormikValuesType): FormikErrors<FormikValuesType> {
        let errors: FormikErrors<FormikValuesType> = {};

        console.log(values);
        return errors;
    }
}