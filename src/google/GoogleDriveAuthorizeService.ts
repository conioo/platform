import Module from "../models/Module";
import Tokens from "../models/Tokens";
// import { copyModule, getFilesOfFolder } from "./GoogleDriveService";

export async function removeFolder(folderId: string) {
    await gapi.client.drive.files.delete({
        fileId: folderId,
    });
}

export async function changeFolderName(folderId: string, newName: string) {

    await gapi.client.drive.files.update({
        fileId: folderId,
        resource: {
            name: newName
        }
    });
}

export async function moveFolder(folderId: string, newParentFolderId: string) {

    await gapi.client.drive.files.update({
        fileId: folderId,
        addParents: newParentFolderId,
        resource: {
        }
    });
}

export async function copyFolder(folderName: string, folderId: string, parentFolderId: string) {

    let newFolderId = await createFolder(folderName, parentFolderId);

    let files = await getFilesOfFolder(folderId, "id, mimeType, description, name");

    let promises = new Array<Promise<void>>();

    for (let file of files) {
        if (file.id === undefined || file.name === undefined) {
            throw new Error("not found any file property");
        }

        if (file.description === "folder") {
            promises.push(copyFolder(file.name, file.id, newFolderId));
        }
        else {
            promises.push(copyModule(file.name, file.id, newFolderId));
        }
    }

    await Promise.all(promises);
}

export async function getFolderName(folderId: string): Promise<string> {

    let response = await gapi.client.drive.files.get({
        fileId: folderId,
        fields: "name"
    });

    if (response.result.name === undefined) {
        throw new Error("not found name property in response");
    }

    return response.result.name;
}

async function createFolder(folderName: string, parentFolderId: string): Promise<string> {

    let response = await gapi.client.drive.files.create({
        resource: {
            name: folderName,
            parents: [parentFolderId],
            mimeType: 'application/vnd.google-apps.folder',
            description: "folder",
        }
    });

    if (response.result.id === undefined) {
        throw new Error("not found id property in response");
    }

    return response.result.id;
}

export async function isFolderEmpty(folderId: string) {
    let response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "files(id)"
    });

    if (response.result.files === undefined) {
        return true;
    }

    return response.result.files.length === 0;
}

export async function updateModuleInGoogleDrive(moduleId: string, newModuleContent: Module, oldModuleName: string) {
    try {
        const fileListUrl = `https://www.googleapis.com/drive/v3/files?q='${moduleId}'+in+parents+and+name+=+'module.json'&key=${process.env.REACT_APP_API_KEY}&fields=files(name,id)`;

        const response = await fetch(fileListUrl);
        const fileListResponse = await response.json();
        const files = fileListResponse.files;

        if (!files || !files[0].id) {
            throw new Error('No files in directory');
        }

        console.log(files[0].id);

        const jsonString = JSON.stringify(newModuleContent);

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

export async function updateFileInGoogleDrive(fileId: string, newFileContent: Module) {
    try {
        const jsonString = JSON.stringify(newFileContent);

        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        let fileResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: jsonString,
        })

        console.log('File updated successfully:', fileResponse);

    } catch (error: any) {
        console.error('Error updating file:', error);
    };
}

export async function copyModule(moduleName: string, moduleId: string, destinationFolderId: string) {
    try {
        let newModuleFolderId = await createModuleFolder(destinationFolderId, moduleName);

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

export async function getFilesOfFolder(folderId: string, fields: string): Promise<gapi.client.drive.File[]> {
    const fileListResponse = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: `files(${fields})`,
    });

    if (fileListResponse.result.files === undefined) {
        throw new Error("files is undefinied");
    }

    return (fileListResponse.result.files);
}

async function createModuleFolder(parentFolderId: string, folderName: string, desciption?: string): Promise<string> {
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

export async function removeFolderFromGoogleDrive(folderId: string) {
    await gapi.client.drive.files.delete({
        fileId: folderId
    });
}

export async function getSecrets(): Promise<Tokens | undefined> {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: process.env.REACT_APP_SECRET_FILE_ID ? process.env.REACT_APP_SECRET_FILE_ID : "",
            alt: 'media',
        });

        const jsonData = JSON.parse(response.body);

        return jsonData;
    } catch (error) {
        console.error('Error during downloads secrets:', error);

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
            throw Error("Missing for folder id");
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

export async function shareFile(fileId: string) {
    try {

        let permision: gapi.client.drive.Permission = {
            type: 'anyone',
            kind: 'drive#permission',
            role: 'reader',
            allowFileDiscovery: false
        };

        await gapi.client.drive.permissions.create({ fileId: fileId, resource: permision });

        // let response = await gapi.client.drive.permissions.list({ fileId: fileId });
        // const jsonData = JSON.parse(response.body);
        // console.log(jsonData.permissions);
    } catch (error: any) {
        console.error('Error during changing permisions for file:', error);
    };
}

export async function hideFile(fileId: string) {
    try {
        await gapi.client.drive.permissions.delete({ fileId: fileId, permissionId: 'anyoneWithLink' });

    } catch (error: any) {
        console.error('Error during delete permisions for file:' + fileId + ' ', error);
    };
}