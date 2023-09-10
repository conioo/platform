import File from "../models/File";
import Module from "../models/Module";
import State from "../models/State";
import Tokens from "../models/Tokens";
import GoogleSecrets from "./GoogleSecrets";

interface FileResponse {
    name: string;
    id: string;
    description: string;
    mimeType: string;
}

export async function saveModuleToGoogleDrive(moduleName: string, moduleContent: Module, parentFolderId: string) {
    try {
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
    const fileListUrl = `https://www.googleapis.com/drive/v3/files?q='${moduleId}'+in+parents&key=${GoogleSecrets.API_KEY}&fields=files(name,id)`;

    try {
        const fileListResponse = await gapi.client.drive.files.list({
            q: `'${moduleId}' in parents and name = 'module.json'`,
            fields: 'files(id,name)',
            pageSize: 1,
        });

        const files = fileListResponse.result.files;

        if (!files || !files[0].id) {
            throw new Error('No files in directory');
        }

        const fileResponse = await gapi.client.drive.files.get({
            fileId: files[0].id,
            alt: 'media'
        });

        const jsonData = JSON.parse(fileResponse.body) as Module;

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

export async function getListOfFiles(folderId: string): Promise<{ filesArray: Array<File>, foldersArray: Array<File> } | undefined> {

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

        return { filesArray, foldersArray };

    } catch (error: any) {
        console.error('Error:', error);
        return undefined;
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
        //194DNS7xdUfc9ZJNvIEyfesfbOBkJycYH
        let iddd = "1k5syJQKovJyczbPoNxc8f4rBZuzfPZCs";
        console.log(gapi.client.getToken().access_token);

        const headers = {
            Authorization: `Bearer ${gapi.client.getToken().access_token}`,
        };

        const apiEndpoint = `https://www.googleapis.com/drive/v3/files/${GoogleSecrets.SECRET_FILE_ID}?alt=media&key=${GoogleSecrets.API_KEY}`;

        let rrdr = await fetch(apiEndpoint, { headers });
        console.log(rrdr);

        const dd = await rrdr.json();
        console.log(dd);

        let fff = await gapi.client.drive.files.list();
        console.log(fff);

        const response = await gapi.client.drive.files.get({
            fileId: GoogleSecrets.SECRET_FILE_ID,
            alt: 'media'
        });

        console.log("sekretyy");
        console.log(response);

        const jsonData = JSON.parse(response.body);

        return jsonData;
    } catch (error) {
        console.error('Error during downloads secrets:', error);

        return undefined;
    }
}