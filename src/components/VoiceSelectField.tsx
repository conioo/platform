import { useSelector } from "react-redux";
import { selectLanguage } from "../redux/slices/language";
import Language from "../types/Language";
import { EnglishVoices } from "../types/EnglishVoices";
import { GermanVoices } from "../types/GermanVoices";
import { Field } from "formik";
import '../css/VoiceSelectField.css';

export default function VoiceSelectField() {

    let language = useSelector(selectLanguage);
    let options: JSX.Element[] = new Array<JSX.Element>();

    if (language === Language.English) {
        options = EnglishVoices.map((voiceName: string, index: number) => {
            return (
                <option value={index}>{voiceName}</option>
            )
        });
    } else if (language === Language.German) {
        options = GermanVoices.map((voiceName: string, index: number) => {
            return (
                <option value={index}>{voiceName}</option>
            )
        });
    }

    return (<Field name="module.voiceType" as="select" className="voice-select-field">
        {options}
    </Field>);
}