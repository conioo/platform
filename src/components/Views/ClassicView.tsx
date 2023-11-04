import { useMemo, useState } from "react";
import { useImmer } from "use-immer";
import "../../css/Views/ClassicView.css";
import { useEasySpeech } from "../../hooks/EasySpeech";
import Module from "../../models/NewModule";
import Section from "../../models/Section";
import Segment from "../../models/Segment";
import { useAppSelector } from "../../redux/hook";
import AudioPlay from "../AudioPlay";
import { Colors } from "../../types/Colors";
import Element from "./Element";

interface ClassicViewProps {
    module: Module;
    setText: (text: string) => void;
    getColoredSpan: (content: string, colorId: number) => JSX.Element;
}

export default function ClassicView({ module, setText }: ClassicViewProps) {
    console.log("ClassicView");
    const isHiddenOptions = useAppSelector((state) => state.moduleOptions.isHidden);

    const [translations, setTranslations] = useState<Array<Array<JSX.Element>>>();
    const [currentTranslationIndex, updateCurrentTranslationIndex] = useImmer<Array<number>>(new Array<number>(module.sections.length).fill(0));
    const [isHidden, updateIsHidden] = useImmer<Array<boolean>>(new Array<boolean>(module.sections.length).fill(isHiddenOptions));

    let audioHub = useEasySpeech();

    const sectionsParts = useMemo(() => {
        let translations = new Array<Array<JSX.Element>>();
        let fullText = "";

        const sections = module.sections.map((section: Section, sectionIndex: number) => {

            translations.push(new Array<JSX.Element>());

            let fullSentence = "";

            const segments = section.segments.map((segment: Segment, segmentIndex: number) => {
                fullSentence += segment.sentence + " ";

                let wordPiecies = segment.sentence.split(" ");

                let allWords = wordPiecies.map((word: string, internalIndex: number) => {
                    return <Element
                        updateCurrentTranslationIndex={updateCurrentTranslationIndex}
                        updateIsHidden={updateIsHidden}
                        sectionIndex={sectionIndex}
                        segmentIndex={segmentIndex}
                        colorId={segment.sentenceColors[internalIndex]}
                        content={word}></Element>
                })

                let meaningPiecies = segment.translation.split(" ");

                let allMeanings = meaningPiecies.map((meaning: string, internalIndex: number) => {
                    return getColoredSpan(meaning, segment.translationColors[internalIndex], sectionIndex, segmentIndex);
                })

                translations[sectionIndex].push(
                    (<section key={segmentIndex} className="sentence-segment">
                        {allMeanings}
                    </section>)
                );

                return allWords;
            });

            fullText += fullSentence;

            return (
                <>
                    <section key={sectionIndex} className='audioplay-container'>
                        {segments.length > 0 && <AudioPlay text={fullSentence} managementAudio={audioHub}></AudioPlay>}
                    </section>
                    <section className="sentence-segment sentence">
                        {segments}
                    </section>
                </>
            );
        });

        setText(fullText);
        setTranslations(translations);

        return sections;

    }, [module]);


    const sections = sectionsParts.map((sectionPart: JSX.Element, index: number) => {
        return (
            <>
                {sectionPart}
                <section className="sentence translation-section">
                    {translations && currentTranslationIndex[index] !== -1 && translations[index][currentTranslationIndex[index]]}
                    {isHiddenOptions && <button className={`icon-exchange view-visible-button ${isHidden[index] ? "hidden" : ""}`} onClick={() => updateIsHidden(state => { state[index] = !state[index] })}></button>}
                </section >
            </>
        );
    });

    return (
        <section className={"classic-segments view-segments"}>
            {sections}
        </section>
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