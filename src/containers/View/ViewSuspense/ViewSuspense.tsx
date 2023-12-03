import React from 'react';
import { ActionFunctionArgs, Await, ParamParseKey, Params, defer, useLoaderData } from 'react-router-dom';
import ReturnButton from '../../../components/ReturnButton';
import { getModule } from '../../../google/GoogleDriveService';
import Module from '../../../models/Module';
import Paths from '../../../router/Paths';
import View from '../View';
import '../View.scss';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.view>>;
}

interface loaderReturnType {
    module: Module,
    fileId: string
}

export async function loader({ params }: Args): Promise<any> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let modulePromise = getModule(fileId);

    return defer({
        module: modulePromise,
        fileId: fileId
    });
}

export default function ViewSuspense(): JSX.Element {
    console.log("ViewSuspense");

    let data = useLoaderData() as any;

    return (
        <section className='view'>
            <ReturnButton variant='outline-secondary'></ReturnButton>

            <React.Suspense
                fallback={<p>Loading module...</p>} >
                <Await
                    resolve={data.module}
                    errorElement={
                        <p>Error loading module</p>
                    }>
                    <View fileId={data.fileId}></View>
                </Await>
            </React.Suspense>
        </section>
    );
}