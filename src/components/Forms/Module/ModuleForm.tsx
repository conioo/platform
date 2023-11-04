import { useFormikContext } from 'formik';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLanguage } from "../../../redux/slices/language";
import store from "../../../redux/store";
import ErrorAlerts from "../../../services/FormikErrorsAlert";
import Language from "../../../types/Language";
import Buttons from "./Buttons";
import Colouring from "./Colouring";
import Content from './Content';
import { FormikValuesType } from "./ModuleFormik";
import Saving from './Saving';
import Segmenting from './Segmenting';
import './css/Buttons.css';
import './css/Colouring.css';
import './css/ModuleForm.css';

export default function ModuleForm() {
    const [FormState, setFormState] = useState<string>("content");

    const { values, errors, isSubmitting, setFieldValue } = useFormikContext<FormikValuesType>();

    const language = useSelector(selectLanguage);
    const navigate = useNavigate();

    useEffect(() => {
        let state = store.getState();

        if (language === Language.English) {
            if (state.language.englishVoices !== undefined && state.language.englishVoices.length > 0) {
                if (values.module.voiceName.length < 1) {
                    setFieldValue("module.voiceName", state.language.englishVoices[state.language.englishVoices.length - 1].name);
                }
            }
            setFieldValue("module.language", Language.English);
        }
        else if (language === Language.German) {
            if (state.language.germanVoices !== undefined && state.language.germanVoices.length > 0) {
                if (values.module.voiceName.length < 1) {
                    setFieldValue("module.voiceName", state.language.germanVoices[state.language.germanVoices.length - 1].name);
                }
            }
            setFieldValue("module.language", Language.German);
        }
        else if (language === Language.Spanish) {
            if (state.language.spanishVoices !== undefined && state.language.spanishVoices.length > 0) {
                if (values.module.voiceName.length < 1) {
                    setFieldValue("module.voiceName", state.language.spanishVoices[state.language.spanishVoices.length - 1].name);
                }
            }
            setFieldValue("module.language", Language.Spanish);
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
            <button className='icon-reply options-button return-button' onClick={() => navigate(-1)} type="button"></button>

            <section className="main-modify-section">
                {FormState === "content" && <Content goNext={goToButtons}></Content>}
                {FormState === "buttons" && <Buttons goNext={goToSegmeting} goBack={goToContent}></Buttons>}
                {FormState === "segmeting" && <Segmenting goNext={goToColouring} goBack={goToButtons}></Segmenting>}
                {FormState === "colouring" && <Colouring goNext={goToSaving} goBack={goToSegmeting}></Colouring>}
                {FormState === "saving" && <Saving></Saving>}
            </section>
        </>
    );

    function goToButtons() {
        setFormState("buttons");
    }

    function goToContent() {
        setFormState("content");
    }

    function goToSegmeting() {
        setFormState("segmeting");
    }

    function goToColouring() {
        setFormState("colouring");
    }

    function goToSaving() {
        setFormState("saving");
    }

    // function setUpdatedModule() {
    //     let newModule = JSON.parse(JSON.stringify(values.module)) as Module;

    //     for (let i = 0; i < values.module.segments.length; ++i) {
    //         let sentenceLength = values.module.segments[i].sentence.split(" ").length;

    //         if (newModule.segments[i].sentenceColors.length != sentenceLength) {
    //             newModule.segments[i].sentenceColors = new Array(sentenceLength).fill(0);
    //         }

    //         let translationLength = values.module.segments[i].translation.split(" ").length;

    //         if (newModule.segments[i].translationsColors.length != translationLength) {
    //             newModule.segments[i].translationsColors = new Array(translationLength).fill(0);
    //         }
    //     }

    //     setFieldValue("module", newModule);
    // }
}