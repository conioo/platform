import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsLogin } from "../redux/slices/authentication";
import { useEffect } from "react";
import { selectLanguage } from "../redux/slices/language";
import { convertToName } from "../types/Language";
import Paths from "../router/Paths";

export default function useLogoutRedirect() {
    const isLogin = useSelector(selectIsLogin);
    const language = useSelector(selectLanguage);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate(`/${convertToName(language)}/${Paths.noAuthorization}`)
        }
    }, [isLogin]);
}