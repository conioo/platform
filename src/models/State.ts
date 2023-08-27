import { OctokitInfo } from "./OctokitInfo";
import { Tokens } from "./Tokens";

export class State {
    isLogin: boolean;
    isLogging: boolean;
    octokitInfo: OctokitInfo;
    tokens: Tokens;
    isRecord: boolean;
    fileNameToView: string | null;
    fileNameToModify: string | undefined;
    oneRegenerateFilenames: boolean;
    recordDestinationPath: string | null;

    constructor() {
        this.isLogin = false;
        this.isLogging = false;
        this.isRecord = false;

        this.fileNameToModify = undefined;
        this.fileNameToView = null;
        this.oneRegenerateFilenames = false;
        this.recordDestinationPath = null;

        this.octokitInfo = new OctokitInfo("", "");
        this.tokens = new Tokens();
    }
}