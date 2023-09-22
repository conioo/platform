import { useEffect, useState } from 'react';
import '../css/Buttons.css';
import '../css/FileBrowser.css';
import { createFolderInGoogleDrive, findFolderIdByPath, getListOfFiles, isEmptyFolder, removeFolderFromGoogleDrive } from '../google/GoogleDriveService';
import File from '../models/File';
import '../css/fontello/css/fontello.css';
import { ActionFunctionArgs, Navigate, ParamParseKey, Params, useLoaderData, useNavigate, useOutletContext } from 'react-router-dom';
import Paths from '../router/Paths';
import { convertToName } from '../types/Language';
import { selectIsLogin } from '../redux/slices/authentication';
import { setParentFolderId } from '../redux/slices/module';
import RowOfModule from '../components/RowOfModule';
import RowOfFolder from '../components/RowOfFolder';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { selectLanguage } from '../redux/slices/language';
import store from '../redux/store';

interface FilesInfo {
    parentFolderId: string;
    fullPath: string;
    files: File[];
    folders: File[];
}

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.browser>>;
}

let reloadFiles = false;

export async function loader({ params }: Args): Promise<FilesInfo> {
    console.log("FileBrowserLoader");

    let path = params['*'];

    if (!path) {
        throw new Error("invalid browser path");
    }

    const folderNames = path.split('/').filter((name: any) => name !== '') as string[];

    if (folderNames[0] != "home") {
        throw new Error("invalid browser path");
    }

    folderNames.shift();

    let language = store.getState().language.language;

    let folderId = await findFolderIdByPath(folderNames, language);

    console.log(folderId);
    if (!folderId) {
        throw new Error("invalid browser path");
    }

    let listOfFiles = await getListOfFiles(folderId) as FilesInfo;
    listOfFiles.parentFolderId = folderId;
    listOfFiles.fullPath = path;

    reloadFiles = true;
    console.log("FileBrowserLoader-End");

    return listOfFiles;
}

export default function FileBrowser() {
    console.log("FileBrowser");

    let newFilesInfo = useLoaderData() as FilesInfo;

    const [filesInfo, setFilesInfo] = useState<FilesInfo>(newFilesInfo);

    if (reloadFiles) {
        reloadFiles = false;
        setFilesInfo(newFilesInfo);
    }

    let language = useAppSelector(selectLanguage);
    let isLogin = useAppSelector(selectIsLogin);
    let dispatch = useAppDispatch();
    const navigate = useNavigate();

    let languageName = convertToName(language);
    let basePath = "/" + languageName;

    let listOfNameFiles: Array<JSX.Element> | undefined;
    let listOfNameFolders: Array<JSX.Element> | undefined;

    dispatch(setParentFolderId(filesInfo.parentFolderId));

    listOfNameFiles = filesInfo.files.map((file, index) => {
        return (
            <RowOfModule isLogin={isLogin} file={file} basePath={basePath} key={index + "mod"}></RowOfModule>
        );
    });

    listOfNameFolders = filesInfo.folders.map((folder, index) => {
        return (
            <RowOfFolder isLogin={isLogin} folder={folder} basePath={basePath} fullPath={filesInfo.fullPath} removeFolder={removeFolder} key={index + "fol"}></RowOfFolder>
        );
    });

    const folderNames = filesInfo.fullPath.split('/').filter((name: any) => name !== '');

    let currentPath = "/" + languageName + "/browser";

    let paths = folderNames.map((segmentPath, index) => {
        currentPath += "/" + segmentPath;
        let path = currentPath;

        return (<>
            <span onClick={() => navigate(path)} className='current-path-span' key={Math.random()}>{segmentPath}</span>
            <span>/</span>
        </>);
    });

    return (
        <>
            <section className='paths-section'>
                <div>
                    {paths}
                </div>
                {/* {state.currentPath.length > 1 && <button onClick={() => backFromFolder(1)} className='return-folder-button'>Powrót</button>} */}
            </section>

            <ul className='list-of-files'>
                {listOfNameFolders}
                {listOfNameFiles}
            </ul>

            {isLogin &&
                <section className='new-file-section'>
                    <button className='new-file-button' onClick={() => { navigate(basePath + "/record") }}>Nowy plik</button>
                    <button className='new-file-button' onClick={() => { createNewFolder() }}>Nowy folder</button>
                </section>}
        </>
    );

    async function updateListOfFiles() {

        let listOfFiles = await getListOfFiles(filesInfo.parentFolderId);

        if (!listOfFiles) {
            return;
        }

        let newFilesInfo = { ...filesInfo };
        newFilesInfo.files = listOfFiles.files;
        newFilesInfo.folders = listOfFiles.folders;

        console.log(newFilesInfo);
        setFilesInfo(newFilesInfo);
    }

    async function createNewFolder() {
        const folderName = prompt('Wpisz nazwę folderu:');

        if (!folderName) {
            return;
        }

        await createFolderInGoogleDrive(folderName, filesInfo.parentFolderId);

        await updateListOfFiles();
    }

    async function removeFolder(folder: File) {
        if (!await isEmptyFolder(folder.id)) {
            alert("folder nie jest pusty");
            return;
        }

        await removeFolderFromGoogleDrive(folder.id);
        await updateListOfFiles();
    }

    // function backFromFolder(times: number) {
    //     if (times === 0) {
    //         return;
    //     }

    //     let newCurrentPath = state.currentPath.slice(0, -times);
    //     dispath({ type: ActionType.RefreshCurrentPath, payload: newCurrentPath });
    // }
}