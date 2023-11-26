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

interface ButtonsProps {
    goNext: () => void;
    goBack: () => void;
}

export default function Buttons({ goNext, goBack }: ButtonsProps) {
    console.log("Buttons");

    // useEffect(() => {
    //     for (let i = 0; i < module.segments.length; ++i) {
    //         onTranslationChanged(sanitizeHtml(module.segments[i].translation, sanitizeConf), i);
    //     }
    // }, []);

    const { values, setFieldValue } = useFormikContext<FormikValuesType>();

    const sections = useMemo(() => {
        return values.module.sections.map((section: Section, sectionIndex: number) => {

            const segments = section.segments.map((segment: Segment, segmentIndex: number) => {
                return (
                    <section className='buttons__segment'>
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
    }, []);

    return (
        <>
            <h2>Zmienianie</h2>

            <section className='buttons__sections'>
                {sections}
            </section>

            <ButtonGroup>
                <Button type='button' variant='outline-secondary' onClick={() => { goBack(); }}>Wstecz</Button>
                <Button type='button' variant='outline-secondary' onClick={() => { goNext(); }}>Dalej</Button>
            </ButtonGroup>
        </>
    );

    function handleSentenceSegmentChanged(innerHTML: string, sectionIndex: number, segmentIndex: number) {
        let newValue = sanitizeHtml(innerHTML);

        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].sentence`, newValue);
    }

    function handleTranslationSegmentChanged(innerHTML: string, sectionIndex: number, segmentIndex: number) {
        let newValue = sanitizeHtml(innerHTML);

        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].translation`, newValue);
    }
}