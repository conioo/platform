import { useEffect, useState } from "react";
import { Field, useFormikContext } from 'formik';
import Buttons from "../Buttons";
import Colouring from "../Colouring";
import Module from "../../models/Module";
import '../../css/Record.css';
import '../../css/Buttons.css';
import '../../css/Colouring.css';
import '../../css/ModuleForm.css';
import { TranslateSentences } from "../../services/TranslatorService";
import { selectLanguage } from "../../redux/slices/language";
import { useSelector } from "react-redux";
import { selectDeeplToken } from "../../redux/slices/authentication";
import Segment from "../../models/Segment";
import VoiceSelectField from "../VoiceSelectField";
import { FormikValuesType } from "./ModuleFormik";
import Language from "../../types/Language";
import store from "../../redux/store";
import { useNavigate } from "react-router-dom";
import ErrorAlerts from "../../services/FormikErrorsAlert";

export default function ModuleForm() {
    const [isColouring, setIsColouring] = useState<boolean>(false);

    const { values, errors, isSubmitting, setFieldValue } = useFormikContext<FormikValuesType>();

    const language = useSelector(selectLanguage);
    const deeplToken = useSelector(selectDeeplToken);
    const navigate = useNavigate();

    useEffect(() => {
        let state = store.getState();

        if (language === Language.English) {
            if (state.language.englishVoices !== undefined && state.language.englishVoices.length > 0) {
                if (values.module.voiceName.length < 1) {
                    setFieldValue("module.voiceName", state.language.englishVoices[state.language.englishVoices.length - 1].name);
                }
            }
        }
        else if (language === Language.German) {
            if (state.language.germanVoices !== undefined && state.language.germanVoices.length > 0) {
                if (values.module.voiceName.length < 1) {
                    setFieldValue("module.voiceName", state.language.germanVoices[state.language.germanVoices.length - 1].name);
                }
            }
        }
        else if (language === Language.Spanish) {
            if (state.language.spanishVoices !== undefined && state.language.spanishVoices.length > 0) {
                if (values.module.voiceName.length < 1) {
                    setFieldValue("module.voiceName", state.language.spanishVoices[state.language.spanishVoices.length - 1].name);
                }
            }
        }
    }, [])

    console.log(values);

    useEffect(() => {
        if (isSubmitting === false) {
            ErrorAlerts(errors);
        }
    }, [isSubmitting]);

    return (
        <>
            <div className='textarea-div'>
                <Field as="textarea" name="content" id="record-textarea"></Field>
            </div>

            <button className='icon-reply options-button return-button' onClick={() => navigate(-1)} type="button"></button>

            <div>
                <button type="button" className='generate-segments-button' onClick={() => { updateModuleFromContent(); }} >Wygeneruj Kafelki</button>
                <button type="button" className='separate-dots-button' onClick={() => { SeparateDots(); }} >Oddziel kropki</button>
            </div>

            <section className="main-modify-section">
                {!isColouring &&
                    <Buttons module={values.module} onSentenceChanged={onSentenceChanged} onTranslationChanged={onTranslationChanged} goToColouring={GenerateColouring}></Buttons>
                }

                {isColouring &&
                    <Colouring module={values.module} onSentenceColorChanged={onSentenceColorChanged} onTranslationColorChanged={onTranslationColorChanged} goToButtons={goToButtons}></Colouring>
                }
            </section>
            <VoiceSelectField></VoiceSelectField>

            <section className="save-section">
                Nazwa pliku: <Field name='module.name' id='fileName'></Field>
                <input type="submit" className='save-button' value={"Zapisz"} onClick={() => setUpdatedModule()}></input>
            </section>
        </>
    );

    function onSentenceChanged(newSentence: string, index: number) {
        setFieldValue(`module.segments[${index}].sentence`, newSentence);
    }

    function onTranslationChanged(newTranslation: string, index: number) {
        setFieldValue(`module.segments[${index}].translation`, newTranslation);
    }

    function onSentenceColorChanged(index: number, internalIndex: number, colorNumber: number) {
        setFieldValue(`module.segments[${index}].sentenceColors[${internalIndex}]`, colorNumber);
    }

    function onTranslationColorChanged(index: number, internalIndex: number, colorNumber: number) {
        setFieldValue(`module.segments[${index}].translationsColors[${internalIndex}]`, colorNumber);
    }

    function goToButtons() {
        setIsColouring(false);
    }

    function SeparateDots() {
        let d = new RegExp('[.]\\s+', 'g');
        let textsArray = values.content.split(d);

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

    async function updateModuleFromContent() {
        const newSentences = values.content.split('\n');
        let oldSentences = new Map<string, number>();

        for (let i = 0; i < values.module.segments.length; ++i) {
            oldSentences.set(values.module.segments[i].sentence, i)
        }

        let newModule = new Module();

        newModule.language = values.module.language;
        newModule.name = values.module.name;
        newModule.voiceName = values.module.voiceName;
        newModule.segments = new Array<Segment>(newSentences.length);

        let sentencesToTranslation = new Array<string>();
        let indexSentencesToTranslation = new Array<number>();

        for (let i = 0; i < newSentences.length; ++i) {
            let index = oldSentences.get(newSentences[i]);

            if (index === undefined) {
                sentencesToTranslation.push(newSentences[i]);
                indexSentencesToTranslation.push(i);
            }
            else {
                newModule.segments[i] = values.module.segments[index];
            }
        }

        if (sentencesToTranslation.length > 0) {
            const translations = await TranslateSentences(sentencesToTranslation, language, deeplToken);

            for (let i = 0; i < indexSentencesToTranslation.length; ++i) {
                newModule.segments[indexSentencesToTranslation[i]] = new Segment(sentencesToTranslation[i], translations[i]);
            }
        }

        setFieldValue("module", newModule);
    }

    function setUpdatedModule() {
        let newModule = JSON.parse(JSON.stringify(values.module)) as Module;

        for (let i = 0; i < values.module.segments.length; ++i) {
            let sentenceLength = values.module.segments[i].sentence.split(" ").length;

            if (newModule.segments[i].sentenceColors.length != sentenceLength) {
                newModule.segments[i].sentenceColors = new Array(sentenceLength).fill(0);
            }

            let translationLength = values.module.segments[i].translation.split(" ").length;

            if (newModule.segments[i].translationsColors.length != translationLength) {
                newModule.segments[i].translationsColors = new Array(translationLength).fill(0);
            }
        }

        setFieldValue("module", newModule);
    }

    function GenerateColouring() {
        setUpdatedModule();
        setIsColouring(true);
    }
}