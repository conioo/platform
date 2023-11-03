import { Field } from "formik";
import { useSelector } from "react-redux";
import { selectLanguageState } from "../../../redux/slices/language";
import Language from "../../../types/Language";
// import '../../css/VoiceSelectField.css';

export default function VoiceSelectField() {

    let languageState = useSelector(selectLanguageState);
    let options: (JSX.Element | undefined)[] = new Array<undefined>();

    if (languageState.language === Language.English) {
        if (languageState.englishVoices !== undefined) {
            options = languageState.englishVoices.map((voice, index) => {
                return <option value={voice.name} key={index + "vo"}>{voice.name}</option>
            });
        }
    } else if (languageState.language === Language.German) {
        if (languageState.germanVoices !== undefined) {
            options = languageState.germanVoices.map((voice, index) => {
                return <option value={voice.name} key={index + "vo"}>{voice.name}</option>
            });
        }
    }
    else if (languageState.language === Language.Spanish) {
        if (languageState.spanishVoices !== undefined) {
            options = languageState.spanishVoices.map((voice, index) => {
                return <option value={voice.name} key={index + "vo"}>{voice.name}</option>
            });
        }
    }

    return (<Field name="module.voiceName" as="select" className="voice-select-field">
        {options}
    </Field>);
}