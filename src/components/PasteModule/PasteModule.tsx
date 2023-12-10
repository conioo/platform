import { useSelector, useStore } from "react-redux";
import './PasteModule.scss';
import { copyFolder, moveFolder } from "../../google/GoogleDriceAuthorizeService";
import { copyModule, moveModule } from "../../google/GoogleDriveService";
import { selectCurrentParentFolderId, selectfolderIdToMove, selectfolderInfoToCopy, setFolderIdToMove, setFolderInfoToCopy } from "../../redux/slices/folder";
import { selectModuleIdToMove, selectModuleInfoToCopy, setModuleIdToMove, setModuleInfoToCopy } from "../../redux/slices/module";
import Button from "react-bootstrap/esm/Button";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";

interface PasteModuleProps {
    updateListOfFiles: () => void;
    targetFolderId: string;
}

export default function PasteModule({ updateListOfFiles, targetFolderId }: PasteModuleProps) {
    console.log("PasteModule")
    const [isPasting, setIsPasting] = useState(false);

    let moduleInfoToCopy = useSelector(selectModuleInfoToCopy);
    let moduleIdToMove = useSelector(selectModuleIdToMove);
    let folderInfoToCopy = useSelector(selectfolderInfoToCopy);
    let folderIdToMove = useSelector(selectfolderIdToMove);

    const store = useStore();

    useEffect(() => {
        if (!isPasting) {
            return;
        }

        console.log("wklejamy");
        onClickPasteButton();

    }, [isPasting]);

    if (moduleIdToMove === null && moduleInfoToCopy === null && folderInfoToCopy === null && folderIdToMove === null) {
        return null;
    }

    return (
        <section className="paste-module">
            {isPasting && <Button variant='blue' disabled>
                <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                    <span className="visually-hidden">Wklejanie...</span>
                </Spinner>
                Wklejanie...
            </Button>}

            {!isPasting && <Button variant="blue" onClick={() => setIsPasting(true)}>Wklej</Button>}
        </section>
    );

    async function onClickPasteButton() {
        if (moduleIdToMove !== null) {
            await moveModule(moduleIdToMove, targetFolderId);
            store.dispatch(setModuleIdToMove(null));
            updateListOfFiles();

        } else if (moduleInfoToCopy !== null) {
            console.log(targetFolderId);
            await copyModule(moduleInfoToCopy.moduleName, moduleInfoToCopy.moduleId, targetFolderId);
            store.dispatch(setModuleInfoToCopy(null));
            updateListOfFiles();
        } else if (folderInfoToCopy !== null) {
            await copyFolder(folderInfoToCopy.folderName, folderInfoToCopy.folderId, targetFolderId);
            store.dispatch(setFolderInfoToCopy(null));
            updateListOfFiles();
        } else if (folderIdToMove !== null) {
            await moveFolder(folderIdToMove, targetFolderId);
            store.dispatch(setFolderIdToMove(null));
            updateListOfFiles();
        }
    }
}