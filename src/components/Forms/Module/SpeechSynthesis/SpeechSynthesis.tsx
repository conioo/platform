import { Field, useFormikContext } from 'formik';
import { FormikValuesType } from '../ModuleFormik/ModuleFormik';
import './SpeechSynthesis.scss';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useMemo, useState } from 'react';
import Voice from '../../../../types/TTSVoice';
import Form from 'react-bootstrap/esm/Form';
import { synthesizeText } from '../../../../google/GoogleDriveAuthorizeService';
import { getFullSentence } from '../ModuleForm/ModuleForm';
import Spinner from 'react-bootstrap/esm/Spinner';
import Table from 'react-bootstrap/Table';
import Module from '../../../../models/Module';
import Section from '../../../../models/Section';
import Badge from 'react-bootstrap/esm/Badge';
//import Module from 'module';

interface SpeechSynthesisProps {
    goNext: () => void;
    goBack: () => void;
    changedStatus: Array<[boolean, number]>;
    TTSVoices: Array<Voice>
}

export default function SpeechSynthesis({ goNext, goBack, changedStatus, TTSVoices }: SpeechSynthesisProps) {
    console.log("SpeechSynthesis");

    const { values, setFieldValue, initialValues } = useFormikContext<FormikValuesType>();
    const [charCount, setCharCount] = useState(getCharCount(values.module));

    const [isSynthesis, setIsSynthesis] = useState(false);

    //console.log(TTSVoices);

    useEffect(() => {
        //for old modules
        if (!values.module.synthVoiceCode || !values.module.synthVoiceName) {
            setFieldValue(`module.synthVoiceName`, "en-GB-Standard-B");
            setFieldValue(`module.synthVoiceCode`, "en-GB");
        }
    }, []);

    const LanguageCodeOptions = useMemo(() => {

        let languageCodes = new Set<string>();

        for (let i = 0; i < TTSVoices.length; ++i) {
            for (let k = 0; k < TTSVoices[k].languageCodes.length; ++k) {
                languageCodes.add(TTSVoices[i].languageCodes[k])
            }
        }

        let languageCodeOptions = Array.from(languageCodes).map((languageCode, index) => {
            return <option value={languageCode} key={index}>{languageCode}</option>
        });

        return languageCodeOptions;

    }, [TTSVoices]);

    const LanguageVoiceOptions = useMemo(() => {

        return TTSVoices.filter((voice) => {
            return voice.languageCodes.includes(values.module.synthVoiceCode)
        }).map((voice, index) => {
            return <option value={voice.name} key={index}>{voice.name + " (" + voice.ssmlGender + ")"}</option>
        });

    }, [values.module.synthVoiceCode]);

    // Standard voices
    // 0 to 4 million characters

    // WaveNet voices
    // 0 to 1 million characters

    // Neural2 voices
    // 0 to 1 million bytes

    // Polyglot (Preview) voices
    // 0 to 100 thousand bytes

    // Journey (Preview) voices
    // 0 to 1 million bytes

    // Studio voices
    //0 to 100 thousand bytes

    //domyslne --
    //inne jezyki <>
    //juz wybrany, ustaw domyślne --

    return (
        <>
            <h2>Generowanie Audio</h2>

            <Form.Group className={`synthesis__voices-code voice-select-view`}>
                <Form.Label>Wybierz Rodzaj Głosów</Form.Label>
                <Field name="module.synthVoiceCode" as="select" className="form-select voice-select-view__field">
                    {LanguageCodeOptions}
                </Field>
            </Form.Group>

            <Form.Group className={`synthesis__voices-name voice-select-view`}>
                <Form.Label>Wybierz Głos</Form.Label>
                <Field name="module.synthVoiceName" as="select" className="form-select voice-select-view__field">
                    {LanguageVoiceOptions}
                </Field>
            </Form.Group>

            <ButtonGroup className='synthesis__voices-default'>
                <Button type='button' variant='outline-secondary' onClick={() => { setInitialVoices(); }}>Ustaw Domyślne Głosy</Button>
            </ButtonGroup>


            <Badge bg="secondary" className='synthesis__chars'>Znaki: {charCount}</Badge>

            {!isSynthesis &&
                <ButtonGroup className='synthesis__voices-generate'>
                    <Button type='button' variant='outline-danger' onClick={() => { setIsSynthesis(true); generateAudio(); }}>Wygeneruj Audio(Możliwe Opłaty)</Button>
                </ButtonGroup>
            }

            {isSynthesis &&
                <ButtonGroup className='synthesis__voices-generate'>
                    <Button type='button' variant='outline-danger' disabled={true}>
                        <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                            <span className="visually-hidden">Generowanie...</span>
                        </Spinner>
                        Generowanie...
                    </Button>
                </ButtonGroup>
            }

            <Table striped hover bordered className='synthesis__info-table'>

                <tr>
                    <th>Standard voices</th>
                    <th>0 to 4 million characters</th>
                </tr>
                <tr>
                    <th>WaveNet voices</th>
                    <th>0 to 1 million characters</th>
                </tr>
                <tr>
                    <th>Neural2 voices</th>
                    <th>0 to 1 million bytes</th>
                </tr>
                <tr>
                    <th>Polyglot (Previev) voices</th>
                    <th>0 to 100 thousand bytes</th>
                </tr>
                <tr>
                    <th>Journey (Previev)</th>
                    <th>0 to 1 milion bytes</th>
                </tr>
                <tr>
                    <th>Studio voices</th>
                    <th>0 to 100 thousand bytes</th>
                </tr>
            </Table>

            <ButtonGroup className='synthesis__buttons'>
                <Button type='button' variant='outline-secondary' onClick={() => { goBack(); }}>Wstecz</Button>
                <Button type='button' variant='outline-secondary' onClick={() => { goNext(); }}>Dalej</Button>
            </ButtonGroup>
        </>
    );

    function setInitialVoices() {

        if (!initialValues.module.synthVoiceCode || !initialValues.module.synthVoiceName) {
            setFieldValue(`module.synthVoiceName`, "en-GB-Standard-B");
            setFieldValue(`module.synthVoiceCode`, "en-GB");
            return;
        }

        setFieldValue(`module.synthVoiceName`, initialValues.module.synthVoiceName);
        setFieldValue(`module.synthVoiceCode`, initialValues.module.synthVoiceCode);
    }

    async function generateAudio() {
        for (let i = 0; i < values.module.sections.length; ++i) {

            //generate voice only for modified or old without synths or not has voice
            if (changedStatus[i][0] || !values.module.sections[i].synths || ( values.module.sections[i].synths[0].length < 1)) { //tutaj zera nie ma i blad
                let fullSectionSentence = getFullSentence(values.module.sections[i].segments);

                var synthesizeAudioInBase64 = await synthesizeText(fullSectionSentence, values.module.synthVoiceCode, values.module.synthVoiceName);

                //console.log(i, synthesizeAudioInBase64);

                setFieldValue(`module.sections[${i}].synths`, [synthesizeAudioInBase64]);
            }
        }

        goNext();
    }

    function getCharCount(module: Module) {
        let result = 0;

        for (let i = 0; i < module.sections.length; ++i) {
            for (let k = 0; k < module.sections[i].segments.length; ++k) {
                result += module.sections[i].segments[k].sentence.length + 1;
            }

        }
        return result;
    }
}