import File from "../models/File";
import Module from "../models/Module";
import State from "../models/State";
import Tokens from "../models/Tokens";
import Language from "../types/Language";
import GoogleSecrets from "./GoogleSecrets";

interface FileResponse {
    name: string;
    id: string;
    description: string;
    mimeType: string;
}

export async function saveModuleToGoogleDrive(moduleContent: Module, parentFolderId: string) {
    try {
        let moduleName = moduleContent.name;

        const jsonString = JSON.stringify(moduleContent);
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });

        let folderResponse = await gapi.client.drive.files.create({
            resource: {
                name: moduleName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId],
            },
            fields: 'id',
        });

        const newFolderId = folderResponse.result.id;

        if (!newFolderId) {
            throw "Missing for folder id";
        }

        const metadata = {
            name: 'module.json',
            mimeType: 'application/json',
            parents: [newFolderId],
        };

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        const form = new FormData();

        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', jsonBlob);

        let fileResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
            body: form,
        })

        console.log('File and folder created:', fileResponse);

    } catch (error: any) {
        console.error('Error creating file:', error);
    };
}

export async function createFolderInGoogleDrive(folderName: string, parentFolderId: string) {
    try {
        let folderResponse = await gapi.client.drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId],
                description: "folder"
            },
        });

    } catch (error: any) {
        console.error('Error creating folder:', error);
    };
}

export async function getModule(moduleId: string): Promise<Module> {
    console.log("moduly");

    const fileListUrl = `https://www.googleapis.com/drive/v3/files?q='${moduleId}'+in+parents+and+name+=+'module.json'&key=${GoogleSecrets.API_KEY}&fields=files(name,id)`;

    try {
        // const fileListResponse = await gapi.client.drive.files.list({
        //     q: `'${moduleId}' in parents and name = 'module.json'`,
        //     fields: 'files(id,name)',
        //     pageSize: 1,
        // });
        //const files = fileListResponse.data.files;

        const response = await fetch(fileListUrl);
        const fileListResponse = await response.json();
        const files = fileListResponse.files;

        console.log(files[0]);

        if (!files || !files[0].id) {
            throw new Error('No files in directory');
        }

        const getModuleUrl = `https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media&key=${GoogleSecrets.API_KEY}`;

        const fileResponse = await fetch(getModuleUrl);
        const jsonData = await fileResponse.json();
        console.log(jsonData);
        // const fileResponse = await gapi.client.drive.files.get({
        //     fileId: files[0].id,
        //     alt: 'media'
        // });
        // const jsonData = JSON.parse(fileResponse.body) as Module;

        return jsonData;
    } catch (error) {
        console.error('Error while file downloading', error);
        throw error;
    }
}

export async function removeModule(moduleId: string) {
    try {
        const fileListResponse = await gapi.client.drive.files.list({
            q: `'${moduleId}' in parents`,
            fields: 'files(id,mimeType)',
            pageSize: 100
        });

        const files = fileListResponse.result.files;

        if (files && files.length > 0) {
            for (const file of files) {
                if (!file.id) {
                    continue;
                }
                if (file.mimeType === 'application/vnd.google-apps.folder') {
                    await removeModule(file.id); // Rekurencyjnie usuwaj podfoldery
                } else {
                    await gapi.client.drive.files.delete({
                        fileId: file.id
                    });
                }
            }
        }

        await gapi.client.drive.files.delete({
            fileId: moduleId
        });

        console.log(`Remove folder by ID ${moduleId} with content`);
    } catch (error) {
        console.error('Error while removing folder', error);
        throw error;
    }
}

export async function getListOfFiles(folderId: string): Promise<{ files: Array<File>, folders: Array<File> } | undefined> {

    try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${GoogleSecrets.API_KEY}&fields=files(name,description, id, mimeType)`;

        let filesArray = new Array<File>();
        let foldersArray = new Array<File>();

        let response = await fetch(url);

        let jsonResponse = await response.json();

        if (jsonResponse.files) {
            let files = jsonResponse.files as Array<FileResponse>;

            files.forEach(file => {

                if (file.mimeType === "application/vnd.google-apps.folder") {
                    if (file.description && file.description === "folder") {
                        foldersArray.push(new File(file.name, file.id));
                    }
                    else {
                        filesArray.push(new File(file.name, file.id));
                    }
                }
            });
        }

        return { files: filesArray, folders: foldersArray };

    } catch (error: any) {
        console.error('Error:', error);
        throw new Error(error);
    }
}

export async function isEmptyFolder(folderId: string): Promise<boolean> {
    const fileListResponse = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id)',
        pageSize: 1
    });

    const files = fileListResponse.result.files;

    if (!files) {
        return false;
    }

    return files.length === 0;
}

export async function removeFolderFromGoogleDrive(folderId: string) {
    await gapi.client.drive.files.delete({
        fileId: folderId
    });
}

export async function getSecrets(): Promise<Tokens | undefined> {
    try {
        console.log("sekrety");
        // const headers = {
        //     Authorization: `Bearer ${gapi.client.getToken().access_token}`,
        // };

        // const url = `https://www.googleapis.com/drive/v3/files?q='${GoogleSecrets.DATA_ENGLISH_FOLDER_ID}'+in+parents&key=${GoogleSecrets.API_KEY}&fields=files(name,description, id, mimeType)`;

        // let ress = await fetch(url, { headers });
        // let gg = await ress.json();
        // console.log(gg);

        // const params = {
        //     q: "'root' in parents",
        //     fields: 'files(id, name)',
        // };

        // const all = await gapi.client.drive.files.list(params);
        // console.log("tutaaaaaaajjjjjjjj");
        // console.log(JSON.parse(all.body));

        const response = await gapi.client.drive.files.get({
            fileId: GoogleSecrets.SECRET_FILE_ID,
            alt: 'media',
        });

        const jsonData = JSON.parse(response.body);

        return jsonData;
    } catch (error) {
        console.error('Error during downloads secrets:', error);

        return undefined;
    }
}

export async function findFolderIdByPath(folderNames: string[], language: Language): Promise<string | undefined> {

    let parentFolderId: string | undefined = undefined;

    if (language === Language.English) {
        parentFolderId = GoogleSecrets.DATA_ENGLISH_FOLDER_ID;
    }
    else if (language === Language.German) {
        parentFolderId = GoogleSecrets.DATA_GERMAN_FOLDER_ID;
    }

    for (const folderName of folderNames) {
        parentFolderId = await findFolderId(parentFolderId, folderName);
        if (!parentFolderId) {
            return undefined;
        }
    }

    return parentFolderId;
};

async function findFolderId(parentFolderId: string | undefined, folderName: string): Promise<string | undefined> {
    // const response = await gapi.client.drive.files.list({
    //     q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    // });

    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+name='${folderName}'&key=${GoogleSecrets.API_KEY}`;

    let response = await fetch(apiUrl, {
        method: 'GET',
    })

    //const files = response.result.files;
    const files = (await response.json()).files;

    console.log("tutaj");
    console.log(files);

    if (files && files.length > 0) {
        return files[0].id;
    } else {
        return undefined;
    }
};