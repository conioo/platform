import { useNavigate } from 'react-router-dom';
import File from '../../models/File';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';

interface RowOfModuleProps {
    file: File;
    isLogin: boolean;
    basePath: string;
}

export default function RowOfModule({ file, isLogin, basePath }: RowOfModuleProps) {
    let navigate = useNavigate();

    return (
        <ListGroup.Item as="li" variant='light' className='file-browser__list-group-item' action onClick={() => { navigate(basePath + "/view/" + file.id) }}>
            <span className='file-browser__filename'>{file.name}</span>

            {isLogin && <Button className='file-browser__button' variant='warning' onClick={(event) => { event.stopPropagation(); navigate(basePath + "/modify/" + file.id, { state: { toMainPage: false } }) }}><i className="bi bi-gear-fill"></i></Button>}
        </ListGroup.Item>
    );
}