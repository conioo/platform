import { Octokit } from "@octokit/rest";
import { Segment } from "../models/Segment";
import { State } from "../models/State";
import { BlobToBase64Async } from "./AudioService";

export async function OpenFile(state: State, fileName: string): Promise<Array<Segment> | undefined> {
    try {

        const response = await state.octokitInfo.octokitReadFree.repos.getContent({
            owner: state.octokitInfo.owner,
            repo: state.octokitInfo.publicRepoName,
            path: `data/${fileName}/segments.json`,
        });

        console.log(response.data);

        let Buffer = require("buffer").Buffer;
        let fileContent = (Buffer as any).from((response.data as any).content, "base64");
        let JSONData: Array<Segment> = JSON.parse(fileContent);

        console.log(JSONData);

        return JSONData;
    } catch (error: any) {
        console.log("Błąd", error);
    }
}

export async function SaveModulToGithub(fileName: string, audioData: Array<Blob>, segmentsData: Array<Segment>, state: State) {

    if (fileName.length == 0) {
        alert("Brak nazwy pliku");
        throw "missing name";
    }

    const basePath = `data/${fileName}/`;
    const basePathForAudio = `${basePath}audio/`;

    let newSegmentsData = segmentsData.slice();

    try {
        for (let i: number = 0; i < segmentsData.length; ++i) {
            await SaveFileToGithub(basePathForAudio + `${i}.mp3`, audioData[i], state);
            newSegmentsData[i].pathToVoice = `https://raw.githubusercontent.com/miandrop/data-public/main/${basePathForAudio}${i}.mp3`;
        }

        await SaveFileToGithub(basePath + "segments.json", newSegmentsData, state);

        console.log("zapisano wszystko");

    } catch (error: any) {
        console.error("Wystąpił błąd:", error);
    }
}

export async function SaveFileToGithub(filePath: string, fileContent: any, state: State): Promise<any> {
    let stringContent: string;

    if (fileContent instanceof Blob) {
        stringContent = await BlobToBase64Async(fileContent);
    }
    else {
        stringContent = Buffer.from(JSON.stringify(fileContent)).toString('base64');
    }

    try {
        await state.octokitInfo.octokitPublic.repos.createOrUpdateFileContents({
            owner: state.octokitInfo.owner,
            repo: state.octokitInfo.publicRepoName,
            path: filePath,
            message: `${Math.random()} ${filePath}`,
            content: stringContent,
        });
    }
    catch (error) {
        console.error('Wystąpił błąd podczas zapisywania pliku:', error);
    }
}

// export async function RemoveFileFromGithub(state: State, fileName: string) {
//     try {
//         await state.octokitInfo.octokitPublic.repos({
//             owner: state.octokitInfo.owner,
//             repo: state.octokitInfo.publicRepoName,
//             path: filePath,
//             message: `${Math.random()} ${filePath}`,
//             content: stringContent,
//         });
//     }
//     catch (error) {
//         console.error('Wystąpił błąd podczas zapisywania pliku:', error);
//     }

// }

// export async function DeleteModulFromGithub(state: State, directoryPath: string) {
//     try {
//         const currentCommit = await GetCurrentCommit(state);

//         const { data: repoTree } = await state.octokitInfo.octokitPublic.git.getTree({
//             owner: state.octokitInfo.owner,
//             repo: state.octokitInfo.publicRepoName,
//             tree_sha: currentCommit.treeSha
//         })

//         const directorySha = await GetDirectorySha(repoTree.tree, directoryPath);

//         if (!directorySha) {
//             throw new Error(`Could not find an directory '${directoryPath}'`)
//         }

//         const { data: directoryTree } = await state.octokitInfo.octokitPublic.git.getTree({
//             owner: state.octokitInfo.owner,
//             repo: state.octokitInfo.publicRepoName,
//             tree_sha: directorySha
//         })

//         const blobs = directoryTree.tree.map((blob) => {
//             return { 'url': `${directoryPath}/${blob.path}`, 'sha': null }
//         });

//         const newTree = await createNewTree(
//             github,
//             org,
//             repo,
//             blobs,
//             currentCommit.treeSha
//         )

//         const commitMessage = `Deleting '${directoryName}' files.`
//         const newCommit = await createNewCommit(
//             github,
//             org,
//             repo,
//             commitMessage,
//             newTree.sha,
//             currentCommit.commitSha
//         )
//         await setBranchToCommit(github, org, repo, newCommit.sha)


//     }
// }

// async function GetCurrentCommit(state: State) {
//     const { data: refData } = await state.octokitInfo.octokitPublic.git.getRef({
//         owner: state.octokitInfo.owner,
//         repo: state.octokitInfo.publicRepoName,
//         ref: `heads/main`,
//     })

//     const commitSha = refData.object.sha

//     const { data: commitData } = await state.octokitInfo.octokitPublic.git.getCommit({
//         owner: state.octokitInfo.owner,
//         repo: state.octokitInfo.publicRepoName,
//         commit_sha: commitSha,
//     })

//     return {
//         commitSha,
//         treeSha: commitData.tree.sha,
//     }
// }

// async function GetDirectorySha(tree: { path?: string, sha?: string }[], directoryName: string) {
//     return tree
//         .filter(({ path: directoryPath }) => directoryPath ? directoryPath.includes(directoryName) : false)
//         .map(({ sha }) => sha)
//         .filter(sha => sha !== undefined).values().next().value
// };


