import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import ModuleFormik, { FormikValuesType } from '../../components/Forms/Module/ModuleFormik/ModuleFormik';
import { getModule, removeModule, updateModuleInGoogleDrive } from '../../google/GoogleDriveService';
import { authorizedAccess } from '../../google/services/AuhorizationService';
import Module from '../../models/Module';
import { selectLanguage } from '../../redux/slices/language';
import { setModuleIdToMove, setModuleInfoToCopy } from '../../redux/slices/module';
import Paths from '../../router/Paths';
import './ModifyModule.scss';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/Spinner';

//usuwanie nie wraca w dobre miejsce
//spinner do wklejania

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.modify>>;
}

interface loaderReturnType {
    module: Module,
    moduleId: string
}

export async function loader({ params }: Args): Promise<loaderReturnType | Response> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let authorizedResponse = await authorizedAccess();

    if (authorizedResponse !== undefined) {
        return authorizedResponse;
    }

    let module = await getModule(fileId);

    return { module, moduleId: fileId };
}

export default function ModifyModule() {
    console.log("ModifyFile");

    const loaderData = useLoaderData() as loaderReturnType;
    const navigate = useNavigate();
    const store = useStore();
    const language = useSelector(selectLanguage);
    const [isRemovingModule, setIsRemovingModule] = useState(false);
    const [showForm, setShowForm] = useState(false);

    let module = loaderData.module;

    if (isRemovingModule) {
        removeModule(loaderData.moduleId).then(() => {
            setIsRemovingModule(false);
            navigate(-1);
        }).catch((exception: any) => console.log(exception));
    }

    if (showForm) {
        return (
            <ModuleFormik module={module} initialContent={getContentFromModule(module)} onSubmit={updateModule}></ModuleFormik>
        );
    }

    return (
        <section className='modify-module'>
            <h1 className='modify-module__filename'>{module.name}</h1>

            <Button onClick={() => setShowForm(true)} variant='outline-secondary'>Modyfikowanie</Button>

            <section className='modify-module__buttons-section'>
                <Button className='modify-module__button' variant='blue' onClick={() => onClickMoveButton()}>Przenieś plik</Button>
                <Button className='modify-module__button' variant='blue' onClick={() => onClickCopyButton()}>Skopiuj plik</Button>
            </section>

            {!isRemovingModule &&
                <Button className='modify-module__remove-button' variant='danger' onClick={() => onClickRemoveButton()}>
                    Usuń plik
                </Button>
            }

            {isRemovingModule &&
                <Button className='modify-module__remove-button' variant='danger' disabled>
                    <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                        <span className="visually-hidden">Usuwanie...</span>
                    </Spinner>
                    Usuwanie...
                </Button>
            }
        </section>
    );

    function onClickRemoveButton() {
        let result = window.confirm("napewno usunąć moduł?");

        if (result) {
            setIsRemovingModule(true);
        }
    }

    function onClickMoveButton() {
        store.dispatch(setModuleIdToMove(loaderData.moduleId));

        navigate(`/${language}/browser/home`);
    }

    function onClickCopyButton() {
        store.dispatch(setModuleInfoToCopy({ moduleId: loaderData.moduleId, moduleName: loaderData.module.name }));

        navigate(`/${language}/browser/home`);
    }

    async function updateModule(values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) {
        console.log("savings");

        try {
            await updateModuleInGoogleDrive(loaderData.moduleId, values.module, module.name);
            console.log("updated all correctly");
            navigate(-1);
        } catch (error: any) {
            console.error("Error occured:", error);
        }
    }

    function getContentFromModule(module: Module) {
        let content = "";

        for (const section of module.sections) {
            for (const segment of section.segments) {
                content += segment.sentence + " ";
            }
            content += "\n";
        }

        if (content.length > 0) {
            content = content.slice(0, -1);
        }

        return content;
    }
}