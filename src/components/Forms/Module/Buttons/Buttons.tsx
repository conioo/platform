import { useFormikContext } from 'formik';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import sanitizeHtml from "sanitize-html";
import Section from '../../../../models/Section';
import Segment from '../../../../models/Segment';
import { FormikValuesType } from '../ModuleFormik/ModuleFormik';
import './Buttons.scss';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Button from 'react-bootstrap/esm/Button';
import { useMemo } from 'react';
import { synthesizeText } from '../../../../google/GoogleDriveAuthorizeService';
import { Updater } from 'use-immer';

interface ButtonsProps {
    goNext: () => void;
    goBack: () => void;
    setChangedStatus: Updater<Array<[boolean, number]>>;
    changedStatus: Array<[boolean, number]>;
}

export default function Buttons({ goNext, goBack, changedStatus, setChangedStatus }: ButtonsProps) {
    console.log("Buttons");

    // useEffect(() => {
    //     for (let i = 0; i < module.segments.length; ++i) {
    //         onTranslationChanged(sanitizeHtml(module.segments[i].translation, sanitizeConf), i);
    //     }
    // }, []);

    const { values, setFieldValue, initialValues } = useFormikContext<FormikValuesType>();

    const sections = useMemo(() => {
        return values.module.sections.map((section: Section, sectionIndex: number) => {

            //changedStatus[sectionIndex][0]

            const segments = section.segments.map((segment: Segment, segmentIndex: number) => {
                return (
                    <section className={`buttons__segment ${changedStatus[sectionIndex][0] ? 'buttons__modified' : ''}`}>
                        <ContentEditable html={segment.sentence} onChange={(event: ContentEditableEvent) => handleSentenceSegmentChanged(event.currentTarget.innerHTML, sectionIndex, segmentIndex)} className='buttons__editable'></ContentEditable>
                        <ContentEditable html={segment.translation} onChange={(event: ContentEditableEvent) => handleTranslationSegmentChanged(event.currentTarget.innerHTML, sectionIndex, segmentIndex)} className='buttons__editable'></ContentEditable>
                    </section>
                );
            });

            return (
                <section className='buttons__section'>
                    {segments}
                </section>
            );
        });
    }, [changedStatus]);

    return (
        <>
            <h2>Zmienianie</h2>

            <section className='buttons__sections'>
                {sections}
            </section>

            <ButtonGroup className='buttons__buttons'>
                <Button type='button' variant='outline-secondary' onClick={() => { goBack(); }}>Wstecz</Button>
                <Button type='button' variant='outline-secondary' onClick={() => { goNext(); }}>Dalej</Button>
            </ButtonGroup>
        </>
    );


    function handleSentenceSegmentChanged(innerHTML: string, sectionIndex: number, segmentIndex: number) {

        let newValue = sanitizeHtml(innerHTML).trim();
        let newLength = newValue.split(" ").length;

        if (changedStatus[sectionIndex][1] !== -1) {
            //has reference to original

            //let initialTranslation = getFullTranslation(initialValues.module.sections[changedStatus[sectionIndex][1]].segments);
            let initialSentence = initialValues.module.sections[changedStatus[sectionIndex][1]].segments[segmentIndex].sentence;

            if (newValue !== initialSentence) {
                //changed
                setChangedStatus((draft) => {
                    draft[sectionIndex][0] = true;
                });
            } else {
                //not changed
                setChangedStatus((draft) => {
                    draft[sectionIndex][0] = false;
                });
            }
        }

        if (newLength !== values.module.sections[sectionIndex].segments[segmentIndex].sentenceColors.length) {
            let newColors = new Array<number>(newLength).fill(values.module.sections[sectionIndex].segments[segmentIndex].sentenceColors[0]);
            setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].sentenceColors`, newColors);
        }

        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].sentence`, newValue);
    }

    function handleTranslationSegmentChanged(innerHTML: string, sectionIndex: number, segmentIndex: number) {

        let newValue = sanitizeHtml(innerHTML).trim();
        let newLength = newValue.split(" ").length;

        if (newLength !== values.module.sections[sectionIndex].segments[segmentIndex].translationColors.length) {
            let newColors = new Array<number>(newLength).fill(values.module.sections[sectionIndex].segments[segmentIndex].translationColors[0]);
            setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].translationColors`, newColors);
        }

        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].translation`, newValue);
    }

    function generateContentFromModule() {
        let newContent = "";

        for (const section of values.module.sections) {
            for (const segment of section.segments) {
                newContent += segment.sentence;
            }

            newContent += "\n";
        }

        newContent = newContent.trim();

        setFieldValue(`content`, newContent);
    }
}