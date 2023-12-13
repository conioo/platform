import React, { memo, useMemo } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ListGroup from 'react-bootstrap/ListGroup';
import { useSelector } from 'react-redux';
import { ActionFunctionArgs, Await, ParamParseKey, Params, defer, useLoaderData, useNavigate } from 'react-router-dom';
import { findFolderIdByPath, getListOfFiles } from '../../../google/GoogleDriveService';
import { selectBasePath } from '../../../redux/slices/language';
import store from '../../../redux/store';
import Paths from '../../../router/Paths';
import FileBrowser from '../FileBrowser';
import File from '../../../models/File';

export interface FilesInfo {
    folderId: string;
    fullPath: string;
    files: File[];
    folders: File[];
}

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.browser>>;
}

interface loaderReturnType {
    path: string;
    filesInfo: Promise<FilesInfo>
    folderNames: string[];
}


export async function loader({ params, request }: Args): Promise<any> {
    let path = params['*'];

    if (!path) {
        throw new Error("invalid browser path");
    }

    const folderNames = path.split('/').filter((name: any) => name !== '') as string[];

    if (folderNames[0] !== "home") {
        throw new Error("invalid browser path");
    }

    const folderId = new URL(request.url).searchParams.get('folder-id');
    const filesPromise = getFilesInfo({ path, folderNames, folderId });

    //folderNames.shift();s
    console.log("FB loader");

    // let listOfFiles: FilesInfo = { folderId: "folderId", fullPath: path, folders: new Array<File>(), files: new Array<File>() };

    return defer({ filesInfo: filesPromise, folderNames })
}

export async function getFilesInfo({ path, folderNames, folderId }: any): Promise<FilesInfo> {

    if (!folderId) {
        folderId = await findFolderIdByPath(folderNames.slice(1), store.getState().language.language);

        if (!folderId) {
            throw new Error("invalid browser path");
        }
    }

    let listOfFiles = await getListOfFiles(folderId) as unknown as FilesInfo;
    listOfFiles.folderId = folderId;
    listOfFiles.fullPath = path;

    return listOfFiles;
}

export default function FileBrowserSuspense() {
    console.log("FileBrowserSuspense");

    const navigate = useNavigate();

    let basePath = useSelector(selectBasePath);
    let loaderData = useLoaderData() as loaderReturnType;
    console.log(loaderData);

    let currentPath = basePath + "/browser";

    const paths = useMemo(() => {
        return loaderData.folderNames.map((segmentPath, index) => {
            currentPath += "/" + segmentPath;
            let path = currentPath;

            return (
                <Breadcrumb.Item key={index} onClick={() => navigate(path)} active={index + 1 === loaderData.folderNames.length}>{segmentPath}</Breadcrumb.Item>
            );
        });
    }, [loaderData.folderNames]);

    return (
        <section className='file-browser'>
            <Breadcrumb className='file-browser__breadcrumb'>
                {paths}
            </Breadcrumb>

            <React.Suspense
                fallback={<>
                    {/* <ListGroup as="ul" className='file-browser__list-group'>
                        <Placeholder as={ListGroup.Item} animation="glow">&nbsp;</Placeholder>
                        <Placeholder as={ListGroup.Item} animation="glow">&nbsp;</Placeholder>
                    </ListGroup> */}
                </>} >
                <Await
                    resolve={loaderData.filesInfo}
                    errorElement={
                        <p>Error loading module</p>
                    }>
                    {/* <FileBrowser></FileBrowser> */}
                    <FileBrowser key={Math.random()}></FileBrowser>
                </Await>
            </React.Suspense>
        </section>
    );
}