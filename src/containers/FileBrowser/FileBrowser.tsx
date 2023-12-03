import { useEffect, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Pastemodule from '../../components/PasteModule/PasteModule';
import RowOfFolder from '../../components/RowOfFolder/RowOfFolder';
import RowOfModule from '../../components/RowOfModule/RowOfModule';
import { createFolderInGoogleDrive, findFolderIdByPath, getListOfFiles } from '../../google/GoogleDriveService';
import File from '../../models/File';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectIsLogin } from '../../redux/slices/authentication';
import { setParentFolderId } from '../../redux/slices/folder';
import { selectBasePath, selectLanguage } from '../../redux/slices/language';
import Paths from '../../router/Paths';
import './FileBrowser.scss';

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


export async function loader({ params }: Args): Promise<loaderReturnType> {
    let path = params['*'];

    if (!path) {
        throw new Error("invalid browser path");
    }

    const folderNames = path.split('/').filter((name: any) => name !== '') as string[];

    if (folderNames[0] !== "home") {
        throw new Error("invalid browser path");
    }

    //folderNames.shift();

    return { path, folderNames };
}

export default function FileBrowser() {
    console.log("FileBrowser");

    let loaderData = useLoaderData() as loaderReturnType;
    const [filesInfo, setFilesInfo] = useState<FilesInfo>();
    const [folderOpenId, setFolderOpenId] = useState<string>();

    let dispatch = useAppDispatch();
    const language = useSelector(selectLanguage);

    const loc = useLocation();
    console.log(loc);

    useEffect(() => {
        getFilesInfo(loaderData).then(filesInfo => {
            setFilesInfo(filesInfo);
            dispatch(setParentFolderId(filesInfo.parentFolderId));
        });
    }, [loaderData]);


    let isLogin = useAppSelector(selectIsLogin);


    const Navigate = useNavigate();

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
                <RowOfModule isLogin={isLogin ? isLogin : false} file={file} basePath={basePath} key={index + "mod"}></RowOfModule>
            );
        });

        listOfNameFolders = filesInfo.folders.map((folder, index) => {
            return (
                <RowOfFolder isLogin={isLogin ? isLogin : false} folder={folder} basePath={basePath} fullPath={filesInfo.fullPath} setFolderOpenId={setFolderOpenId} key={index + "fol"}></RowOfFolder>
            );
        });

        let currentPath = basePath + "/browser";

        paths = loaderData.folderNames.map((segmentPath, index) => {
            currentPath += "/" + segmentPath;
            let path = currentPath;

            return (
                <Breadcrumb.Item onClick={() => Navigate(path)} active={index + 1 === loaderData.folderNames.length}>{segmentPath}</Breadcrumb.Item>
            );
        });

    }

    return (
        <section className='file-browser'>
            <Breadcrumb className='file-browser__breadcrumb'>
                {paths}
            </Breadcrumb>

            <ListGroup as="ul" className='file-browser__list-group'>
                {listOfNameFolders}
                {listOfNameFiles}
            </ListGroup>

            <Pastemodule updateListOfFiles={updateListOfFiles}></Pastemodule>

            {isLogin &&
                <section className='file-browser__button-group-section'>
                    <ButtonGroup className='file-browser__button-group'>
                        <Button variant='warning' onClick={() => { Navigate(basePath + "/record") }}>Nowy plik</Button>
                        <Button variant='warning' onClick={() => { createNewFolder() }}>Nowy folder</Button>
                    </ButtonGroup>
                </section>
            }

        </section>
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

    // async function removeFolder(folder: File) {
    //     if (!await isEmptyFolder(folder.id)) {
    //         alert("folder nie jest pusty");
    //         return;
    //     }

    //     await removeFolderFromGoogleDrive(folder.id);
    //     await updateListOfFiles();
    // }

    async function getFilesInfo(loaderData: loaderReturnType) {
        let folderId: string | undefined;

        if (folderOpenId) {
            folderId = folderOpenId;
            setFolderOpenId(undefined);
        } else {
            folderId = await findFolderIdByPath(loaderData.folderNames.slice(1), language);

            if (!folderId) {
                throw new Error("invalid browser path");
            }
        }

        let listOfFiles = await getListOfFiles(folderId) as FilesInfo;
        listOfFiles.parentFolderId = folderId;
        listOfFiles.fullPath = loaderData.path;

        return listOfFiles;
    }
}