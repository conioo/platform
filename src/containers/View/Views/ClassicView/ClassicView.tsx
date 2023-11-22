import { useMemo, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useImmer } from "use-immer";
import AudioPlay from "../../../../components/AudioPlay";
import { useEasySpeechType } from "../../../../hooks/EasySpeech";
import Module from "../../../../models/Module";
import Section from "../../../../models/Section";
import Segment from "../../../../models/Segment";
import { useAppSelector } from "../../../../redux/hook";
import HoverElement from "../Common/HoverElement";
import SpanElement from "../Common/SpanElement";
import "./ClassicView.scss";

interface ClassicViewProps {
    module: Module;
    audioHub?: useEasySpeechType;
    setText: (text: string) => void;
}

export default function ClassicView({ module, setText, audioHub }: ClassicViewProps) {
    console.log("ClassicView");
    const isHiddenOptions = useAppSelector((state) => state.moduleOptions.isHidden);

    const [translations, setTranslations] = useState<Array<Array<JSX.Element>>>();
    const [currentTranslationIndex, updateCurrentTranslationIndex] = useImmer<Array<number>>(new Array<number>(module.sections.length).fill(-1));
    const [isHidden, updateIsHidden] = useImmer<Array<boolean>>(new Array<boolean>(module.sections.length).fill(isHiddenOptions));

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
                    return <HoverElement
                        updateCurrentTranslationIndex={updateCurrentTranslationIndex}
                        updateIsHidden={updateIsHidden}
                        sectionIndex={sectionIndex}
                        segmentIndex={segmentIndex}
                        colorId={segment.sentenceColors[internalIndex]}
                        content={word}
                        key={internalIndex}></HoverElement>
                })

                let meaningPiecies = segment.translation.split(" ");

                let allMeanings = meaningPiecies.map((meaning: string, internalIndex: number) => {
                    return (<SpanElement
                        content={meaning}
                        colorId={segment.translationColors[internalIndex]}
                        onClick={() => {
                            updateCurrentTranslationIndex(indexes => {
                                indexes[sectionIndex] = segmentIndex
                            });
                            updateIsHidden(state => { state[sectionIndex] = false });
                        }}></SpanElement>)
                })

                translations[sectionIndex].push(
                    (<>
                        {allMeanings}
                    </>)
                );

                return allWords;
            });

            fullText += fullSentence;

            return (
                <>
                    <section key={sectionIndex} className='classic-view__audioplay-container'>
                        {segments.length > 0 && <AudioPlay text={fullSentence} managementAudio={audioHub}></AudioPlay>}
                    </section>
                    <section className="classic-view__sentence-segment">
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
                <section className="classic-view__translation-segment">
                    {translations && currentTranslationIndex[index] === -1 && translations[index]}
                    {translations && currentTranslationIndex[index] !== -1 && translations[index][currentTranslationIndex[index]]}
                    {isHiddenOptions && <Button className={`classic-view__visible-button ${isHidden[index] ? "hidden" : ""}`} onClick={() => updateIsHidden(state => { state[index] = !state[index] })}><i className="bi bi-arrow-left-right"></i></Button>}
                </section >
            </>
        );
    });

    return (
        <section className={"classic-view"}>
            {sections}
        </section>
    );
}