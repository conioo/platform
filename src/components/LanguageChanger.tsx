import { Navigate, useNavigate } from "react-router-dom";
import Language from "../types/Language"
import { useAppSelector } from "../redux/hook";
import { selectLanguage } from "../redux/slices/language";
import "../css/LanguageChanger.css";

export default function LanguageChanger() {
    let navigate = useNavigate();
    let currentLanguage = useAppSelector(selectLanguage);

    return (
        <div className='login'>
            <select className='change-language-menu' onClick={(e) => changeLanguage(e.currentTarget.value)}>
                <option value="en" selected={currentLanguage === Language.English}>Angielski</option>
                <option value="de" selected={currentLanguage === Language.German}>Niemiecki</option>
                <option value="es" selected={currentLanguage === Language.Spanish}>Hiszpański</option>
            </select>
        </div>
    )

    function changeLanguage(language: string) {
        if (currentLanguage !== language) {
            navigate(`/${language}/browser/home`);
        }
    }
}