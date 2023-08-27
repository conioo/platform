import { Octokit as Github } from '@octokit/rest';
import { State } from '../models/State';

export default async function DeleteDirectoryFromGithub(state: State, path: string) {

  const owner = state.octokitInfo.owner;
  const repo = state.octokitInfo.publicRepoName;
  const octokit = state.octokitInfo.octokitPublic;

  try {
    const { data: branchData } = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: "main", // Zastąp odpowiednią nazwą gałęzi
    });

    const sha = branchData.commit.sha;

    const { data: directoryData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path,
      ref: sha,
    });

    for (const item of directoryData as Array<{ path: string; type: string; sha: string }>) {
      if (item.type === "file") {
        // Usuń plik
        await octokit.rest.repos.deleteFile({
          owner,
          repo,
          path: item.path,
          message: "Usuwanie pliku",
          sha: item.sha,
          branch: "main", // Zastąp odpowiednią nazwą gałęzi
        });
      } else if (item.type === "dir") {
        // Rekurencyjnie usuń podkatalog
        await DeleteDirectoryFromGithub(state, item.path);
      }
    }

    await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path: path,
      message: "Usuwanie katalogu",
      sha: sha,
      branch: "main",
    });

    console.log("Katalog został usunięty wraz z zawartością.");
  } catch (error) {
    console.error("Wystąpił błąd podczas usuwania katalogu:", error);
  }
}