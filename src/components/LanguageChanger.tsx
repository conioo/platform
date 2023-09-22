import { Navigate, useNavigate } from "react-router-dom";
import Language, { convertToName } from "../types/Language"
import { useAppSelector } from "../redux/hook";
import { selectLanguage } from "../redux/slices/language";

export default function LanguageChanger() {
    let navigate = useNavigate();
    let currentLanguage = useAppSelector(selectLanguage);

    let browserPath: string;
    let name: string;

    switch (currentLanguage) {
        case Language.English:
            name = "Angielski";
            browserPath = "/" + convertToName(Language.German) + "/browser/home";
            break;
        case Language.German:
            name = "Niemiecki";
            browserPath = "/" + convertToName(Language.English) + "/browser/home";
            break;
    }

    return (
        <div className='login'>
            <button className='change-language-button' onClick={() => navigate(browserPath)}>{name} </button>
        </div>
    )
}