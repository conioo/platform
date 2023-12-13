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
import classNames from 'classnames';

interface ColouringProps {
    goNext: () => void;
    goBack: () => void;
}

export default function Colouring({ goNext, goBack }: ColouringProps) {
    console.log("Colouring");

    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const { values, setFieldValue } = useFormikContext<FormikValuesType>();

    const [errors, setErrors] = useState(Array<boolean>(values.module.sections.length).fill(false));

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

        let names = classNames('colouring__section', { 'colouring__section--error': errors[sectionIndex] });

        return (
            <section className={names}>
                <span key={sectionIndex + "s"} className='colouring__sentences'>
                    {sentences}
                </span>
                <span key={sectionIndex + "m"} className='colouring__translations'>
                    {translations}
                </span>
            </section>
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
                <Button type='button' variant='outline-secondary' onClick={() => {
                    if (generateSegments()) {
                        goNext();
                    }
                }}>Dalej</Button>
            </ButtonGroup>
        </>
    );

    function generateSegments(): boolean {
        let errors = new Array<boolean>(values.module.sections.length).fill(false);
        let newSections = new Array<Section>();

        let sentenceWords = new Array<string>();
        let translationWords = new Array<string>();

        let sentenceColors = new Array<number>();
        let translationColors = new Array<number>();
        let indexSection = 0;

        for (let section of values.module.sections) {
            sentenceWords = new Array<string>();
            translationWords = new Array<string>();

            sentenceColors = new Array<number>();
            translationColors = new Array<number>();

            for (let segment of section.segments) {
                sentenceWords.push(...segment.sentence.split(" ").filter(word => word !== ""));
                translationWords.push(...segment.translation.split(" ").filter(word => word !== ""));

                sentenceColors.push(...segment.sentenceColors);
                translationColors.push(...segment.translationColors);
            }

            //nowe moga nie dzialaja -> tymczasowe dla nowych
            // console.log(sentenceWords);
            // console.log(sentenceColors);
            if (sentenceWords.length !== sentenceColors.length) {

                if (sentenceColors.length < sentenceWords.length) {
                    for (let i = sentenceColors.length; i < sentenceWords.length; i++) {
                        sentenceColors.push(0);
                    }
                } else if (sentenceColors.length > sentenceWords.length) {
                    sentenceColors = sentenceColors.slice(0, sentenceWords.length);
                }
            }

            if (translationWords.length !== translationColors.length) {

                if (translationColors.length < translationWords.length) {
                    for (let i = translationColors.length; i < translationWords.length; i++) {
                        translationColors.push(0);
                    }
                } else if (translationColors.length > translationWords.length) {
                    translationColors = translationColors.slice(0, translationWords.length);
                }
            }

            let newSection = new Section();

            let sentenceIndex = 0;
            let translationIndex = 0;

            while (sentenceIndex < sentenceWords.length) {
                //kolejny segment, idx 1 elementu

                if (sentenceColors[sentenceIndex] !== translationColors[translationIndex]) {
                    errors[indexSection] = true;
                    break;
                }

                let color = sentenceColors[sentenceIndex];

                let [sentence, nextSentenceIndex] = getNextSentence(sentenceIndex, color);

                sentenceIndex = nextSentenceIndex;

                let [translation, nextTranslationIndex] = getNextTranslation(translationIndex, color);

                translationIndex = nextTranslationIndex;

                let segment = new Segment(sentence, translation, color);

                newSection.segments.push(segment);

                if (sentenceIndex === -1 || translationIndex === -1) {
                    if (sentenceIndex === -1 && translationIndex === -1) {
                        break;
                    } else {
                        errors[indexSection] = true;
                        break;
                    }
                }
            }

            // console.log(newSection);
            // console.log(errors[indexSection]);

            if (errors[indexSection]) {
                ++indexSection;
                continue;
            }

            newSections.push(newSection);
            ++indexSection;
        }

        // console.log(newSections);

        let hasErrors = errors.some((error) => error);

        if (hasErrors) {
            setErrors(errors);
            return false;
        }

        setFieldValue(`module.sections`, newSections);

        return true;

        function getNextSentence(firstIndex: number, currentValue: number): [string, number] {
            let sentence = "";

            for (let i = firstIndex; i < sentenceColors.length; i++) {
                if (sentenceColors[i] !== currentValue) {
                    if (sentence.length > 0) {
                        sentence = sentence.slice(0, -1);
                    }
                    return [sentence, i];
                } else {
                    sentence += sentenceWords[i] += " ";
                }
            }
            if (sentence.length > 0) {
                sentence = sentence.slice(0, -1);
            }

            return [sentence, -1];
        }

        function getNextTranslation(firstIndex: number, currentValue: number): [string, number] {
            let translation = "";

            for (let i = firstIndex; i < translationColors.length; i++) {
                if (translationColors[i] !== currentValue) {
                    if (translation.length > 0) {
                        translation = translation.slice(0, -1);
                    }
                    return [translation, i];
                } else {
                    translation += translationWords[i] += " ";
                }
            }
            if (translation.length > 0) {
                translation = translation.slice(0, -1);
            }

            return [translation, -1];
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