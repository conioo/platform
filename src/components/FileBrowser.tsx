import React, { useState, useEffect } from 'react';
import '../css/Buttons.css';
import '../css/FileBrowser.css';
import { State } from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';

interface FileBrowserProps {
    dispath: React.Dispatch<Action>;
    state: State;
}
//obecna ścieżka, 

export default function FileBrowser({ dispath, state }: FileBrowserProps) {
    console.log("FileBrowser");

    const [currentPhysicalPath, setCurrentPhysicalPath] = useState<string>("data");
    const [currentPath, setCurrentPath] = useState<Array<string>>(["data"]);
    const [folderNames, setFolderNames] = useState<Array<string> | null>(null);
    const [fileNames, setFileNames] = useState<Array<string> | null>(null);

    console.log(currentPhysicalPath);
    console.log(currentPath);

    const folderPrefix = "<=folder=>";

    useEffect(() => {
        if (state.oneRegenerateFilenames) {
            dispath({ type: ActionType.RegeneratedFilename });
        }
    }, [fileNames]);

    useEffect(() => {
        console.log("start");
        updateListOfFilesFromRepo();
    }, [currentPath]);

    if (state.oneRegenerateFilenames) {
        updateListOfFilesFromRepo();
    }

    let listOfNameFiles: Array<JSX.Element> | undefined;

    if (state.isLogin) {
        listOfNameFiles = fileNames?.map((fileName, index) => {
            return (
                <li key={index} className='row-of-files'>
                    <div className='filename'>{fileName}</div>
                    <div className='file-buttons'>
                        <button className='file-button' key={index} onClick={() => { dispath({ type: ActionType.ViewFile, payload: fileName }) }} >
                            Otwórz
                        </button>
                        <button className='file-button' key={index + "m"} onClick={() => { dispath({ type: ActionType.ModifyFile, payload: fileName }) }} >
                            Modyfikuj
                        </button>
                    </div>
                </li>
            );
        });
    }
    else {
        listOfNameFiles = fileNames?.map((fileName, index) => {
            return (
                <li key={index} className='row-of-files'>
                    <div className='filename'>{fileName}</div>
                    <div className='file-buttons'>
                        <button className='file-button' key={index} onClick={() => { dispath({ type: ActionType.ViewFile, payload: fileName }) }} >
                            Otwórz
                        </button>
                    </div>
                </li>
            );
        });

    }

    let listOfNameFolders: Array<JSX.Element> | undefined;

    if (folderNames) {
        listOfNameFolders = folderNames.map((folderName, index) => {
            return (
                <li key={index} className='row-of-folders'>
                    <div className='filename'>{folderName}</div>
                    <div className='file-buttons'>
                        <button className='file-button' key={index} onClick={() => { openFolder(folderName) }} >
                            Otwórz
                        </button>
                    </div>
                </li>
            );
        });
    }

    let paths = currentPath.map((segmentPath, index) => {
        return (<>
            <span onClick={() => backFromFolder(currentPath.length - index - 1)} className='current-path-span'>{segmentPath}</span>
            <span>/</span>
        </>);
    });

    return (
        <>
            <section className='paths-section'>
                <div>
                    {paths}
                </div>
                {currentPath.length > 1 && <button onClick={() => backFromFolder(1)} className='return-folder-button'>Powrót</button>}
            </section>

            <ul className='list-of-files'>
                {listOfNameFolders}
                {listOfNameFiles}
            </ul>

            {/* <section className='return-button-section'>
                
            </section> */}

            {state.isLogin &&
                <section className='new-file-section'>
                    <button className='new-file-button' onClick={() => { dispath({ type: ActionType.GoToRecord, payload: currentPhysicalPath }) }}>Nowy plik</button>
                    <button className='new-file-button' onClick={() => { createNewFolder() }}>Nowy folder</button>
                </section>}
        </>
    );

    async function updateListOfFilesFromRepo() {

        try {
            const response = await state.octokitInfo.octokitReadFree.repos.getContent({
                owner: state.octokitInfo.owner,
                repo: state.octokitInfo.publicRepoName,
                path: currentPhysicalPath,
                headers: {
                    'If-None-Match': ''
                }
            });

            console.log(response);

            if (!Array.isArray(response.data)) {
                console.error("The provided path does not point to a directory.");
                return new Array<string>();
            }

            const fileNames = response.data.filter((item) => item.type === "dir" && !(item.name.startsWith("<=folder=>"))).map((item) => item.name);
            const folderNames = response.data.filter((item) => item.name.startsWith("<=folder=>")).map((item) => item.name.substring(folderPrefix.length));

            setFileNames(fileNames)
            setFolderNames(folderNames)
        } catch (error: any) {

            if (error.status === 404) {
                setFileNames(null);
                setFolderNames(null);
                return;
            }

            console.log("Błąd: ", error);
        }
    }

    function createNewFolder() {
        const folderName = prompt('Wpisz nazwę folderu:');

        if (!folderName) {
            return;
        }

        let copyCurrentFolderNames = new Array<string>();

        if (folderNames) {
            copyCurrentFolderNames = folderNames.slice();
        }

        copyCurrentFolderNames.push(folderName);

        setFolderNames(copyCurrentFolderNames);
    }

    function openFolder(folderName: string) {
        let newCurrentPath = currentPath.slice();
        newCurrentPath.push(folderName);
        setCurrentPath(newCurrentPath);

        setCurrentPhysicalPath(currentPhysicalPath + "/" + folderPrefix + folderName);
    }

    function backFromFolder(times: number) {
        if (times === 0) {
            return;
        }

        let lengthSegmentToRemove: number = 0;

        for (let i = 1; i <= times; ++i) {
            lengthSegmentToRemove += currentPath[currentPath.length - i].length + folderPrefix.length + 1;
        }

        let newCurrentPhysicalPath = currentPhysicalPath.slice(0, -lengthSegmentToRemove);

        setCurrentPhysicalPath(newCurrentPhysicalPath);

        let newCurrentPath = currentPath.slice(0, -times);
        setCurrentPath(newCurrentPath);
    }
}