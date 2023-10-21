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
import { useStore } from 'react-redux';
import { setModuleInfoToCopy, setModuleIdToMove } from '../redux/slices/module';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../redux/slices/language';
import Language, { convertToName } from '../types/Language';
import store from '../redux/store';
import { selectIsLogin } from '../redux/slices/authentication';
import NoAuthorization from '../components/NoAuthorization';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.modify>>;
}

interface loaderReturnType {
    module: Module,
    moduleId: string
}

export async function loader({ params }: Args): Promise<loaderReturnType> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let module = await getModule(fileId);

    if (module.language === undefined) {
        module.language = store.getState().language.language;
    }

    return { module, moduleId: fileId };
}

export default function ModifyModule() {
    console.log("ModifyFile");

    const loaderData = useLoaderData() as loaderReturnType;
    const navigate = useNavigate();
    const store = useStore();
    const language = useSelector(selectLanguage);
    const isLogin = useSelector(selectIsLogin);
    const [isRemovingModule, setIsRemovingModule] = useState(false);

    if(!isLogin)
    {
        return(<NoAuthorization language={language}></NoAuthorization>)
    }

    let module = loaderData.module;

    if (isRemovingModule) {
        removeModule(loaderData.moduleId).then(() => {
            navigate(-1);
            setIsRemovingModule(false);
        }).catch((exception: any) => console.log(exception));
    }

    return (
        <>
            <h2 className='modify-filename'>{module.name}</h2>

            <ModuleFormik module={module} initialContent={getContentFromModule(module)} onSubmit={updateModule}></ModuleFormik>

            <section className='additional-mudule-options-section'>
                <button className='move-file-button' onClick={() => onClickMoveButton()}>Przenieś plik</button>
                <button className='copy-file-button' onClick={() => onClickCopyButton()}>Skopiuj plik</button>
            </section>

            <button className='remove-file-button' onClick={() => onClickRemoveButton()}>Usuń plik</button>
            {isRemovingModule && <span>Usuwanie...</span>}
        </>
    );

    function onClickRemoveButton() {
        let result = window.confirm("napewno usunąć moduł?");

        if (result) {
            setIsRemovingModule(true);
        }
    }

    function onClickMoveButton() {
        store.dispatch(setModuleIdToMove(loaderData.moduleId));

        //nazwa

        navigate(`/${convertToName(language)}/browser/home`);
    }

    function onClickCopyButton() {
        store.dispatch(setModuleInfoToCopy({moduleId: loaderData.moduleId, moduleName: loaderData.module.name}));

        navigate(`/${convertToName(language)}/browser/home`);
    }

    // na glowna strone -> w stai

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

    // async function moveModule(values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) {
    //     console.log("savings");

    //     try {
    //         await updateModuleInGoogleDrive(loaderData.fileId, values.module, module.name);
    //         console.log("updated all correctly");
    //         navigate(-1);
    //     } catch (error: any) {
    //         console.error("Error occured:", error);
    //     }
    // }

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