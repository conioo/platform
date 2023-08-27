import { Octokit } from "@octokit/rest";

export class OctokitInfo {
    readonly owner: string = "miandrop";
    readonly publicRepoName: string = "data-public";
    readonly privateRepoName: string = "data";
    octokitPublic: Octokit;
    octokitPrivate: Octokit;
    octokitReadFree: Octokit;
    multipleOctokitPublic: any;

    constructor(privateToken: string, publicToken: string) {
        this.octokitPublic = new Octokit({
            auth: publicToken,
            baseUrl: "https://api.github.com",
        });

        this.octokitPrivate = new Octokit({
            auth: privateToken,
            baseUrl: "https://api.github.com",
        });

        const MultipleOctokit = Octokit.plugin(require("octokit-commit-multiple-files"));

        this.multipleOctokitPublic = new MultipleOctokit({
            auth: publicToken,
            baseUrl: "https://api.github.com",
        });

        this.octokitReadFree = new Octokit({
            baseUrl: "https://api.github.com",
        });
    }
}