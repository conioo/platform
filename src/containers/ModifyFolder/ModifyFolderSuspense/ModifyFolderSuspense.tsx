import React from 'react';
import { ActionFunctionArgs, Await, ParamParseKey, Params, defer, useLoaderData } from 'react-router-dom';
import Paths from '../../../router/Paths';
import { authorizedAccess } from '../../../google/services/AuhorizationService';
import { getFolderName } from '../../../google/GoogleDriceAuthorizeService';
import ReturnButton from '../../../components/ReturnButton';
import ModifyFolder from '../ModifyFolder';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.modifyFolder>>;
}

interface loaderReturnType {
    folderNamePromise: Promise<string>;
    folderId: string;
}

export async function loader({ params }: Args): Promise<any> {
    const folderId = params.folderid;

    if (!folderId) {
        throw new Error("missing folder id");
    }

    let authorizedResponse = await authorizedAccess();

    if (authorizedResponse !== undefined) {
        return authorizedResponse;
    }

    let folderNamePromise = getFolderName(folderId);

    return defer({folderName: folderNamePromise, folderId});
}

export default function ModifyFolderSuspense(): JSX.Element {
    console.log("ViewSuspense");

    let data = useLoaderData() as any;

    return (
        <section className='modify-folder'>
            <ReturnButton variant='outline-secondary'></ReturnButton>

            <React.Suspense
                fallback={<p>Loading folder data...</p>} >
                <Await
                    resolve={data.folderName}
                    errorElement={
                        <p>Error loading module</p>
                    }>
                    <ModifyFolder folderId={data.folderId} folderName={data.folderName}></ModifyFolder>
                </Await>
            </React.Suspense>
        </section>
    );
}