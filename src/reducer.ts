import Module from "./models/Module";
import State from "./models/State";
import Tokens from "./models/Tokens";
import Action from "./types/Action";
import ActionType from "./types/ActionType";
import File from "./models/File";

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.Login: return { ...state, isLogin: true, tokens: new Tokens(action.payload) };
        case ActionType.Logout: return logout(state);
        // case ActionType.ReturnFromRecord: return{...state, isRecord: false};
        case ActionType.GoToRecord: return { ...state, isRecord: true, folderParentId: action.payload };
        // case ActionType.ReturnFromView: return { ...state, fileNameToView: null };
        case ActionType.ViewFile: return viewFile(state, action.payload);
        case ActionType.ModifyFile: return { ...state, fileToModify: action.payload };
        // case ActionType.ReturnFromModifyFile: return { ...state, fileNameToModify: undefined };
        case ActionType.ReturnFromModifyFileByRemovedFile: return { ...state, fileToModify: undefined, oneRegenerateFilenames: true };
        case ActionType.RegeneratedFilename: return { ...state, oneRegenerateFilenames: false };
        case ActionType.RefreshCurrentPath: return { ...state, currentPath: action.payload };
        case ActionType.Return: return back(state);
        case ActionType.SetVoices: return { ...state, voices: action.payload };

        default: return state;
    }
}

function logout(state: State): State {
    return { ...state, isLogin: false, tokens: new Tokens() };
}

function viewFile(state: State, file: File): State {
    return { ...state, fileToView: file };
}

function back(state: State): State {
    if (state.isRecord) {
        return { ...state, isRecord: false };
    }

    if (state.fileToView) {
        return { ...state, fileToView: undefined };
    }

    if (state.fileToModify) {
        return { ...state, fileToModify: undefined }
    }

    return { ...state };
}