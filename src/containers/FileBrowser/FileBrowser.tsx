import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import Pastemodule from '../../components/PasteModule/PasteModule';
import RowOfFolder from '../../components/RowOfFolder/RowOfFolder';
import RowOfModule from '../../components/RowOfModule/RowOfModule';
import { createFolderInGoogleDrive, getListOfFiles } from '../../google/GoogleDriveService';
import { useAppSelector } from '../../redux/hook';
import { selectIsLogin } from '../../redux/slices/authentication';
import { selectBasePath } from '../../redux/slices/language';
import './FileBrowser.scss';
import { FilesInfo } from './FileBrowserSuspense';
import { useState } from 'react';
import { getFilesInfo } from './FileBrowserSuspense/FileBrowserSuspense';

interface FileBrowserProps {
}

export default function FileBrowser({ }: FileBrowserProps) {
    console.log("FileBrowser");

    const [filesInfo, setFilesInfo] = useState<FilesInfo>(useAsyncValue() as FilesInfo);

    let isLogin = useAppSelector(selectIsLogin);

    const navigate = useNavigate();
    let basePath = useSelector(selectBasePath);


    let listOfNameFiles: Array<JSX.Element> | undefined;
    let listOfNameFolders: Array<JSX.Element> | undefined;

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

            <Pastemodule updateListOfFiles={updateListOfFiles} targetFolderId={filesInfo.folderId}></Pastemodule>

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
        // navigate(0);
        // if (filesInfo === undefined) {
        //     return;
        // }

        // let newFilesInfo = await getFilesInfo({  filesInfo.fullPath, null , filesInfo.folderId });
        let newFilesInfo = await getFilesInfo({ path: filesInfo.fullPath, folderNames: null, folderId: filesInfo.folderId});

        // if (!listOfFiles) {
        //     return;
        // }

        // let newFilesInfo = { ...filesInfo };
        // newFilesInfo.files = listOfFiles.files;
        // newFilesInfo.folders = listOfFiles.folders;

        // console.log(newFilesInfo);
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

        await createFolderInGoogleDrive(folderName, filesInfo.folderId);

        await updateListOfFiles();
    }
}