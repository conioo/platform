import { useMemo } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import AudioPlay from "../../../../components/AudioPlay";
import { useEasySpeechType } from "../../../../hooks/EasySpeech";
import Module from "../../../../models/Module";
import Section from "../../../../models/Section";
import Segment from "../../../../models/Segment";
import { useAppSelector } from "../../../../redux/hook";
import SpanElement from "../Common/SpanElement";
import "./OverlayView.scss";

interface OverlayViewProps {
    module: Module;
    audioHub?: useEasySpeechType;
    setText: (text: string) => void;
}

export default function OverlayView({ module, setText, audioHub }: OverlayViewProps) {
    console.log("OverlayView");

    const isHiddenOptions = useAppSelector((state) => state.moduleOptions.isHidden);

    const sections = useMemo(() => {
        let fullText = "";

        const sections = module.sections.map((section: Section, sectionIndex: number) => {
            let fullSentence = "";

            const segments = section.segments.map((segment: Segment, segmentIndex: number) => {
                fullSentence += segment.sentence + " ";

                let sentencePiecies = segment.sentence.split(" ");

                let allSentences = sentencePiecies.map((word: string, internalIndex: number) => {
                    return (<SpanElement content={word} colorId={segment.sentenceColors[internalIndex]} key={internalIndex}></SpanElement>);
                })

                let meaningPiecies = segment.translation.split(" ");

                let allMeanings = meaningPiecies.map((meaning: string, internalIndex: number) => {
                    return (<SpanElement content={meaning} colorId={segment.translationColors[internalIndex]} key={internalIndex}></SpanElement>);
                })

                return (
                    <OverlayTrigger
                        placement="top"
                        trigger={["hover", "focus"]}
                        delay={{ show: 120, hide: 80 }}
                        // key={segmentIndex}
                        key={`${sectionIndex} ${segmentIndex}`}
                        overlay={
                            <Tooltip className="overlay-view__tooltip">
                                {allMeanings}
                            </Tooltip>
                        }>
                        <section className="overlay-view__segment">
                            {allSentences}
                        </section>
                    </OverlayTrigger>
                );
            });

            fullText += fullSentence;

            return (
                <>
                    <section className='overlay-view__audioplay-container' key={`a${sectionIndex}`}>
                        {segments.length > 0 && <AudioPlay text={fullSentence} managementAudio={audioHub} key={`a${sectionIndex}`}></AudioPlay>}
                    </section>

                    <section className="overlay-view__segments" key={`o${sectionIndex}`}>
                        {segments}
                    </section>
                </>
            );
        });

        setText(fullText);

        return sections;

    }, [module]);

    return (
        <section className="overlay-view">
            {sections}
        </section>
    );
}