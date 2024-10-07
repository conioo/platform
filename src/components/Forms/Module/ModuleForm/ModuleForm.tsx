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
import { useImmer } from 'use-immer';
import Segment from '../../../../models/Segment';
import { getTTSVoices } from '../../../../google/GoogleDriveAuthorizeService';
import Voice from '../../../../types/TTSVoice';
import SpeechSynthesis from '../SpeechSynthesis';

export default function ModuleForm() {
    const [FormState, setFormState] = useState<string>("content");

    const { values, errors, isSubmitting, setFieldValue } = useFormikContext<FormikValuesType>();

    //true:  changed, new     (index is -1)
    //false: not changed, old (required index)
    //0..n:(value is index in initialvalues)
    const [changedStatus, setChangedStatus] = useImmer<Array<[boolean, number]>>(new Array(values.module.sections.length).fill(null).map((_, index) => [false, index]));
    const [TTSVoices, setTTSVoices] = useState<Array<Voice>>(new Array<Voice>);

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

    useEffect(() => {

        console.log("ssssssssssssssssssssssssssssssssss");

        getTTSVoices(language).then((voices) => {
            console.log(voices);
            setTTSVoices(voices);
        });

    }, []);

    return (
        <section className="module-form">
            {FormState === "content" && <Content goNext={goToButtons} setChangedStatus={setChangedStatus}></Content>}
            {FormState === "buttons" && <Buttons goNext={goToColouring} goBack={goToContent} changedStatus={changedStatus} setChangedStatus={setChangedStatus} ></Buttons>}
            {FormState === "colouring" && <Colouring goNext={goToSynthesis} goBack={goToButtons}></Colouring>}
            {FormState === "synthesis" && <SpeechSynthesis goNext={goToSaving} goBack={goToColouring} changedStatus={changedStatus} TTSVoices={TTSVoices}></SpeechSynthesis>}
            {/* {FormState === "segmeting" && <Segmenting goNext={goToColouring} goBack={goToButtons}></Segmenting>} */}
            {/* {FormState === "colouring" && <Colouring goNext={goToSaving} goBack={goToColouring}></Colouring>} */}
            {FormState === "saving" && <Saving goBack={goToSynthesis}></Saving>}
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

    function goToSynthesis() {
        setFormState("synthesis");
    }
}

// export function getFullTranslation(segments: Array<Segment>) {
//     let result = "";

//     for (let k = 0; k < segments.length; ++k) {
//         result += segments[k].sentence + " ";
//     }

//     return result.trim();
// }

export function getFullSentence(segments: Array<Segment>) {
    let result = "";

    for (let k = 0; k < segments.length; ++k) {
        result += segments[k].sentence + " ";
    }

    return result.trim();
}