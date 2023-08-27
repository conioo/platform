import { OctokitInfo } from "./models/OctokitInfo";
import { State } from "./models/State";
import { Tokens } from "./models/Tokens";
import Action from "./types/Action";
import ActionType from "./types/ActionType";

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.Logging: return { ...state, isLogging: true };
        case ActionType.Login: return login(state, action.payload);
        case ActionType.Logout: return logout(state);
        // case ActionType.ReturnFromRecord: return{...state, isRecord: false};
        case ActionType.GoToRecord: return { ...state, isRecord: true, recordDestinationPath: action.payload };
        // case ActionType.ReturnFromView: return { ...state, fileNameToView: null };
        case ActionType.ViewFile: return viewFile(state, action.payload);
        case ActionType.ModifyFile: return { ...state, fileNameToModify: action.payload };
        // case ActionType.ReturnFromModifyFile: return { ...state, fileNameToModify: undefined };
        case ActionType.ReturnFromModifyFileByRemovedFile: return { ...state, fileNameToModify: undefined, oneRegenerateFilenames: true };
        case ActionType.RegeneratedFilename: return { ...state, oneRegenerateFilenames: false };
        case ActionType.Return: return back(state);

        default: return state;
    }
}

function logout(state: State): State {
    return { ...state, isLogin: false, tokens: new Tokens(), octokitInfo: new OctokitInfo("", "") };
}

function login(state: State, tokensInfo: Tokens): State {
    return { ...state, isLogin: true, isLogging: false, tokens: tokensInfo, octokitInfo: new OctokitInfo(tokensInfo.gitPrivate, tokensInfo.gitPublic) };
}

function viewFile(state: State, filename: string): State {
    return { ...state, fileNameToView: filename };
}

function back(state: State): State {
    if (state.isRecord) {
        return { ...state, isRecord: false };
    }

    if (state.fileNameToView) {
        return { ...state, fileNameToView: null };
    }

    if (state.fileNameToModify) {
        return { ...state, fileNameToModify: undefined }
    }

    return { ...state };
}