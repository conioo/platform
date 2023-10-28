import { useNavigate } from "react-router-dom"
import Language, { convertToName } from "../types/Language";
import { useSelector } from "react-redux";
import { selectIsLogin } from "../redux/slices/authentication";
import { selectLanguage } from "../redux/slices/language";
import { useEffect } from "react";

interface NoAuthorizationProps {
}

export default function NoAuthorization({ }: NoAuthorizationProps) {
    const navigate = useNavigate();

    const isLogin = useSelector(selectIsLogin);
    const language = useSelector(selectLanguage);

    useEffect(() => {
        if (isLogin) {
            navigate(-1);
        }
    }, [isLogin]);

    return (
        <>
            <h2>Brak uprawnień</h2>
            <button className='options-button' onClick={() => navigate(`/${convertToName(language)}/browser/home`)}>Strona Główne</button>
        </>
    )
}