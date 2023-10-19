import { useSelector } from "react-redux";
import { copyModule, moveModule } from "../google/GoogleDriveService";
import { moduleInfoToCopy, selectCurrentParentFolderId, setModuleIdToMove, setModuleInfoToCopy } from "../redux/slices/module";
import '../css/PasteModule.css';
import { useStore } from "react-redux";

interface PasteModuleProps {
    moduleIdToMove: string | null;
    moduleInfoToCopy: moduleInfoToCopy | null;
    updateListOfFiles: () => void;
}

export default function Pastemodule({ moduleIdToMove, moduleInfoToCopy, updateListOfFiles}: PasteModuleProps) {
    console.log("Pastemodule")

    const currentParentFolderId = useSelector(selectCurrentParentFolderId);
    const store = useStore();

    if(moduleIdToMove === null && moduleInfoToCopy === null)
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

        } else if (moduleInfoToCopy !== null) {
            await copyModule(moduleInfoToCopy.moduleName, moduleInfoToCopy.moduleId, currentParentFolderId);
            store.dispatch(setModuleInfoToCopy(null));
            updateListOfFiles();
        }
    }
}