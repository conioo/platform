import { Link, redirect, useNavigate } from 'react-router-dom';
import File from '../../models/File';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';

interface RowOfFolderProps {
    folder: File;
    isLogin: boolean;
    basePath: string;
    fullPath: string;
}

export default function RowOfFolder({ folder, fullPath, isLogin, basePath }: RowOfFolderProps) {
    let navigate = useNavigate();

    return (
        <ListGroup.Item as="li" variant='primary' className='file-browser__list-group-item' action onClick={() => {
            navigate(basePath + "/browser/" + fullPath + "/" + folder.name + "?folder-id=" + folder.id, {});
        }}>
            <span className='file-browser__filename'>{folder.name}</span>
            {/* <Link to={basePath + "/browser/" + fullPath + "/" + folder.name + "?folder-id=" + folder.id}>klikaj</Link> */}
            {isLogin && <Button className='file-browser__button' variant='danger' onClick={(event) => { event.stopPropagation(); navigate(basePath + "/modify-folder/" + folder.id) }}><i className="bi bi-gear-fill"></i></Button>}
        </ListGroup.Item>
    );
}