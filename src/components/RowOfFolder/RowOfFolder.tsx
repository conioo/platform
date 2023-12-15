import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { useNavigate } from 'react-router-dom';
import { hideFile, shareFile } from '../../google/GoogleDriveAuthorizeService';
import File from '../../models/File';
import { useState } from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';

interface RowOfFolderProps {
    folder: File;
    isLogin: boolean;
    basePath: string;
    fullPath: string;
    hidingMode: boolean;
    updateListOfFiles: () => Promise<void>;
}

export default function RowOfFolder({ folder, fullPath, isLogin, basePath, hidingMode, updateListOfFiles }: RowOfFolderProps) {
    let navigate = useNavigate();
    const [isWorking, setIsWorking] = useState(false);

    return (
        <ListGroup.Item as="li" variant={folder.isPublic ? 'primary' : 'dark'} className='file-browser__list-group-item' action onClick={() => {
            if (hidingMode) {
                setIsWorking(true);
                if (folder.isPublic) {
                    hideFile(folder.id).then(() => updateListOfFiles().then(() => setIsWorking(false)));
                }
                else {
                    shareFile(folder.id).then(() => updateListOfFiles().then(() => setIsWorking(false)));
                }

            } else {
                navigate(basePath + "/browser/" + fullPath + "/" + folder.name + "?folder-id=" + folder.id, {});
            }
        }}>
            <span className='file-browser__filename'>{folder.name}</span>

            {isWorking && <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                <span className="visually-hidden">Waiting...</span>
            </Spinner>}

            {!isWorking && isLogin && hidingMode && <Form.Check className='file-browser__hiding-mode-check' checked={folder.isPublic} />}
            {!isWorking && isLogin && <Button className='file-browser__button' variant='danger' onClick={(event) => { event.stopPropagation(); navigate(basePath + "/modify-folder/" + folder.id) }}><i className="bi bi-gear-fill"></i></Button>}
        </ListGroup.Item>
    );
}