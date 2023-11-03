import { useFormikContext } from 'formik';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import sanitizeHtml from "sanitize-html";
import Section from '../../../models/Section';
import Segment from '../../../models/Segment';
import { FormikValuesType } from './ModuleFormik';
import './css/Buttons.css';

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

    function handleSentenceSegmentChanged(innerHTML: string, sectionIndex: number, segmentIndex: number) {
        let newValue = sanitizeHtml(innerHTML);

        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].sentence`, newValue);
    }

    function handleTranslationSegmentChanged(innerHTML: string, sectionIndex: number, segmentIndex: number) {
        let newValue = sanitizeHtml(innerHTML);

        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].translation`, newValue);
    }

    const sections = values.module.sections.map((section: Section, sectionIndex: number) => {

        const segments = section.segments.map((segment: Segment, segmentIndex: number) => {

            const sentenceSegment = (
                <ContentEditable html={segment.sentence} onChange={(event: ContentEditableEvent) => handleSentenceSegmentChanged(event.currentTarget.innerHTML, sectionIndex, segmentIndex)} className='span-segment'></ContentEditable>
            );

            const meaningSegment = (
                <ContentEditable html={segment.translation} onChange={(event: ContentEditableEvent) => handleTranslationSegmentChanged(event.currentTarget.innerHTML, sectionIndex, segmentIndex)} className='span-segment'></ContentEditable>
            );

            return ({
                sentenceSegment,
                meaningSegment
            });
        });

        let sentenceSegments = new Array<JSX.Element>();
        let meaningSegments = new Array<JSX.Element>();

        for (const { sentenceSegment, meaningSegment } of segments) {
            sentenceSegments.push(sentenceSegment);
            meaningSegments.push(meaningSegment);
        }

        return (
            <>
                <section>
                    {sentenceSegments}
                </section>
                <section>
                    {meaningSegments}
                </section>
                <div className='segments-separator'></div>
            </>
        );
    });

    return (
        <>
            <h1>Zmienianie</h1>
            
            <section className='segments'>
                {sections}
            </section>
            <section>
                <button type='button' onClick={() => { goBack(); }} className='change-segments-button'>Wstecz</button>
                <button type='button' onClick={() => { goNext(); }} className='change-segments-button'>Dalej</button>
            </section>
        </>
    );

    // function GoToColouring() {
    //     if (module.segments.length === 0) {
    //         alert("nie wprowadzono danych");
    //         return;
    //     }
    //     goToColouring();
    // }
}