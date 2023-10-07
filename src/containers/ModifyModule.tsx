import React, { useState, useEffect } from 'react';
import '../css/Buttons.css';
import '../css/ModifyModule.css';
import Segment from '../models/Segment';
import { getModule, removeModule, updateModuleInGoogleDrive } from '../google/GoogleDriveService';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import Paths from '../router/Paths';
import Module from '../models/Module';
import ModuleFormik, { FormikValuesType } from '../components/Forms/ModuleFormik';
import { FormikHelpers } from 'formik';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.modify>>;
}

interface loaderReturnType {
    module: Module,
    fileId: string
}

export async function loader({ params }: Args): Promise<loaderReturnType> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let module = await getModule(fileId);

    return { module, fileId };
}

export default function ModifyModule() {
    console.log("ModifyFile");

    const loaderData = useLoaderData() as loaderReturnType;
    const navigate = useNavigate();
    let module = loaderData.module;

    const [isRemovingModule, setIsRemovingModule] = useState(false);
    //     const [isSaving, setIsSaving] = useState(false);

    if (isRemovingModule) {
        removeModule(loaderData.fileId).then(() => {
            navigate(-1);
            setIsRemovingModule(false);
        }).catch(exception => console.log(exception));
    }

    //module ->
    return (
        <>
            <h2 className='modify-filename'>{module.name}</h2>

            <ModuleFormik module={module} initialContent={getContentFromModule(module)} onSubmit={updateModule}></ModuleFormik>

            <div>
                <button className='move-file-button' onClick={() => setIsRemovingModule(true)}>Przenieś plik</button>
                <button className='copy-file-button' onClick={() => setIsRemovingModule(true)}>Skopiuj plik</button>
                <button className='remove-file-button' onClick={() => setIsRemovingModule(true)}>Usuń plik</button>
                {isRemovingModule && <span>Usuwanie...</span>}
            </div>

        </>
    );

    async function updateModule(values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) {
        console.log("savings");

        try {
            await updateModuleInGoogleDrive(loaderData.fileId, values.module, module.name);
            console.log("updated all correctly");
            navigate(-1);
        } catch (error: any) {
            console.error("Error occured:", error);
        }
    }

    function getContentFromModule(module: Module) {
        let content = "";

        for (let i = 0; i < module.segments.length; ++i) {
            content += module.segments[i].sentence + "\n";
        }

        if (content.length > 0) {
            content = content.slice(0, -1);
        }

        return content;
    }
}