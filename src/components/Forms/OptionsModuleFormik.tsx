import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import OptionsModuleForm from './OptionsModuleForm';
import '../../css/Forms/OptionsModuleFormik.css';
import { useStore, useSelector } from 'react-redux';
import { selectAllOptions} from '../../redux/slices/moduleOptions';
import { useCookies } from 'react-cookie';

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

    const [cookie, setCookie] = useCookies(['view-options']);//pobrac

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
        setCookie('view-options', values);

        closeModal();
    }

    function onValidate(values: FormikValuesType): FormikErrors<FormikValuesType> {
        let errors: FormikErrors<FormikValuesType> = {};

        console.log(values);
        return errors;
    }
}