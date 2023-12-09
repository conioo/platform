import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeFolderName, removeFolder } from '../../google/GoogleDriceAuthorizeService';
import { isEmptyFolder } from '../../google/GoogleDriveService';
import useLogoutRedirect from '../../hooks/LogoutRedirect';
import { useAppDispatch } from '../../redux/hook';
import { setFolderIdToMove, setFolderInfoToCopy } from '../../redux/slices/folder';
import { selectLanguage } from '../../redux/slices/language';
import './ModifyFolder.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';


interface loaderReturnType {
    folderNamePromise: Promise<string>;
    folderId: string;
}

interface ModifyFolderProps {
    folderId: string;
    folderName: string;
}

export default function ModifyFolder({ folderId, folderName }: ModifyFolderProps) {
    console.log("ModifyFolder");

    const [folderNameForm, setFolderNameForm] = useState(folderName);
    const [isRemovingFolder, setIsRemovingFolder] = useState(false);

    const navigate = useNavigate();
    const language = useSelector(selectLanguage);
    const dispatch = useAppDispatch();

    useLogoutRedirect();

    if (isRemovingFolder) {
        remove();
        setIsRemovingFolder(false);
    }

    return (
        <>
            <h1 className='modify-folder__filename'>{folderName}</h1>

            <Form.Label>
                <Form.Control type="text" placeholder={folderName} defaultValue={folderName} onChange={(e) => setFolderNameForm(e.currentTarget.value)} />
            </Form.Label>

            <Button variant='outline-secondary' onClick={() => onClickSaveButton()}>Zapisz</Button>

            <section className='modify-folder__buttons-section'>
                <Button className='modify-folder__button' variant='blue' onClick={() => onClickMoveButton()}>Przenieś folder</Button>
                <Button className='modify-folder__button' variant='blue' onClick={() => onClickCopyButton()}>Skopiuj folder</Button>
            </section>

            <Button className='modify-folder__remove-button' variant='danger' onClick={() => onClickRemoveButton()}>Usuń folder</Button>

            {isRemovingFolder &&
                <Button className='modify-folder__remove-button' variant='danger' disabled>
                    <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                        <span className="visually-hidden">Usuwanie...</span>
                    </Spinner>
                    Usuwanie...
                </Button>
            }
        </>
    );

    async function remove() {
        let isEmpty = await isEmptyFolder(folderId);

        if (!isEmpty) {
            let result = window.confirm("Folder zawiera zawartość czy napewno usunąć wraz z zawartością?")

            if (!result) {
                return;
            }
        }

        await removeFolder(folderId);
        navigate(-1);
    }

    async function onClickSaveButton() {
        await changeFolderName(folderId, folderNameForm);
        setFolderNameForm(folderNameForm);
    }

    function onClickRemoveButton() {
        let result = window.confirm("napewno usunąć moduł?");

        if (result) {
            setIsRemovingFolder(true);
        }
    }

    function onClickMoveButton() {
        dispatch(setFolderIdToMove(folderId));

        navigate(`/${language}/browser/home`);
    }

    function onClickCopyButton() {
        dispatch(setFolderInfoToCopy({ folderId, folderName }));

        navigate(`/${language}/browser/home`);
    }
}