import { useNavigate } from 'react-router-dom';
import File from '../models/File';

interface RowOfModuleProps {
    folder: File;
    isLogin: boolean;
    basePath: string;
    fullPath: string;
    removeFolder: (folder: File) => void;
}

export default function RowOfModule({ folder, fullPath, isLogin, basePath, removeFolder }: RowOfModuleProps) {
    let Navigate = useNavigate();
    return (
        <li className='row-of-folders'>
            <div className='filename'>{folder.name}</div>
            <div className='file-buttons'>
                <button className='icon-reply file-button' onClick={() => { Navigate(basePath + "/browser/" + fullPath + "/" + folder.name) }} >
                </button>
                {isLogin && <button className='icon-cog file-button' onClick={() => { Navigate(basePath + "/modify-folder/" + folder.id) }} ></button>}
            </div>
        </li>
    );
}