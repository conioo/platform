import File from "../models/File";
import Module from "../models/Module";
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

        console.log(folderResponse.result.id);

        console.log("create folder successfull")

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

        if (!files || !files[0].id) {
            throw new Error('No files in directory');
        }

        const getModuleUrl = `https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media&key=${GoogleSecrets.API_KEY}`;

        const fileResponse = await fetch(getModuleUrl);
        const jsonData = await fileResponse.json();
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
        parentFolderId = process.env.REACT_APP_DATA_ENGLISH_FOLDER_ID;
    }
    else if (language === Language.German) {
        parentFolderId = process.env.REACT_APP_DATA_GERMAN_FOLDER_ID;
    }
    else if (language === Language.Spanish) {
        parentFolderId = process.env.REACT_APP_DATA_SPANISH_FOLDER_ID;
    }

    for (const folderName of folderNames) {
        parentFolderId = await findFolderId(parentFolderId, folderName);
        if (!parentFolderId) {
            return undefined;
        }
    }

    return parentFolderId;
};

export async function updateModuleInGoogleDrive(moduleId: string, newModuleContent: Module, oldModuleName: string) {
    try {
        const fileListUrl = `https://www.googleapis.com/drive/v3/files?q='${moduleId}'+in+parents+and+name+=+'module.json'&key=${GoogleSecrets.API_KEY}&fields=files(name,id)`;

        const response = await fetch(fileListUrl);
        const fileListResponse = await response.json();
        const files = fileListResponse.files;

        if (!files || !files[0].id) {
            throw new Error('No files in directory');
        }

        console.log(files[0].id);

        const jsonString = JSON.stringify(newModuleContent);
        const metadata = {
            name: 'module.json',
            mimeType: 'application/json',
        };

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        let fileResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${files[0].id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: jsonString,
        })

        if (oldModuleName !== newModuleContent.name) {
            const metadataUrl = `https://www.googleapis.com/drive/v3/files/${moduleId}`;
            const metadata = {
                name: newModuleContent.name
            };
            await fetch(metadataUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metadata)
            });

            console.log('Filename updated successfully');
        };

        console.log('File updated successfully:', fileResponse);

    } catch (error: any) {
        console.error('Error updating file:', error);
    };
}

export async function copyModule(moduleName: string, moduleId: string, destinationFolderId: string) {
    try {
        let newModuleFolderId = await createFolder(destinationFolderId, moduleName);

        let files = await getFilesOfFolder(moduleId, "id");
        console.log(files);

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        for (let i = 0; i < files.length; ++i) {

            const copyFileUrl = `https://www.googleapis.com/drive/v3/files/${files[i].id}/copy`;

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parents: [newModuleFolderId],
                }),
            };
            const response = await fetch(copyFileUrl, requestOptions);// await na koncu 
            if (!response.ok) {
                throw new Error('Error during coping folder' + response);
            }
        }
    } catch (error) {
        console.log('Error during coping folder');
    }
}

async function getFilesOfFolder(folderId: string, fields: string): Promise<gapi.client.drive.File[]> {
    try {
        const fileListResponse = await gapi.client.drive.files.list({
            q: `'${folderId}' in parents`,
            fields: `files(${fields})`,
        });

        if (fileListResponse.result.files === undefined) {
            throw new Error("files is undefinied");
        }

        return (fileListResponse.result.files);
    } catch (error: any) {
        console.log('Error during get files');
        throw error;
    }
}

async function createFolder(parentFolderId: string, folderName: string, desciption?: string): Promise<string> {
    try {
        let folderResponse = await gapi.client.drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId],
                description: desciption
            },
        });

        if (folderResponse.result.id === undefined) {
            throw new Error("not found folder id");
        }

        return folderResponse.result.id;
    } catch (error: any) {
        console.error('Error creating folder:', error);
        throw error;
    };
}

async function getParentFolderId(folderId: string): Promise<string> {
    try {
        const url = `https://www.googleapis.com/drive/v3/files/${folderId}?fields=parents`;

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        let response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Błąd podczas pobierania informacji o folderze');
        }
        let data = await response.json();
        const parents = data.parents;
        if (parents && parents.length > 0) {
            return (parents[0]);
        } else {
            throw new Error('Folder has not a parent');
        }
    } catch (error) {
        throw new Error('Error during download parent folder id');
    }
}

export async function moveModule(moduleId: string, newParentFolderId: string) {
    try {
        // const url = `https://www.googleapis.com/drive/v3/files/${moduleId}?addParents=${newParentFolderId}&removeParents=${currentParentId}`;
        const url = `https://www.googleapis.com/drive/v3/files/${moduleId}?addParents=${newParentFolderId}`;

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        const requestOptions = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        let response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Error during moving folder');
        }
        console.log('Folder moving correctly');

    } catch (error: any) {
        console.error('Error moving folder:', error);
    };
}

async function findFolderId(parentFolderId: string | undefined, folderName: string): Promise<string | undefined> {
    // const response = await gapi.client.drive.files.list({
    //     q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    // });

    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+name='${folderName}'&key=${GoogleSecrets.API_KEY}`;

    let response = await fetch(apiUrl, {
        method: 'GET',
    })

    const files = (await response.json()).files;

    if (files && files.length > 0) {
        return files[0].id;
    } else {
        return undefined;
    }
};

export async function getFolderName(folderId: string): Promise<string> {

    let response = await gapi.client.drive.files.get({
        fileId: folderId,
        fields: "name"
    });

    if (response.result.name === undefined) {
        throw new Error("not found name property in response");
    }

    return  response.result.name;
}