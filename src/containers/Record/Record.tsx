import { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import ModuleFormik, { FormikValuesType } from '../../components/Forms/Module/ModuleFormik';
import { saveModuleToGoogleDrive } from '../../google/GoogleDriveService';
import { authorizedAccess } from '../../google/services/AuhorizationService';
import Module from '../../models/Module';
import { useAppSelector } from '../../redux/hook';
import { selectCurrentParentFolderId } from '../../redux/slices/folder';
import './Record.scss';

export async function loader(): Promise<boolean | Response> {
    let authorizedResponse = await authorizedAccess();

    if (authorizedResponse !== undefined) {
        return authorizedResponse;
    }

    return true;
}

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

        try {
            await saveModuleToGoogleDrive(values.module, currentParentFolderId);
            console.log("saving all correctly");
            navigate(-1);
        } catch (error: any) {
            console.error("Error occured:", error);
        }
    }
}