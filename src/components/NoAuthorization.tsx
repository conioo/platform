import { useNavigate } from "react-router-dom"
import Language, { convertToName } from "../types/Language";

interface NoAuthorizationProps {
    language: Language
}

export default function NoAuthorization({ language }: NoAuthorizationProps) {
    const navigate = useNavigate();

    return (
        <>
            <h2>Brak uprawnień</h2>
            <button className='options-button' onClick={() => navigate(`/${convertToName(language)}/browser/home`)}>Strona Główne</button>
        </>
    )
}