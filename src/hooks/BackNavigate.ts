import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectLanguage } from "../redux/slices/language";

export default function useBackNavigate() {
    const location = useLocation();
    const navigate = useNavigate();
    const language = useSelector(selectLanguage);

    function backNavigate() {
        if (location.state === null || location.state.toMainPage) {
            navigate(`/${language}/browser/home`);

        } else {
            navigate(-1);
        }
    }

    return backNavigate;
}