import { Field, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import Module from '../../../models/NewModule';
import Section from '../../../models/Section';
import Segment from '../../../models/Segment';
import { selectDeeplToken } from '../../../redux/slices/authentication';
import { selectLanguage } from '../../../redux/slices/language';
import { TranslateSentences } from '../../../services/TranslatorService';
import { FormikValuesType } from './ModuleFormik';
import './css/Content.css';
import Language from '../../../types/Language';

interface ContentProps {
    goNext: () => void;
}

export default function Content({ goNext }: ContentProps) {

    const { values, setFieldValue } = useFormikContext<FormikValuesType>();

    const language = useSelector(selectLanguage);
    const deeplToken = useSelector(selectDeeplToken);

    const targetLanguageOptions = Object.values(Language).map((language: Language, index: number) => {
        const keyOfValue = Object.values(Language).indexOf(language);
        const keyName = Object.keys(Language)[keyOfValue];

        return (<option value={language} key={index}>{keyName}</option>);
    });

    return (<>
        <h1>Tworzenie</h1>

        <span>Język docelowy</span>
        <Field name="module.targetLanguage" as="select" className="voice-select-field">
            {targetLanguageOptions}
        </Field>

        <section className='textarea-section' style={{ width: 1000 }}>
            <Field as="textarea" name="content" id="record-textarea"></Field>
        </section>

        <section>
            <button type="button" className='generate-segments-button' onClick={() => { goNextWithGenerating(); }} >Wygeneruj Kafelki</button>
            <button type="button" className='separate-dots-button' onClick={() => { SeparateDots(); }} >Oddziel kropki</button>
        </section>

        <button type="button" className='separate-dots-button' onClick={() => { goNext(); }} disabled={values.module.sections.length === 0}>Dalej</button>
    </>);

    async function goNextWithGenerating() {
        await generateModuleFromContent();
        goNext();
    }

    function SeparateDots() {
        let regex = new RegExp('[.]\\s+', 'g');
        let textsArray = values.content.split(regex);

        let newContent = "";

        for (let i = 0; i < textsArray.length; ++i) {
            newContent += textsArray[i] + ".\n";
        }

        if (newContent) {
            newContent = newContent.slice(0, -2);
        }

        let l = new RegExp('\\s');

        while (newContent.length > 0 && l.test(newContent[newContent.length - 1])) {
            newContent = newContent.slice(0, -1);
        }

        setFieldValue("content", newContent);
    }

    async function generateModuleFromContent() {
        const newSections = values.content.split('\n');

        let oldSentences = new Map<string, number>();

        for (let i = 0; i < values.module.sections.length; ++i) {
            let sentence = "";
            for (let k = 0; k < values.module.sections[i].segments.length; ++k) {
                sentence += values.module.sections[i].segments[k].sentense;
            }

            oldSentences.set(sentence, i)
        }

        let newModule = new Module();

        newModule.language = language;
        newModule.name = values.module.name;
        newModule.voiceName = values.module.voiceName;
        newModule.sections = new Array<Section>(newSections.length);

        let sentencesToTranslation = new Array<string>();
        let indexSentencesToTranslation = new Array<number>();

        for (let i = 0; i < newSections.length; ++i) {
            let index = oldSentences.get(newSections[i]);

            if (index === undefined) {
                sentencesToTranslation.push(newSections[i]);
                indexSentencesToTranslation.push(i);
            }
            else {
                newModule.sections[i] = values.module.sections[index];
            }
        }

        if (sentencesToTranslation.length > 0) {
            const targetLanguage = values.module.targetLanguage;

            const translations = await TranslateSentences(sentencesToTranslation, language, targetLanguage, deeplToken);

            for (let i = 0; i < indexSentencesToTranslation.length; ++i) {
                newModule.sections[indexSentencesToTranslation[i]] = new Section([new Segment(sentencesToTranslation[i], translations[i])]);
            }
        }

        setFieldValue("module", newModule);
    }
}