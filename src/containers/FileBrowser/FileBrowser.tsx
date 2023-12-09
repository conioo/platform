import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import Pastemodule from '../../components/PasteModule/PasteModule';
import RowOfFolder from '../../components/RowOfFolder/RowOfFolder';
import RowOfModule from '../../components/RowOfModule/RowOfModule';
import { createFolderInGoogleDrive, getListOfFiles } from '../../google/GoogleDriveService';
import File from '../../models/File';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectIsLogin } from '../../redux/slices/authentication';
import { selectBasePath, selectLanguage } from '../../redux/slices/language';
import './FileBrowser.scss';

interface FilesInfo {
    parentFolderId: string;
    fullPath: string;
    files: File[];
    folders: File[];
}


interface FileBrowserProps {
    // filesInfo: FilesInfo;
}

export default function FileBrowser({ }: FileBrowserProps) {
    console.log("FileBrowser");

    const language = useSelector(selectLanguage);

    const filesInfo = useAsyncValue() as FilesInfo;

    let isLogin = useAppSelector(selectIsLogin);

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
                <RowOfModule isLogin={isLogin ? isLogin : false} file={file} basePath={basePath} key={index + "mod"}></RowOfModule>
            );
        });

        listOfNameFolders = filesInfo.folders.map((folder, index) => {
            return (
                <RowOfFolder isLogin={isLogin ? isLogin : false} folder={folder} basePath={basePath} fullPath={filesInfo.fullPath} key={index + "fol"}></RowOfFolder>
            );
        });
    }

    return (
        <section>

            <ListGroup as="ul" className='file-browser__list-group'>
                {listOfNameFolders}
                {listOfNameFiles}
            </ListGroup>

            <Pastemodule updateListOfFiles={updateListOfFiles}></Pastemodule>

            {isLogin &&
                <section className='file-browser__button-group-section'>
                    <ButtonGroup className='file-browser__button-group'>
                        <Button variant='warning' onClick={() => { navigate(basePath + "/record") }}>Nowy plik</Button>
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
        // setFilesInfo(newFilesInfo);
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

}