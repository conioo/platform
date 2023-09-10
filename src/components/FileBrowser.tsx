import React, { useState, useEffect } from 'react';
import '../css/Buttons.css';
import '../css/FileBrowser.css';
import State from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import { createFolderInGoogleDrive, getListOfFiles, isEmptyFolder, removeFolderFromGoogleDrive } from '../google/GoogleDriveService';
import File from '../models/File';
import GoogleSecrets from '../google/GoogleSecrets';
import '../css/fontello/css/fontello.css';

interface FileBrowserProps {
    dispath: React.Dispatch<Action>;
    state: State;
}
//obecna ścieżka, 

export default function FileBrowser({ dispath, state }: FileBrowserProps) {
    console.log("FileBrowser");

    const [folders, setFolders] = useState<Array<File> | null>(null);
    const [files, setFiles] = useState<Array<File> | null>(null);

    const folderDescription = "folder";

    // useEffect(() => {
    //     if (state.oneRegenerateFilenames) {
    //         dispath({ type: ActionType.RegeneratedFilename });
    //     }
    // }, [fileNames]);

    useEffect(() => {
        updateListOfFiles();
    }, [state.currentPath]);

    // if (state.oneRegenerateFilenames) {
    //     updateListOfFilesFromRepo();
    // }

    let listOfNameFiles: Array<JSX.Element> | undefined;

    if (state.isLogin) {
        listOfNameFiles = files?.map((file, index) => {
            return (
                <li key={index} className='row-of-files'>
                    <div className='filename' key={Math.random()}>{file.name}</div>
                    <div className='file-buttons' key={Math.random()}>
                        <button className='icon-reply file-button' key={Math.random()} onClick={() => { dispath({ type: ActionType.ViewFile, payload: file }) }} >
                        </button>
                        <button className='icon-wrench file-button' key={index + "m"} onClick={() => { dispath({ type: ActionType.ModifyFile, payload: file }) }} >
                        </button>
                    </div>
                </li>
            );
        });
    }
    else {
        listOfNameFiles = files?.map((file, index) => {
            return (
                <li key={index} className='row-of-files'>
                    <div className='filename'key={Math.random()}>{file.name}</div>
                    <div className='file-buttons'key={Math.random()}>
                        <button className='icon-reply file-button' key={Math.random()} onClick={() => { dispath({ type: ActionType.ViewFile, payload: file }) }} >
                        </button>
                    </div>
                </li>
            );
        });

    }

    let listOfNameFolders: Array<JSX.Element> | undefined;

    if (folders) {
        if (state.isLogin) {
            listOfNameFolders = folders.map((folder, index) => {
                return (
                    <li key={Math.random()} className='row-of-folders'>
                        <div className='filename'key={Math.random()}>{folder.name}</div>
                        <div className='file-buttons'key={Math.random()}>
                            <button className='icon-reply file-button' key={Math.random()} onClick={() => { openFolder(folder) }} >
                            </button>
                            <button className='icon-wrench file-button' key={Math.random()} onClick={() => { removeFolder(folder) }} >
                            </button>
                        </div>
                    </li>
                );
            });
        }
        else {
            listOfNameFolders = folders.map((folder, index) => {
                return (
                    <li key={Math.random()} className='row-of-folders'>
                        <div className='filename'key={Math.random()}>{folder.name}</div>
                        <div className='file-buttons'key={Math.random()}>
                            <button className='icon-reply file-button' key={Math.random()} onClick={() => { openFolder(folder) }} >
                            </button>
                        </div>
                    </li>
                );
            });
        }

    }

    let paths = state.currentPath.map((segmentPath, index) => {
        return (<>
            <span onClick={() => backFromFolder(state.currentPath.length - index - 1)} className='current-path-span' key={Math.random()}>{segmentPath.name}</span>
            <span>/</span>
        </>);
    });

    return (
        <>
            <section className='paths-section'>
                <div>
                    {paths}
                </div>
                {state.currentPath.length > 1 && <button onClick={() => backFromFolder(1)} className='return-folder-button'>Powrót</button>}
            </section>

            <ul className='list-of-files'>
                {listOfNameFolders}
                {listOfNameFiles}
            </ul>

            {/* <section className='return-button-section'>
                
            </section> */}

            {state.isLogin &&
                <section className='new-file-section'>
                    <button className='new-file-button' onClick={() => { dispath({ type: ActionType.GoToRecord, payload: getCurrentFolderId() }) }}>Nowy plik</button>
                    <button className='new-file-button' onClick={() => { createNewFolder() }}>Nowy folder</button>
                </section>}
        </>
    );

    async function updateListOfFiles() {

        let listOfFiles = await getListOfFiles(getCurrentFolderId());

        if (listOfFiles) {
            setFiles(listOfFiles.filesArray);
            setFolders(listOfFiles.foldersArray);
        }
    }

    async function createNewFolder() {
        const folderName = prompt('Wpisz nazwę folderu:');

        if (!folderName) {
            return;
        }

        await createFolderInGoogleDrive(folderName, getCurrentFolderId());

        await reloadList();
    }

    function getCurrentFolderId(): string {
        return state.currentPath[state.currentPath.length - 1].id;
    }

    async function reloadList() {
        await updateListOfFiles();
    }

    function openFolder(folder: File) {
        let newCurrentPath = state.currentPath.slice();
        newCurrentPath.push(folder);


        dispath({ type: ActionType.RefreshCurrentPath, payload: newCurrentPath });
    }

    async function removeFolder(folder: File) {
        if (!await isEmptyFolder(folder.id)) {
            alert("folder nie jest pusty");
            return;
        }

        await removeFolderFromGoogleDrive(folder.id);
        await updateListOfFiles();
    }

    function backFromFolder(times: number) {
        if (times === 0) {
            return;
        }

        let newCurrentPath = state.currentPath.slice(0, -times);
        dispath({ type: ActionType.RefreshCurrentPath, payload: newCurrentPath });
    }
}