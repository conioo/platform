import { useNavigate } from 'react-router-dom';
import File from '../../models/File';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { hideFile, shareFile } from '../../google/GoogleDriveAuthorizeService';
import Spinner from 'react-bootstrap/esm/Spinner';
import Form from 'react-bootstrap/esm/Form';
import { useState } from 'react';

interface RowOfModuleProps {
    file: File;
    isLogin: boolean;
    basePath: string;
    hidingMode: boolean;
    updateListOfFiles: () => Promise<void>;
}

export default function RowOfModule({ file, isLogin, basePath, hidingMode, updateListOfFiles }: RowOfModuleProps) {
    let navigate = useNavigate();
    const [isWorking, setIsWorking] = useState(false);

    return (
        <ListGroup.Item as="li" variant={file.isPublic ? 'light' : 'secondary'} className='file-browser__list-group-item' action onClick={() => {
            if (hidingMode) {
                setIsWorking(true);
                if (file.isPublic) {
                    hideFile(file.id).then(() => updateListOfFiles().then(() => setIsWorking(false)));
                }
                else {
                    shareFile(file.id).then(() => updateListOfFiles().then(() => setIsWorking(false)));//correct
                }

            } else {
                navigate(basePath + "/view/" + file.id)
            }
        }}>
            <span className='file-browser__filename'>{file.name}</span>

            {isWorking && <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                <span className="visually-hidden">Waiting...</span>
            </Spinner>}

            {!isWorking && isLogin && hidingMode && <Form.Check className='file-browser__hiding-mode-check' checked={file.isPublic} />}
            {!isWorking && isLogin && <Button className='file-browser__button' variant='warning' onClick={(event) => { event.stopPropagation(); navigate(basePath + "/modify/" + file.id, { state: { toMainPage: false } }) }}><i className="bi bi-gear-fill"></i></Button>}
        </ListGroup.Item>
    );
}