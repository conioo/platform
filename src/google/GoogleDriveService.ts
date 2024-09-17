import File from "../models/File";
import Module from "../models/Module";
import Language from "../types/Language";

export interface FileResponse {
    name: string;
    id: string;
    description: string;
    mimeType: string;
    permissions: Array<gapi.client.drive.Permission> | undefined;
}

export async function getModule(moduleId: string): Promise<Module> {
    console.log("moduly");

    const fileListUrl = `https://www.googleapis.com/drive/v3/files?q='${moduleId}'+in+parents+and+name+=+'module.json'&key=${process.env.REACT_APP_API_KEY}&fields=files(name,id)`;

    try {
        // const fileListResponse = await gapi.client.drive.files.list({
        //     q: `'${moduleId}' in parents and name = 'module.json'`,
        //     fields: 'files(id,name)',
        //     pageSize: 1,
        // });
        //const files = fileListResponse.data.files;

        // const options: RequestInit = {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // Dodaj nagłówki CORS, jeśli to konieczne
        //         'Access-Control-Allow-Origin': '*',  // Nie używaj tego w produkcji, to tylko przykład!
        //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        //         'Access-Control-Allow-Headers': 'Content-Type',
        //     },
        // };

        const options: RequestInit = {
            // method: 'GET',
            // mode: 'no-cors',  // Ustawienie trybu no-cors
        };

        const response = await fetch(fileListUrl, options);
        const fileListResponse = await response.json();
        const files = fileListResponse.files;

        if (!files || !files[0].id) {
            throw new Error('No files in directory');
        }
//correct, all
        const getModuleUrl = `https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media&key=${process.env.REACT_APP_API_KEY}`;

        const fileResponse = await fetch(getModuleUrl, options);
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

export async function getAudio(audioId: string): Promise<string> {
    try {
      // const moduleId = 'ID_FOLDERU'; // ID folderu w Google Drive
      // const fileListUrl = `https://www.googleapis.com/drive/v3/files?q='${moduleId}'+in+parents+and+mimeType='audio/mpeg'&key=${process.env.REACT_APP_API_KEY}&fields=files(name,id)`;

      // // Pobranie listy plików z Google Drive
      // const fileListResponse = await fetch(fileListUrl);
      // const fileListData = await fileListResponse.json();
      // const files = fileListData.files;

      // if (!files || !files[0]?.id) {
      //     throw new Error('Plik audio nie został znaleziony');
      // }

      // URL do pobrania pliku audio
      const getAudioUrl = `https://www.googleapis.com/drive/v3/files/1u_ZA-KHrcnLZPriPVbRyGf1t-7X-HTYh?alt=media&key=${process.env.REACT_APP_API_KEY}`;

      // Pobranie pliku audio jako blob
      const response = await fetch(getAudioUrl);
      const audioBlob = await response.blob();

      // Stworzenie URL do bloba
      const blobUrl = URL.createObjectURL(audioBlob);

      return blobUrl;
    } catch (error) {
      console.error('Błąd podczas pobierania pliku audio:', error);
      throw error;
    }
  }

export async function getListOfFiles(folderId: string): Promise<{ files: Array<File>, folders: Array<File> } | undefined> {

    try {
        let url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.REACT_APP_API_KEY}&fields=files(name,description, id, mimeType)`;

        let requestOptions = undefined;

        if (gapi.auth2) {
            const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

            if (accessToken) {
                url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.REACT_APP_API_KEY}&fields=files(name,description, id, mimeType, permissions(id))`;

                requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
            }
        }

        let filesArray = new Array<File>();
        let foldersArray = new Array<File>();

        let response = await fetch(url, requestOptions);

        let jsonResponse = await response.json();
        // console.log(jsonResponse);

        if (jsonResponse.files) {
            let files = jsonResponse.files as Array<FileResponse>;

            files.forEach(file => {

                if (file.mimeType === "application/vnd.google-apps.folder") {
                    if (file.description && file.description === "folder") {
                        foldersArray.push(new File(file.name, file.id, (file.permissions ? file.permissions.length === 2 : true)));
                    }
                    else {
                        filesArray.push(new File(file.name, file.id, (file.permissions ? file.permissions.length === 2 : true)));
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

async function findFolderId(parentFolderId: string | undefined, folderName: string): Promise<string | undefined> {
    // const response = await gapi.client.drive.files.list({
    //     q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    // });

    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+name='${folderName}'&key=${process.env.REACT_APP_API_KEY}`;

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