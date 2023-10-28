import { useSelector, useStore } from "react-redux";
import '../css/PasteModule.css';
import { copyFolder, moveFolder } from "../google/GoogleDriceAuthorizeService";
import { copyModule, moveModule } from "../google/GoogleDriveService";
import { selectCurrentParentFolderId, selectfolderIdToMove, selectfolderInfoToCopy, setFolderIdToMove, setFolderInfoToCopy } from "../redux/slices/folder";
import { selectModuleIdToMove, selectModuleInfoToCopy, setModuleIdToMove, setModuleInfoToCopy } from "../redux/slices/module";

interface PasteModuleProps {
    updateListOfFiles: () => void;
}

export default function Pastemodule({ updateListOfFiles }: PasteModuleProps) {
    console.log("Pastemodule")

    let moduleInfoToCopy = useSelector(selectModuleInfoToCopy);
    let moduleIdToMove = useSelector(selectModuleIdToMove);
    let folderInfoToCopy = useSelector(selectfolderInfoToCopy);
    let folderIdToMove = useSelector(selectfolderIdToMove);

    const currentParentFolderId = useSelector(selectCurrentParentFolderId);
    const store = useStore();

    if (moduleIdToMove === null && moduleInfoToCopy === null && folderInfoToCopy === null && folderIdToMove === null) {
        return null;
    }

    return (
        <section className="paste-module-section">
            <button onClick={() => onClickPasteButton()} className="paste-module-button">Wklej</button>
        </section>
    );

    async function onClickPasteButton() {
        if (moduleIdToMove !== null) {
            await moveModule(moduleIdToMove, currentParentFolderId);
            store.dispatch(setModuleIdToMove(null));
            updateListOfFiles();

        } else if (moduleInfoToCopy !== null) {
            await copyModule(moduleInfoToCopy.moduleName, moduleInfoToCopy.moduleId, currentParentFolderId);
            store.dispatch(setModuleInfoToCopy(null));
            updateListOfFiles();
        } else if (folderInfoToCopy !== null) {
            await copyFolder(folderInfoToCopy.folderName, folderInfoToCopy.folderId, currentParentFolderId);
            store.dispatch(setFolderInfoToCopy(null));
            updateListOfFiles();
        } else if (folderIdToMove !== null) {
            await moveFolder(folderIdToMove, currentParentFolderId);
            store.dispatch(setFolderIdToMove(null));
            updateListOfFiles();
        }
    }
}