import { copyModule, getFilesOfFolder } from "./GoogleDriveService";

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