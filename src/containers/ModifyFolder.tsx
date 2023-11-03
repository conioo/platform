import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import '../css/Modify.css';
import { changeFolderName, getFolderName, removeFolder } from '../google/GoogleDriceAuthorizeService';
import { isEmptyFolder } from '../google/GoogleDriveService';
import { authorizedAccess } from '../google/services/AuhorizationService';
import useLogoutRedirect from '../hooks/LogoutRedirect';
import { useAppDispatch } from '../redux/hook';
import { setFolderIdToMove, setFolderInfoToCopy } from '../redux/slices/folder';
import { selectLanguage } from '../redux/slices/language';
import Paths from '../router/Paths';
// import 'bootstrap/dist/css/bootstrap.min.css';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.modifyFolder>>;
}

interface loaderReturnType {
    folderNamePromise: Promise<string>;
    folderId: string;
}

export async function loader({ params }: Args): Promise<loaderReturnType | Response> {
    const folderId = params.folderid;

    if (!folderId) {
        throw new Error("missing folder id");
    }

    let authorizedResponse = await authorizedAccess();

    if (authorizedResponse !== undefined) {
        return authorizedResponse;
    }

    let folderNamePromise = getFolderName(folderId);

    return { folderNamePromise, folderId };
}

export default function ModifyFolder() {
    console.log("ModifyFolder");

    const loaderData = useLoaderData() as loaderReturnType;
    const [folderName, setFolderName] = useState("\u200B");
    const [folderNameForm, setFolderNameForm] = useState("");

    useEffect(() => {
        loaderData.folderNamePromise.then(folderName => {
            setFolderName(folderName);
            setFolderNameForm(folderName)
        });
    }, [loaderData]);


    const navigate = useNavigate();
    const language = useSelector(selectLanguage);
    const [isRemovingFolder, setIsRemovingFolder] = useState(false);
    const dispatch = useAppDispatch();

    useLogoutRedirect();

    if (isRemovingFolder) {
        remove();
        setIsRemovingFolder(false);
    }

    return (
        <>
            <button className='icon-reply options-button return-button' onClick={() => navigate(-1)} type="button"></button>

            <h2 className='modify-filename'>{folderName}</h2>

            <input value={folderNameForm} onChange={(e) => setFolderNameForm(e.currentTarget.value)}></input>
            <button className='common-button common-modify-button' onClick={() => onClickSaveButton()}>Zapisz</button>

            <section className='additional-modify-options-section'>
                <button className='additional-button' onClick={() => onClickMoveButton()}>Przenieś folder</button>
                <button className='additional-button' onClick={() => onClickCopyButton()}>Skopiuj folder</button>
            </section>

            <button className='remove-file-button' onClick={() => onClickRemoveButton()}>Usuń folder</button>
            {isRemovingFolder && <span>Loading...</span>}
        </>
    );

    async function remove() {
        let isEmpty = await isEmptyFolder(loaderData.folderId);

        if (!isEmpty) {
            let result = window.confirm("Folder zawiera zawartość czy napewno usunąć wraz z zawartością?")

            if (!result) {
                return;
            }
        }

        await removeFolder(loaderData.folderId);
        navigate(-1);
    }

    async function onClickSaveButton() {
        await changeFolderName(loaderData.folderId, folderNameForm);
        setFolderName(folderNameForm);
    }

    function onClickRemoveButton() {
        let result = window.confirm("napewno usunąć moduł?");

        if (result) {
            setIsRemovingFolder(true);
        }
    }

    function onClickMoveButton() {
        dispatch(setFolderIdToMove(loaderData.folderId));

        navigate(`/${language}/browser/home`);
    }

    function onClickCopyButton() {
        dispatch(setFolderInfoToCopy({ folderId: loaderData.folderId, folderName: folderName }));

        navigate(`/${language}/browser/home`);
    }
}