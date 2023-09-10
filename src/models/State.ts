import GoogleSecrets from "../google/GoogleSecrets";
import Language from "../types/Language";
import File from "./File";
import Tokens from "./Tokens";

export default class State {
    isLogin: boolean;
    tokens: Tokens;
    isRecord: boolean;
    fileToView: File | undefined;
    fileToModify: File | undefined;
    oneRegenerateFilenames: boolean;
    folderParentId: string | null;
    currentPath: Array<File>;
    voices: Array<SpeechSynthesisVoice>;
    language: Language;

    constructor() {
        this.isLogin = false;
        this.isRecord = false;

        this.fileToModify = undefined;
        this.fileToView = undefined;
        this.oneRegenerateFilenames = false;
        this.folderParentId = null;

        this.language = Language.English;

        this.voices = new Array<SpeechSynthesisVoice>();

        this.tokens = new Tokens();
        this.currentPath = [new File("englishData", GoogleSecrets.DATA_ENGLISH_FOLDER_ID)];
    }
}