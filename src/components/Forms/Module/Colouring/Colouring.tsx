import { useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import Section from '../../../../models/Section';
import Segment from '../../../../models/Segment';
import { Colors } from '../../../../types/Colors';
import { FormikValuesType } from '../ModuleFormik/ModuleFormik';
import './Colouring.scss';
import Button from 'react-bootstrap/esm/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import SpanElement from '../../../../containers/View/Views/Common/SpanElement';

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

    //memo
    const sections = values.module.sections.map((section: Section, sectionIndex: number) => {

        const segments = section.segments.map((segment: Segment, segmentIndex: number) => {

            const wordSentencePiecies = segment.sentence.split(" ");

            const sentenceElements = wordSentencePiecies.map((word: string, wordIndex: number) => {
                return (
                    <SpanElement className='colouring__word' content={word} colorId={segment.sentenceColors[wordIndex]} onClick={() => { onSentenceColorChanged(sectionIndex, segmentIndex, wordIndex) }}></SpanElement>
                );
            });

            const wordMeaningPiecies = segment.translation.split(" ");

            const translationElements = wordMeaningPiecies.map((word: string, wordIndex: number) => {
                return (
                    <SpanElement className='colouring__word' content={word} colorId={segment.translationColors[wordIndex]} onClick={() => { onTranslationColorChanged(sectionIndex, segmentIndex, wordIndex) }}></SpanElement>
                );
            });

            return ({
                sentenceElements,
                translationElements
            });
        });

        let sentences = new Array<JSX.Element>();
        let translations = new Array<JSX.Element>();

        for (const { sentenceElements, translationElements } of segments) {
            sentences.push(...sentenceElements);
            translations.push(...translationElements);
        }

        return (
            <>
                <span key={sectionIndex + "s"} className='colouring__sentences'>
                    {sentences}
                </span>
                <span key={sectionIndex + "m"} className='colouring__translations'>
                    {translations}
                </span>
            </>
        );
    });

    const colors = Colors.map((colorName: string, index: number) => {
        return (
            <Button type='button' key={index} style={{ backgroundColor: colorName }} className={`colouring__color-button ${(currentColorIndex === index ? "colouring__color-button--selected" : null)}`} onClick={() => setCurrentColorIndex(index)}>
            </Button>
        )
    });

    return (
        <>
            <h2>Kolorowanie</h2>

            <section className='colouring__colors'>
                {colors}
            </section>

            <section className='colouring__sections'>
                {sections}
            </section>

            <ButtonGroup className='colouring__button-group'>
                <Button type='button' variant='outline-secondary' onClick={() => { generateContentFromModule(); goBack(); }}>Wstecz</Button>
                <Button type='button' variant='outline-secondary' onClick={() => { goNext(); }}>Dalej</Button>
            </ButtonGroup>
        </>
    );

    function generateSegments() {
        for (let section of values.module.sections) {

            for (let i = 0; i < section.segments.length; ++i) {

                let translationColorIndex = 0;

                for (let j = 0; j < section.segments[i].sentenceColors.length; ++j) {

                    let color = section.segments[i].sentenceColors[j];

                    if (color !== section.segments[i].translationColors[translationColorIndex]) {
                        //błąd
                    }

                    translationColorIndex = section.segments[i].translationColors.findIndex(currentColor => currentColor !== color);

                    //nowe indeksy

                }

                //1
                //2

                //podzielic
                //
            }
        }
    }

    function generateContentFromModule() {
        let newContent = "";

        for (const section of values.module.sections) {
            for (const segment of section.segments) {
                newContent += segment.sentence;
            }

            newContent += "\n";
        }

        newContent = newContent.slice(0, -1);

        setFieldValue(`content`, newContent);
    }

    function onSentenceColorChanged(sectionIndex: number, segmentIndex: number, wordIndex: number) {
        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].sentenceColors[${wordIndex}]`, currentColorIndex);
    }

    function onTranslationColorChanged(sectionIndex: number, segmentIndex: number, wordIndex: number) {
        setFieldValue(`module.sections[${sectionIndex}].segments[${segmentIndex}].translationColors[${wordIndex}]`, currentColorIndex);
    }
}