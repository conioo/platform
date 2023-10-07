import '../css/Record.css';
import ModuleFormik, { FormikValuesType } from '../components/Forms/ModuleFormik';
import Module from '../models/Module';
import { FormikHelpers } from 'formik';
import { useAppSelector } from '../redux/hook';
import { selectCurrentParentFolderId } from '../redux/slices/module';
import { saveModuleToGoogleDrive } from '../google/GoogleDriveService';
import { useNavigate } from 'react-router-dom';

export default function Record() {
    console.log("Record");

    let currentParentFolderId = useAppSelector(selectCurrentParentFolderId);
    const navigate = useNavigate();

    return (
        <>
            <ModuleFormik module={new Module()} onSubmit={saveModule}></ModuleFormik>
        </>
    );

    async function saveModule(values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) {
        console.log("saving");
        console.log(values.module);

        try {
            await saveModuleToGoogleDrive(values.module, currentParentFolderId);
            console.log("saving all correctly");
            navigate(-1);
        } catch (error: any) {
            console.error("Error occured:", error);
        }
    }
}