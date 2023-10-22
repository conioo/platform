import { useEffect, useState } from 'react';
import '../css/Buttons.css';
import '../css/FileBrowser.css';
import { createFolderInGoogleDrive, findFolderIdByPath, getListOfFiles, isEmptyFolder, removeFolderFromGoogleDrive } from '../google/GoogleDriveService';
import File from '../models/File';
import '../css/fontello/css/fontello.css';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import Paths from '../router/Paths';
import { selectIsLogin } from '../redux/slices/authentication';
import module, { setModuleInfoToCopy, selectModuleIdToMove, setParentFolderId, selectModuleInfoToCopy } from '../redux/slices/module';
import RowOfModule from '../components/RowOfModule';
import RowOfFolder from '../components/RowOfFolder';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { selectBasePath, selectLanguage } from '../redux/slices/language';
import { useSelector } from 'react-redux';
import Pastemodule from '../components/PasteModule';

interface FilesInfo {
    parentFolderId: string;
    fullPath: string;
    files: File[];
    folders: File[];
}

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.browser>>;
}

interface loaderReturnType {
    path: string;
    folderNames: string[];
}

//let reloadFiles = false;

export async function loader({ params }: Args): Promise<loaderReturnType> {
    let path = params['*'];

    if (!path) {
        throw new Error("invalid browser path");
    }

    const folderNames = path.split('/').filter((name: any) => name !== '') as string[];

    if (folderNames[0] != "home") {
        throw new Error("invalid browser path");
    }

    folderNames.shift();

    return { path, folderNames };
}

export default function FileBrowser() {
    console.log("FileBrowser");

    let loaderData = useLoaderData() as loaderReturnType;
    const [filesInfo, setFilesInfo] = useState<FilesInfo>();
    let dispatch = useAppDispatch();
    const language = useSelector(selectLanguage);

    useEffect(() => {
        getFilesInfo(loaderData).then(filesInfo => {
            setFilesInfo(filesInfo);
            dispatch(setParentFolderId(filesInfo.parentFolderId));
        });
    }, [loaderData]);

    // if (reloadFiles) {
    //     reloadFiles = false;
    //     setFilesInfo(newFilesInfo);
    // }

    let isLogin = useAppSelector(selectIsLogin);

    let moduleInfoToCopy = useSelector(selectModuleInfoToCopy);
    let moduleIdToMove = useSelector(selectModuleIdToMove);

    const navigate = useNavigate();

    let basePath = useSelector(selectBasePath);

    let listOfNameFiles: Array<JSX.Element> | undefined;
    let listOfNameFolders: Array<JSX.Element> | undefined;
    let paths: JSX.Element[] | undefined;

    // if (language === Language.Spanish) {
    //     return (
    //         <>
    //             <h2>Język Hiszpański dostępny dla użytkowników z subskrypcją premium </h2>
    //             <button onClick={() => alert("Kartofle")}>Wykup Substrypcje</button>
    //         </>
    //     )
    // }

    if (filesInfo !== undefined) {
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

        let currentPath = basePath + "/browser";

        paths = folderNames.map((segmentPath, index) => {
            currentPath += "/" + segmentPath;
            let path = currentPath;

            return (<>
                <span onClick={() => navigate(path)} className='current-path-span' key={index + "seg"}>{segmentPath}</span>
                <span key={index + "sep"}>/</span>
            </>);
        });
    }

    return (
        <>
            <section className='paths-section'>
                <div>
                    {paths}
                </div>
            </section>

            <ul className='list-of-files'>
                {listOfNameFolders}
                {listOfNameFiles}
            </ul>

            <Pastemodule moduleInfoToCopy={moduleInfoToCopy} moduleIdToMove={moduleIdToMove} updateListOfFiles={updateListOfFiles}></Pastemodule>

            {isLogin &&
                <section className='new-file-section'>
                    <button className='new-file-button' onClick={() => { navigate(basePath + "/record") }}>Nowy plik</button>
                    <button className='new-file-button' onClick={() => { createNewFolder() }}>Nowy folder</button>
                </section>}
        </>
    );

    async function updateListOfFiles() {
        if (filesInfo === undefined) {
            return;
        }

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
        if (filesInfo === undefined) {
            return;
        }
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

    async function getFilesInfo(loaderData: loaderReturnType) {
        const folderId = await findFolderIdByPath(loaderData.folderNames, language);

        if (!folderId) {
            throw new Error("invalid browser path");
        }

        let listOfFiles = await getListOfFiles(folderId) as FilesInfo;
        listOfFiles.parentFolderId = folderId;
        listOfFiles.fullPath = loaderData.path;

        // reloadFiles = true;

        return listOfFiles;
    }
}