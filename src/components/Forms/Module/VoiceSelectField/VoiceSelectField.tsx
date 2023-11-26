import { Field } from "formik";
import { useSelector } from "react-redux";
import { selectLanguageState } from "../../../../redux/slices/language";
import Language from "../../../../types/Language";
import './VoiceSelectField.scss';
import Form from 'react-bootstrap/Form';

interface VoiceSelectFieldProps {
    className?: string;
}

export default function VoiceSelectField({ className }: VoiceSelectFieldProps) {

    let languageState = useSelector(selectLanguageState);
    let options: (JSX.Element | undefined)[] = new Array<undefined>();

    if (languageState.language === Language.English) {
        if (languageState.englishVoices !== undefined) {
            options = languageState.englishVoices.map((voice, index) => {
                return <option value={voice.name} key={index}>{voice.name}</option>
            });
        }
    } else if (languageState.language === Language.German) {
        if (languageState.germanVoices !== undefined) {
            options = languageState.germanVoices.map((voice, index) => {
                return <option value={voice.name} key={index}>{voice.name}</option>
            });
        }
    }
    else if (languageState.language === Language.Spanish) {
        if (languageState.spanishVoices !== undefined) {
            options = languageState.spanishVoices.map((voice, index) => {
                return <option value={voice.name} key={index}>{voice.name}</option>
            });
        }
    }

    return (
        <Form.Group className={`voice-select-view ${className}`}>
            <Form.Label>Wybierz Głos</Form.Label>
            <Field name="module.voiceName" as="select" className="form-select voice-select-view__field">
                {options}
            </Field>
        </Form.Group>
    );
}