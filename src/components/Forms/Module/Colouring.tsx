import { useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import Section from '../../../models/Section';
import Segment from '../../../models/Segment';
import { Colors } from '../../../types/Colors';
import { FormikValuesType } from './ModuleFormik';
import './css/Colouring.css';

interface ColouringProps {
    goNext: () => void;
    goBack: () => void;
}

export default function Colouring({ goNext, goBack }: ColouringProps) {
    console.log("Colouring");

    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const { values, setFieldValue } = useFormikContext<FormikValuesType>();

    const handleKeyDown = useCallback((event: KeyboardEvent) => {

        switch (event.key) {
            case "z": { setCurrentColorIndex(0); break; }
            case "x": { setCurrentColorIndex(1); break; }
            case "c": { setCurrentColorIndex(2); break; }
            case "v": { setCurrentColorIndex(3); break; }
            case "b": { setCurrentColorIndex(4); break; }
            case "n": { setCurrentColorIndex(5); break; }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);


    const sections = values.module.sections.map((section: Section, sectionIndex: number) => {

        const segments = section.segments.map((segment: Segment, segmentIndex: number) => {

            const wordSentencePiecies = segment.sentence.split(" ");

            const segmentSentenceWords = wordSentencePiecies.map((word: string, wordIndex: number) => {
                return (
                    <span key={wordIndex + "s"} className={`part-segment ${getAppropriateColorClassName(segment.sentenceColors[wordIndex])}`} onClick={() => { onSentenceColorChanged(sectionIndex, segmentIndex, wordIndex) }}>{word + " "}</span>
                );
            });

            const wordMeaningPiecies = segment.translation.split(" ");

            const segmentMeaningsWords = wordMeaningPiecies.map((word: string, wordIndex: number) => {
                return (
                    <span key={wordIndex + "m"} className={`part-segment ${getAppropriateColorClassName(segment.translationColors[wordIndex])}`} onClick={() => { onTranslationColorChanged(sectionIndex, segmentIndex, wordIndex) }}>{word + " "}</span>
                );
            });

            const sentenceSegment = (<section key={segmentIndex + "s"}>
                {segmentSentenceWords}
            </section>)

            const meaningSegment = (<section key={segmentIndex + "m"}>
                {segmentMeaningsWords}
            </section>)

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
                <span key={sectionIndex + "s"} className='span-segment'>
                    {sentenceSegments}
                </span>
                <span key={sectionIndex + "m"} className='span-segment'>
                    {meaningSegments}
                </span>
                <div className='segments-separator'></div>
            </>
        );
    });

    function getAppropriateColorClassName(colorNumber: number): string {
        return Colors[colorNumber];
    }

    const colors = Colors.map((colorName: string, index: number) => {
        return (
            <button type='button' key={index} style={{ backgroundColor: colorName }} className={`rgb-button ${(currentColorIndex === index ? "selected" : null)}`} onClick={() => setCurrentColorIndex(index)}>
            </button>
        )
    });

    return (
        <>
            <h1>Kolorowanie</h1>

            <section className='colors-section'>
                {colors}
            </section>

            <section className='segments'>
                {sections}
            </section>

            <button onClick={goBack} className='change-segments-button'>Wstecz</button>
            <button onClick={goNext} className='change-segments-button'>Dalej</button>
        </>
    );

    function onSentenceColorChanged(sectionIndex: number, segmentIndex: number, wordIndex: number) {
        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].sentenceColors[${wordIndex}]`, currentColorIndex);
    }

    function onTranslationColorChanged(sectionIndex: number, segmentIndex: number, wordIndex: number) {
        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].translationColors[${wordIndex}]`, currentColorIndex);
    }
}