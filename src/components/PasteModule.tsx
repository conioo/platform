import { useSelector } from "react-redux";
import { copyModule, moveModule } from "../google/GoogleDriveService";
import { selectCurrentParentFolderId, setModuleIdToCopy, setModuleIdToMove } from "../redux/slices/module";
import '../css/PasteModule.css';
import { useStore } from "react-redux";

interface PasteModuleProps {
    moduleIdToMove: string | null;
    moduleIdToCopy: string | null;
    updateListOfFiles: () => void;
}

export default function Pastemodule({ moduleIdToMove, moduleIdToCopy, updateListOfFiles}: PasteModuleProps) {
    console.log("Pastemodule")

    const currentParentFolderId = useSelector(selectCurrentParentFolderId);
    const store = useStore();

    if(moduleIdToMove === null && moduleIdToCopy === null)
    {
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

        } else if (moduleIdToCopy !== null) {
            await copyModule("kabaczek", moduleIdToCopy, currentParentFolderId);
            store.dispatch(setModuleIdToCopy(null));
            updateListOfFiles();
        }
    }
}