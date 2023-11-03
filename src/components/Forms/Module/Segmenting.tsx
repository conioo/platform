import { useFormikContext } from 'formik';
import { useState } from 'react';
import { ReactSortable } from "react-sortablejs";
import './css/Buttons.css';
import './css/Colouring.css';
import './css/Segmenting.css';
import Section from '../../../models/Section';
import Segment from '../../../models/Segment';
import { FormikValuesType } from './ModuleFormik';
import * as randomstring from 'randomstring';

interface SegmentingProps {
    goBack: () => void;
    goNext: () => void;
}

interface BaseSortableType {
    id: string;
    word?: string;
}

class WordType implements BaseSortableType {
    id: string = "";
    word: string = "";
}

class SeparatorType implements BaseSortableType {
    id: string = "";
}

interface SortableSegment {
    sentences: Array<BaseSortableType>;
    translations: Array<BaseSortableType>;
}

export default function Segmenting({ goBack, goNext }: SegmentingProps) {
    console.log("Segmenting");

    const { values, setFieldValue } = useFormikContext<FormikValuesType>();
    const [sections, setSections] = useState<Array<SortableSegment>>(initSegments);
    const [separatorDonor, setSeparatorDonor] = useState<Array<SeparatorType>>(initSeparatorDonor);

    function initSeparatorDonor(): Array<SeparatorType> {
        let separators = new Array<SeparatorType>();

        for (let i = 0; i < 10; ++i) {
            separators.push({ id: `s${i}` });
        }
        return separators;
    }

    function initSegments(): Array<SortableSegment> {
        const sections = values.module.sections.map((section: Section, sectionIndex: number) => {

            let sortableSentences = new Array<BaseSortableType>();
            let sortableTranslations = new Array<BaseSortableType>();

            section.segments.map((segment: Segment, SegmentIndex: number) => {

                const wordSentencePiecies = segment.sentence.split(" ");

                wordSentencePiecies.map((word: string, WordIndex: number) => {
                    const wordType: WordType = { id: `${SegmentIndex}${WordIndex}`, word };
                    sortableSentences.push(wordType);
                });

                const wordMeaningPiecies = segment.translation.split(" ");

                wordMeaningPiecies.map((word: string, WordIndex: number) => {
                    const wordType: WordType = { id: `${SegmentIndex}${WordIndex}`, word };
                    sortableTranslations.push(wordType);
                });

                const sentenceSeparator: SeparatorType = { id: `${SegmentIndex}` };
                const translationSeparator: SeparatorType = { id: `${SegmentIndex}` };

                sortableSentences.push(sentenceSeparator);
                sortableTranslations.push(translationSeparator);
            });

            sortableSentences.pop();
            sortableTranslations.pop();

            return ({
                sentences: sortableSentences,
                translations: sortableTranslations,
            });
        });

        return sections;
    }

    console.log(sections);

    const sortableSections = sections.map((sortableSegment: SortableSegment, index: number) => {
        return (<>
            <ReactSortable
                className='sorto'
                direction='horizontal'
                group={{ name: 'shared', put: true, pull: false }}
                list={sortableSegment.sentences}
                setList={(newState) => setSentenceSection(newState, index)}
                ghostClass='blue-background-class'
                filter={".filtered"}
                animation={150}
                onEnd={(evt) => {
                    const { newIndex } = evt;
                    const updatedItems = [...sortableSegment.sentences];

                    // Tworzymy kopię elementu i nadajemy mu nowe unikalne id
                    const newItem: SeparatorType = { id: "randomstring.generate(5)" };

                    // Wstawiamy nowy element na nową pozycję
                    if (newIndex === undefined) {
                        return;
                    }

                    console.log(newItem);
                    updatedItems.splice(newIndex, 0, newItem);
                    console.log("updatedItems");

                    let newSections = sections.slice();
                    newSections[index].sentences = updatedItems;
                    console.log(newSections);

                    setSections(newSections);
                }}
                removeCloneOnHide={false}>
                {sortableSegment.sentences.map((baseSortable) => {
                    if (baseSortable['word']) {
                        return (<span key={baseSortable.id} className={`list-group-item filtered`}>{baseSortable.word + " "}</span>);
                    } else {
                        return (<span key={baseSortable.id} className={`part-segment separator-segment`}></span>);
                    }
                })}
            </ReactSortable>
            <ReactSortable
                className='sorto'
                list={sortableSegment.translations}
                setList={(newState) => setTranslationSection(newState, index)}
                ghostClass='blue-background-class'
                filter={".filtered"}
                animation={150}>
                {sortableSegment.translations.map((baseSortable) => {
                    if (baseSortable['word']) {
                        return (<span key={baseSortable.id} className={`list-group-item filtered`}>{baseSortable.word + " "}</span>);
                    } else {
                        return (<span key={baseSortable.id} className={`part-segment separator-segment`}></span>);
                    }

                })}
            </ReactSortable>
        </>);
    });

    const separators = (<ReactSortable
        className='sorto'
        group={{ name: 'shared', pull: 'clone' }}
        list={separatorDonor}
        setList={setSeparatorDonor}
        ghostClass='blue-background-class'
        filter={".filtered"}
        animation={150}>
        {separatorDonor.map((separator) => {
            return (<span key={separator.id} className={`part-segment separator-segment`}>a</span>);
        })}
    </ReactSortable>)

    return (
        <>
            <h1>Segmentowanie</h1>

            <section className='segments'>
                {sortableSections}
            </section>

            <section className='segments'>
                {separators}
            </section>

            <section>
                <button onClick={() => goBack()} className='change-segments-button'>Wstecz</button>
                <button onClick={() => { generateModule(); goNext(); }} className='change-segments-button'>Dalej</button>
            </section>
        </>
    );

    //tylko gdzie sie zmienilo
    function generateModule() {

        // const newSections = sections.map((section: SortableSegment) => {
        //     let newSection = new Section;

        //     let currentSentence = "";
        //     let sentenceWordsAmount = 0;
        //     let currentTranslation = "";
        //     let translationWordsAmount = 0;
        //     let translationIndex = 0;

        //     for (let k = 0; k < section.sentences.length; ++k) {
        //         if (section.sentences[k]['word']) {
        //             currentSentence += section.sentences[k].word + " ";
        //             ++sentenceWordsAmount;
        //         }
        //         else {
        //             let newSegment = new Segment(currentSentence, "");
        //             newSegment.sentenceColors = new Array<number>(sentenceWordsAmount).fill(0);

        //             newSection.segments.push(newSegment);

        //             sentenceWordsAmount = 0;
        //             currentSentence = "";
        //         }
        //     }

        //     let segment = new Segment(currentSentence, "");
        //     segment.sentenceColors = new Array<number>(sentenceWordsAmount).fill(0);
        //     newSection.segments.push(segment);

        //     for (let k = 0; k < section.translations.length; ++k) {
        //         if (section.translations[k]['word']) {
        //             currentTranslation += section.translations[k].word + " ";
        //             ++translationWordsAmount;
        //         }
        //         else {
        //             newSection.segments[translationIndex++].translation = currentTranslation;
        //             newSection.segments[translationIndex++].translationColors = new Array<number>(translationWordsAmount).fill(0);
        //             translationWordsAmount = 0;

        //             currentTranslation = "";
        //         }
        //     }

        //     newSection.segments[translationIndex].translation = currentTranslation;
        //     newSection.segments[translationIndex].translationColors = new Array<number>(translationWordsAmount).fill(0);

        //     return newSection;
        // });

        // setFieldValue("module.sections", newSections);
    }


    function setSentenceSection(newState: Array<BaseSortableType>, indexSection: number) {
        let newSections = sections.slice();
        newSections[indexSection].sentences = newState;

        setSections(newSections);
    }

    function setTranslationSection(newState: Array<BaseSortableType>, indexSection: number) {
        let newSections = sections.slice();
        newSections[indexSection].translations = newState;

        setSections(newSections);
    }
}

