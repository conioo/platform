import { useNavigate } from 'react-router-dom';
import File from '../../models/File';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';

interface RowOfFolderProps {
    folder: File;
    isLogin: boolean;
    basePath: string;
    fullPath: string;
    setFolderOpenId: (folderId: string) => void;
}

export default function RowOfFolder({ folder, fullPath, isLogin, basePath, setFolderOpenId }: RowOfFolderProps) {
    let Navigate = useNavigate();
    return (
        <ListGroup.Item as="li" variant='primary' className='file-browser__list-group-item' action onClick={() => { setFolderOpenId(folder.id); Navigate(basePath + "/browser/" + fullPath + "/" + folder.name) }}>
            <span className='file-browser__filename'>{folder.name}</span>

            {isLogin && <Button className='file-browser__button' variant='danger' onClick={(event) => { event.stopPropagation(); Navigate(basePath + "/modify-folder/" + folder.id) }}><i className="bi bi-gear-fill"></i></Button>}
        </ListGroup.Item>
    );
}