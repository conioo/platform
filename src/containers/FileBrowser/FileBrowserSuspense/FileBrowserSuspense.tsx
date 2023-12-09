import React from 'react';
import { ActionFunctionArgs, Await, ParamParseKey, Params, defer, useLoaderData, useNavigate } from 'react-router-dom';
import { findFolderIdByPath, getListOfFiles } from '../../../google/GoogleDriveService';
import store from '../../../redux/store';
import Paths from '../../../router/Paths';
import FileBrowser from '../FileBrowser';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useSelector } from 'react-redux';
import { selectBasePath } from '../../../redux/slices/language';
import Placeholder from 'react-bootstrap/Placeholder';
import ListGroup from 'react-bootstrap/ListGroup';

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

    //folderNames.shift();

    return defer({ filesInfo: filesPromise, folderNames })
}

async function getFilesInfo({ path, folderNames, folderId }: any) {

    if (!folderId) {
        folderId = await findFolderIdByPath(folderNames.slice(1), store.getState().language.language);

        if (!folderId) {
            throw new Error("invalid browser path");
        }
    }

    let listOfFiles = await getListOfFiles(folderId) as unknown as FilesInfo;
    listOfFiles.parentFolderId = folderId;
    listOfFiles.fullPath = path;

    return listOfFiles;
}

export default function FileBrowserSuspense() {
    console.log("FileBrowserSuspense");

    let loaderData = useLoaderData() as loaderReturnType;

    const navigate = useNavigate();

    let basePath = useSelector(selectBasePath);
    let currentPath = basePath + "/browser";

    const paths = loaderData.folderNames.map((segmentPath, index) => {
        currentPath += "/" + segmentPath;
        let path = currentPath;

        return (
            <Breadcrumb.Item onClick={() => navigate(path)} active={index + 1 === loaderData.folderNames.length}>{segmentPath}</Breadcrumb.Item>
        );
    });

    return (
        <section className='file-browser'>
            <Breadcrumb className='file-browser__breadcrumb'>
                {paths}
            </Breadcrumb>

            <React.Suspense
                fallback={<>
                    <ListGroup as="ul" className='file-browser__list-group'>
                        {/* <Placeholder as={ListGroup.Item} animation="glow">&nbsp;</Placeholder>
                        <Placeholder as={ListGroup.Item} animation="glow">&nbsp;</Placeholder> */}
                    </ListGroup>
                </>} >
                <Await
                    resolve={loaderData.filesInfo}
                    errorElement={
                        <p>Error loading module</p>
                    }>
                    <FileBrowser></FileBrowser>
                </Await>
            </React.Suspense>
        </section>
    );
}