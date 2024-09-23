import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import Pastemodule from '../../components/PasteModule/PasteModule';
import RowOfFolder from '../../components/RowOfFolder/RowOfFolder';
import RowOfModule from '../../components/RowOfModule/RowOfModule';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectIsAdmin, selectIsLogin } from '../../redux/slices/authentication';
import { selectBasePath } from '../../redux/slices/language';
import './FileBrowser.scss';
import { FilesInfo } from './FileBrowserSuspense';
import { useEffect, useState } from 'react';
import { getFilesInfo } from './FileBrowserSuspense/FileBrowserSuspense';
import { createFolderInGoogleDrive } from '../../google/GoogleDriveAuthorizeService';
import { setParentFolderId } from '../../redux/slices/folder';

interface FileBrowserProps {
}

export default function FileBrowser({ }: FileBrowserProps) {
    console.log("FileBrowser");

    const [filesInfo, setFilesInfo] = useState<FilesInfo>(useAsyncValue() as FilesInfo);
    const [hidingMode, setHidingMode] = useState(false);
    const [previousisLogin, setPreviousIsLogin] = useState(false);

    let isAdmin = useAppSelector(selectIsAdmin);
    let dispatch = useAppDispatch();

    const navigate = useNavigate();
    let basePath = useSelector(selectBasePath);


    let listOfNameFiles: Array<JSX.Element> | undefined;
    let listOfNameFolders: Array<JSX.Element> | undefined;

    // if (language === Language.Spanish) {
    //     return (
    //         <>
    //             <h2>Język Hiszpański dostępny dla użytkowników z usługą premium </h2>
    //             <button onClick={() => alert("Kartofle")}>Wykup Subskrypcje</button>
    //         </>
    //     )
    // }

    useEffect(() => {
        updateListOfFiles();
    }, [isAdmin]);

    if (filesInfo !== undefined) {
        listOfNameFiles = filesInfo.files.map((file, index) => {
            return (
                <RowOfModule isLogin={isAdmin ? isAdmin : false} file={file} basePath={basePath} key={index + "mod"} hidingMode={hidingMode} updateListOfFiles={updateListOfFiles}></RowOfModule>
            );
        });

        listOfNameFolders = filesInfo.folders.map((folder, index) => {
            return (
                <RowOfFolder isLogin={isAdmin ? isAdmin : false} folder={folder} basePath={basePath} fullPath={filesInfo.fullPath} key={index + "fol"} hidingMode={hidingMode} updateListOfFiles={updateListOfFiles}></RowOfFolder>
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

            {isAdmin &&
                <section className='file-browser__button-group-section'>
                    <ButtonGroup className='file-browser__button-group'>
                        <Button variant='warning' onClick={() => { dispatch(setParentFolderId(filesInfo.folderId)); navigate(basePath + "/record"); }}>Nowy plik</Button>
                        <Button variant='warning' onClick={() => { createNewFolder() }}>Nowy folder</Button>
                    </ButtonGroup>
                    {hidingMode && <Button variant='secondary' className='file-browser__hiding-button' onClick={() => setHidingMode(!hidingMode)}>Ukryj moduły</Button>}
                    {!hidingMode && <Button variant='outline-secondary' className='file-browser__hiding-button' onClick={() => setHidingMode(!hidingMode)}>Ukryj moduły</Button>}
                </section>
            }

        </section>
    );

    async function updateListOfFiles() {
        let newFilesInfo = await getFilesInfo({ path: filesInfo.fullPath, folderNames: null, folderId: filesInfo.folderId });

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