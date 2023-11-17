import { useFormikContext } from 'formik';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ReactSortable } from "react-sortablejs";
import Section from '../../../../models/Section';
import Segment from '../../../../models/Segment';
import { FormikValuesType } from '../ModuleFormik';
import SortableSection from '../SortableSection';
import './Segmenting.scss';
import Button from 'react-bootstrap/esm/Button';

interface SegmentingProps {
    goBack: () => void;
    goNext: () => void;
}

export interface BaseSortableType {
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

    const [separatorIdCounter, setSeparatorIdCounter] = useState(0);

    const { values, setFieldValue } = useFormikContext<FormikValuesType>();
    const [sections, setSections] = useState<Array<SortableSegment>>(initSegments);
    const [separators, setSeparators] = useState<Array<SeparatorType>>(initSeparators);

    // console.log(separatorIdCounter);
    console.log(sections);
    // console.log(separators);

    function initSeparators(): Array<SeparatorType> {
        let separators = new Array<SeparatorType>();

        separators.push({ id: `${separatorIdCounter}` });
        // let startId = separatorIdCounter;

        // for (; startId < 1; ++startId) {
        //     separators.push({ id: `${startId}` });
        // }

        // setSeparatorIdCounter(startId);
        return separators;
    }

    function initSegments(): Array<SortableSegment> {
        const sections = values.module.sections.map((section: Section, sectionIndex: number) => {

            let sortableSentences = new Array<BaseSortableType>();
            let sortableTranslations = new Array<BaseSortableType>();

            let sentenceCounter = 0;
            let translationCounter = 0;

            section.segments.map((segment: Segment, SegmentIndex: number) => {

                const wordSentencePiecies = segment.sentence.split(" ");

                wordSentencePiecies.map((word: string, WordIndex: number) => {
                    const wordType: WordType = { id: getSentenceId(sectionIndex, sentenceCounter), word };
                    ++sentenceCounter;
                    sortableSentences.push(wordType);
                });

                const wordMeaningPiecies = segment.translation.split(" ");

                wordMeaningPiecies.map((word: string, WordIndex: number) => {
                    const wordType: WordType = { id: getTranslationId(sectionIndex, translationCounter), word };
                    translationCounter++;
                    sortableTranslations.push(wordType);
                });

                const sentenceSeparator: SeparatorType = { id: getSentenceId(sectionIndex, sentenceCounter) };
                const translationSeparator: SeparatorType = { id: getTranslationId(sectionIndex, translationCounter) };

                ++sentenceCounter;
                ++translationCounter;

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

    const sortableSections = sections.map((sortableSegment: SortableSegment, sectionIndex: number) => {
        return (<>
            <Row className='segmenting__sortable-row'>
                <ReactSortable
                    className='segmenting__sortable'
                    direction='horizontal'
                    group={{ name: 'sentence', put: ['separator'] }}
                    list={sortableSegment.sentences}
                    setList={(newState) => setSentenceSection(newState, sectionIndex)}
                    filter={".disabled"}
                    animation={100}
                    onAdd={(event) => {
                        addSeparator(sectionIndex, "translations", event.newIndex);
                    }}>
                    <SortableSection segments={sortableSegment.sentences} onDoubleClick={(id: string) => removeSeparator(id, "sentences", sectionIndex)}></SortableSection>
                    {/* onDoubleClick={(index: number) => removeSeparator(index, "sentences", index)} */}

                </ReactSortable>
                <ReactSortable
                    className='segmenting__sortable'
                    direction='horizontal'
                    group={{ name: 'translation', put: ['separator'] }}
                    list={sortableSegment.translations}
                    setList={(newState) => setTranslationSection(newState, sectionIndex)}
                    filter={".disabled"}
                    animation={100}
                    onAdd={(event) => {
                        addSeparator(sectionIndex, "sentences", event.newIndex);
                    }}>
                    <SortableSection segments={sortableSegment.translations} onDoubleClick={(id: string) => removeSeparator(id, "translations", sectionIndex)}></SortableSection>
                </ReactSortable>
            </Row >
        </>);
    });

    const separatorSection = (<ReactSortable
        className='segmenting__sortable'
        group={{ name: 'separator', pull: 'clone' }}
        list={separators}
        setList={setSeparators}
        filter={".disabled"}
        sort={false}
        clone={getSeparator}
        animation={150}>
        <SortableSection segments={separators} onDoubleClick={() => null}></SortableSection>
    </ReactSortable >)

    return (
        <>
            <h1>Segmentowanie</h1>

            <Container fluid>
                {sortableSections}
            </Container>

            {separatorSection}

            <Button className='addSeparatorsEverywhere'>Dodaj Separatory</Button>

            <section>
                <button onClick={() => goBack()} className='change-segments-button'>Wstecz</button>
                <button onClick={() => { generateModule(); goNext(); }} className='change-segments-button'>Dalej</button>
            </section>
        </>
    );

    function addSeparatorsEverywhere()
    {

    }

    function removeSeparator(id: string, sequenceName: string, sectionIndex: number) {
        let newSections = sections.slice();

        let separatorCount = 0;

        if (sequenceName === "sentences") {
            for (let i = 0; i < sections[sectionIndex].sentences.length; ++i) {
                if (!sections[sectionIndex].sentences[i].word) {
                    if (sections[sectionIndex].sentences[i].id === id) {
                        newSections[sectionIndex].sentences.splice(i, 1);
                        break;
                    }
                    ++separatorCount;
                }
            }

            for (let i = 0; i < sections[sectionIndex].translations.length; ++i) {
                if (!sections[sectionIndex].translations[i].word) {

                    if (separatorCount === 0) {
                        newSections[sectionIndex].translations.splice(i, 1);
                    }
                    --separatorCount;
                }
            }
        } else if (sequenceName === "translations") {
            for (let i = 0; i < sections[sectionIndex].translations.length; ++i) {
                if (!sections[sectionIndex].translations[i].word) {
                    if (sections[sectionIndex].translations[i].id === id) {
                        newSections[sectionIndex].translations.splice(i, 1);
                        break;
                    }
                    ++separatorCount;
                }
            }

            for (let i = 0; i < sections[sectionIndex].sentences.length; ++i) {
                if (!sections[sectionIndex].sentences[i].word) {

                    if (separatorCount === 0) {
                        newSections[sectionIndex].sentences.splice(i, 1);
                    }
                    --separatorCount;
                }
            }
        }

        setSections(newSections);
    }

    function addSeparator(sectionIndex: number, sequenceName: string, targetIndex?: number) {
        let newSections = sections.slice();

        targetIndex = targetIndex ?? 0;

        if (sequenceName === "sentences") {
            newSections[sectionIndex].sentences.splice(targetIndex, 0, { id: `${separatorIdCounter}` });
        } else if (sequenceName === "translations") {
            newSections[sectionIndex].translations.splice(targetIndex, 0, { id: `${separatorIdCounter}` });
        }

        setSections(newSections);
    }

    function getSeparator() {
        let newSeparator = { id: `${separatorIdCounter + 1}` }
        setSeparatorIdCounter(separatorIdCounter + 1);
        return (newSeparator);
    }

    function generateModule() {

        const newSections = sections.map((section: SortableSegment, sectionIndex: number) => {
            let sentenceColors = new Array<number>();
            let translationColors = new Array<number>();

            for (let i = 0; i < values.module.sections[sectionIndex].segments.length; ++i) {

                sentenceColors.push(values.module.sections[sectionIndex].segments[i].sentenceColors);
                translationColors.push(values.module.sections[sectionIndex].segments[i].translationColors);
            }

            let newSection = new Section();

            let currentSentence = "";
            let sentenceWordsAmount = 0;
            let sentenceColorsStartIndex = 0;

            let currentTranslation = "";
            let translationWordsAmount = 0;
            let translationColorsStartIndex = 0;

            for (let k = 0; k < section.sentences.length; ++k) {

                if (section.sentences[k]["word"]) {
                    currentSentence += section.sentences[k].word + " ";
                    ++sentenceWordsAmount;
                } else {

                    currentSentence = currentSentence.slice(0, -1);

                    let newSegment = new Segment(currentSentence, "");
                    let newStartIndex = sentenceColorsStartIndex + sentenceWordsAmount;

                    newSegment.sentenceColors = sentenceColors.slice(sentenceColorsStartIndex, newStartIndex);
                    sentenceColorsStartIndex = newStartIndex;

                    newSection.segments.push(newSegment);

                    sentenceWordsAmount = 0;
                    currentSentence = "";
                }
            }

            currentSentence = currentSentence.slice(0, -1);
            let newSegment = new Segment(currentSentence, "");

            newSegment.sentenceColors = sentenceColors.slice(sentenceColorsStartIndex);
            newSection.segments.push(newSegment);

            let translationIndex = 0;

            for (let k = 0; k < section.translations.length; ++k) {

                if (section.translations[k]["word"]) {
                    currentTranslation += section.translations[k].word + " ";
                    ++translationWordsAmount;
                } else {
                    currentTranslation = currentTranslation.slice(0, -1);
                    newSection.segments[translationIndex].translation = currentTranslation;

                    let newStartIndex = translationColorsStartIndex + translationWordsAmount;

                    newSection.segments[translationIndex].translationColors = translationColors.slice(translationColorsStartIndex, newStartIndex);

                    translationColorsStartIndex = newStartIndex;

                    translationWordsAmount = 0;
                    currentTranslation = "";

                    ++translationIndex;
                }
            }

            currentTranslation = currentTranslation.slice(0, -1);

            newSection.segments[translationIndex].translation = currentTranslation;
            newSection.segments[translationIndex].translationColors = translationColors.slice(translationColorsStartIndex);

            return newSection;
        });

        setFieldValue("module.sections", newSections);
    }

    function getSentenceId(sectionIndex: number, counter: number) {
        return (`s ${sectionIndex} ${counter}`);
    }

    function getTranslationId(sectionIndex: number, counter: number) {
        return (`t ${sectionIndex} ${counter}`);
    }

    function setSentenceSection(newState: Array<BaseSortableType>, indexSection: number) {
        let newSections = sections.slice();
        newSections[indexSection].sentences = newState;

        setSections(newSections);
        // updateSections(sections =>{sections[indexSection].sentences = newState});
    }

    function setTranslationSection(newState: Array<BaseSortableType>, indexSection: number) {
        let newSections = sections.slice();
        newSections[indexSection].translations = newState;

        setSections(newSections);
    }
}