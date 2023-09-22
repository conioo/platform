import { useNavigate } from 'react-router-dom';
import File from '../models/File';

interface RowOfModuleProps {
    file: File;
    isLogin: boolean;
    basePath: string;
}

export default function RowOfModule({ file, isLogin, basePath }: RowOfModuleProps) {
    let Navigate = useNavigate();

    return (
        <li className='row-of-files'>
            <div className='filename'>{file.name}</div>
            <div className='file-buttons'>
                <button className='icon-reply file-button' onClick={() => { Navigate(basePath + "/view/" + file.id) }} >
                </button>
                {isLogin && <button className='icon-wrench file-button' onClick={() => { Navigate(basePath + "/modify/" + file.id) }} ></button>}
            </div>
        </li>
    );
}