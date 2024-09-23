import { useFormikContext } from 'formik';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../../../redux/slices/language";
import store from "../../../../redux/store";
import ErrorAlerts from "../../../../services/FormikErrorsAlert";
import Language from "../../../../types/Language";
import TargetLanguage from '../../../../types/TargetLanguage';
import Buttons from "../Buttons";
import Colouring from "../Colouring";
import Content from '../Content';
import { FormikValuesType } from "../ModuleFormik/ModuleFormik";
import Saving from '../Saving';
import './ModuleForm.scss';

export default function ModuleForm() {
    const [FormState, setFormState] = useState<string>("content");

    const { values, errors, isSubmitting, setFieldValue } = useFormikContext<FormikValuesType>();

    const language = useSelector(selectLanguage);

    useEffect(() => {
        let state = store.getState();

        setFieldValue("module.targetLanguage", TargetLanguage.Polish);

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
        <section className="module-form">
            {FormState === "content" && <Content goNext={goToButtons}></Content>}
            {FormState === "buttons" && <Buttons goNext={goToColouring} goBack={goToContent}></Buttons>}
            {FormState === "colouring" && <Colouring goNext={goToSaving} goBack={goToButtons}></Colouring>}
            {/* {FormState === "segmeting" && <Segmenting goNext={goToColouring} goBack={goToButtons}></Segmenting>} */}
            {/* {FormState === "colouring" && <Colouring goNext={goToSaving} goBack={goToColouring}></Colouring>} */}
            {FormState === "saving" && <Saving goBack={goToButtons}></Saving>}
        </section>
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
}