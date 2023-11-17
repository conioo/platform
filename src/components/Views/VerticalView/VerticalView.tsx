import { useMemo, useState } from "react";
import { useImmer } from "use-immer";
import './VerticalView.scss';
import Module from "../../../models/Module";
import { useEasySpeechType } from "../../../hooks/EasySpeech";
import { useAppSelector } from "../../../redux/hook";
import Section from "../../../models/Section";
import Segment from "../../../models/Segment";
import AudioPlay from "../../AudioPlay/AudioPlay";
import { Colors } from "../../../types/Colors";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Textfit } from 'react-textfit';

interface VerticalViewProps {
    module: Module;
    audioHub?: useEasySpeechType;
    setText: (text: string) => void;
    getColoredSpan: (content: string, colorId: number) => JSX.Element;
}

export default function VerticalView({ module, setText, audioHub }: VerticalViewProps) {
    console.log("VerticalView");
    const isHiddenOptions = useAppSelector((state) => state.moduleOptions.isHidden);

    const [translations, setTranslations] = useState<Array<Array<JSX.Element>>>();
    const [currentTranslationIndex, updateCurrentTranslationIndex] = useImmer<Array<number>>(new Array<number>(module.sections.length).fill(0));
    const [isHidden, updateIsHidden] = useImmer<Array<boolean>>(new Array<boolean>(module.sections.length).fill(isHiddenOptions));

    const sections = useMemo(() => {
        let fullText = "";

        const sections = module.sections.map((section: Section, sectionIndex: number) => {

            let fullSentence = "";

            const segments = section.segments.map((segment: Segment, segmentIndex: number) => {
                fullSentence += segment.sentence + " ";

                let sentencePiecies = segment.sentence.split(" ");
                let translationPiecies = segment.translation.split(" ");

                let sentenceSpans = sentencePiecies.map((word: string, internalIndex: number) => {
                    return getColoredSpan(word, segment.sentenceColors[internalIndex], sectionIndex, segmentIndex);
                })

                let translationSpans = translationPiecies.map((word: string, internalIndex: number) => {
                    return getColoredSpan(word, segment.translationColors[internalIndex], sectionIndex, segmentIndex);
                })

                return (
                    <section className="vertical-view__segment">
                        <section className="vertical-view__span-group">
                            {sentenceSpans}
                        </section>
                        <Textfit mode="single" style={{ maxHeight: "1rem" }}>
                            {translationSpans}
                        </Textfit>
                        {/* <section className="vertical-view__span-groupa translation-section">
                            {translationSpans}
                        </section> */}
                    </section>
                );
            });

            fullText += fullSentence;

            return (
                <section className="vertical-view__row">
                    <section key={sectionIndex} className='vertical-view__audioplay'>
                        {segments.length > 0 && <AudioPlay text={fullSentence} managementAudio={audioHub}></AudioPlay>}
                    </section>

                    {segments}
                </section>
            );
        });

        setText(fullText);

        return sections;
    }, [module]);


    // const sections = sectionsParts.map((sectionPart: JSX.Element, index: number) => {
    //     return (
    //         <>
    //             {sectionPart}
    //             <section className="sentence translation-section">
    //                 {translations && currentTranslationIndex[index] !== -1 && translations[index][currentTranslationIndex[index]]}
    //                 {isHiddenOptions && <button className={`icon-exchange view-visible-button ${isHidden[index] ? "hidden" : ""}`} onClick={() => updateIsHidden(state => { state[index] = !state[index] })}></button>}
    //             </section >
    //         </>
    //     );
    // });

    return (

        <Container className="vertical-view__container" fluid>
            {sections}
        </Container>

        // <section className={"classic-segments view-segments"}>
        //     {sections}
        // </section>
    );

    function getSpan(content: string, additionalClassName: string, sectionIndex: number, segmentIndex: number): JSX.Element {
        return (
            <span key={Math.random()} className={"word " + additionalClassName} data-type="1" onClick={() => {
                updateCurrentTranslationIndex(indexes => {
                    indexes[sectionIndex] = segmentIndex
                });
                updateIsHidden(state => { state[sectionIndex] = false });
            }}>{content}&nbsp;</span>
        );
    }

    function getColoredSpan(content: string, colorId: number, sectionIndex: number, segmentIndex: number): JSX.Element {

        let color = Colors[colorId];

        return getSpan(content, color, sectionIndex, segmentIndex);
    }
}