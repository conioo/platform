import { Field, useFormikContext } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';
import { useSelector } from 'react-redux';
import Module from '../../../../models/Module';
import Section from '../../../../models/Section';
import Segment from '../../../../models/Segment';
import { selectDeeplToken } from '../../../../redux/slices/authentication';
import { selectLanguage } from '../../../../redux/slices/language';
import { TranslateSentences } from '../../../../services/TranslatorService';
import TargetLanguage, { getTargetLanguageName } from '../../../../types/TargetLanguage';
import { FormikValuesType } from '../ModuleFormik/ModuleFormik';
import './Content.scss';
import { useMemo, useState } from 'react';
import { Updater } from 'use-immer';

interface ContentProps {
    goNext: () => void;
    setChangedStatus: Updater<Array<[boolean, number]>>;
}

export default function Content({ goNext, setChangedStatus }: ContentProps) {

    const { values, setFieldValue, initialValues } = useFormikContext<FormikValuesType>();
    const [changed, setChanged] = useState(false);

    const language = useSelector(selectLanguage);
    const deeplToken = useSelector(selectDeeplToken);

    const targetLanguageOptions = useMemo(() => {
        return Object.values(TargetLanguage).map((language: TargetLanguage, index: number) => {
            //const keyOfValue = Object.values(TargetLanguage).indexOf(language);
            // const keyName = Object.keys(TargetLanguage)[keyOfValue];
            const name = getTargetLanguageName(language);

            return (<option value={language} key={index}>{name}</option>);
        });
    }, []);

    //console.log(changed);

    return (<>
        <h2>Tworzenie</h2>

        <Form.Group className=' content__target-language-group' onChange={() => setChanged(true)}>
            <Form.Label>Język docelowy</Form.Label>
            <Field name="module.targetLanguage" as="select" className="form-select content__target-language">
                {targetLanguageOptions}
            </Field>
        </Form.Group>

        <Form.Group className='content__content-group'>
            <Form.Label></Form.Label>
            <Field as="textarea" name="content" id="record-textarea" className="form-control content__content"></Field>
        </Form.Group>

        <Stack direction='horizontal' gap={2} className='content__buttons-stack'>
            <Button type="button" variant='outline-secondary' onClick={() => { goNextWithGenerating(); }} >Wygeneruj Kafelki</Button>
            <Button type="button" variant='outline-secondary' onClick={() => { SeparateDots(); }} >Oddziel kropki</Button>
        </Stack>

        <Button type="button" className='separate-dots-button' variant='outline-secondary' onClick={() => { goNext(); }} disabled={values.module.sections.length === 0}>Dalej</Button>
    </>);

    async function goNextWithGenerating() {

        if (values.content.length === 0) {
            alert("pole nie może być puste");
            return;
        }

        await generateModuleFromContent();
        goNext();
    }

    function SeparateDots() {
        //separate dots
        let regex = new RegExp('[.]\\s+', 'g');
        let regexQuestion = new RegExp('[?]\\s+', 'g');

        let textsArray = values.content.split(regex);

        let newContent = "";

        for (let i = 0; i < textsArray.length; ++i) {
            newContent += textsArray[i] + ".\n";
        }

        if (newContent) {
            newContent = newContent.slice(0, -2);
        }

        //separate question mark

        textsArray = newContent.split(regexQuestion);

        newContent = "";

        for (let i = 0; i < textsArray.length; ++i) {
            newContent += textsArray[i] + "?\n";
        }

        if (newContent) {
            newContent = newContent.slice(0, -2);
        }

        //remowe last white signs
        let l = new RegExp('\\s');

        while (newContent.length > 0 && l.test(newContent[newContent.length - 1])) {
            newContent = newContent.slice(0, -1);
        }

        setFieldValue("content", newContent);
    }

    async function generateModuleFromContent() {
        let content = values.content;
        let whiteRegex = new RegExp('\\s');

        //remove last white signs
        while (content.length > 0 && whiteRegex.test(content[-1])) {
            content = content.slice(0, -1);
        }

        let newSections = content.split('\n');

        //remove empty sections and trim white spaces
        //calculate new sections
        newSections = newSections
            .map(str => str.trim())
            .filter(str => str !== "");

        let newChangedStatus = new Array<[boolean, number]>(newSections.length);

        //calculate old sections
        let oldSentences = new Map<string, number>();

        for (let i = 0; i < initialValues.module.sections.length; ++i) {
            let sentence = "";

            for (let k = 0; k < initialValues.module.sections[i].segments.length; ++k) {
                sentence += initialValues.module.sections[i].segments[k].sentence + " ";
            }

            sentence = sentence.trim();


            oldSentences.set(sentence, i)
        }

        //create new(updated) module
        let newModule = new Module();

        newModule.language = values.module.language;
        newModule.targetLanguage = values.module.targetLanguage;
        newModule.name = initialValues.module.name;
        newModule.voiceName = initialValues.module.voiceName;
        newModule.sections = new Array<Section>(newSections.length);

        let sentencesToTranslation = new Array<string>();
        let indexSentencesToTranslation = new Array<number>();

        //console.log(oldSentences);

        for (let i = 0; i < newSections.length; ++i) {
            let index = oldSentences.get(newSections[i]);
            //console.log(newSections[i]);

            if (index === undefined) {
                //new sentence
                sentencesToTranslation.push(newSections[i]);
                indexSentencesToTranslation.push(i);

                newChangedStatus[i] = [true, -1];
            }
            else {
                //old sentence
                newModule.sections[i] = { ...initialValues.module.sections[index] };

                newChangedStatus[i] = [false, index];
            }
        }

        //translate new sentences
        if (sentencesToTranslation.length > 0) {
            const targetLanguage = values.module.targetLanguage;

            const translations = await TranslateSentences(sentencesToTranslation, language, targetLanguage, deeplToken);

            for (let i = 0; i < indexSentencesToTranslation.length; ++i) {
                newModule.sections[indexSentencesToTranslation[i]] = new Section([new Segment(sentencesToTranslation[i], translations[i])]);
            }
        }

        setChangedStatus(newChangedStatus);

        setFieldValue("module", newModule);
    }
}