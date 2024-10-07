import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import { Textfit } from 'react-textfit';
import { useImmer } from "use-immer";
import AudioPlay from "../../../../components/AudioPlay";
import { useEasySpeechType } from "../../../../hooks/EasySpeech";
import Module from "../../../../models/Module";
import Section from "../../../../models/Section";
import Segment from "../../../../models/Segment";
import { useAppSelector } from "../../../../redux/hook";
import SpanElement from "../Common/SpanElement";
import './VerticalView.scss';

interface VerticalViewProps {
    module: Module;
    audioHub: useEasySpeechType;
    setText: (text: string) => void;
    audioUrl?: Array<string | undefined>;
}

export default function VerticalView({ module, setText, audioHub, audioUrl }: VerticalViewProps) {
    console.log("VerticalView");
    const isHiddenOptions = useAppSelector((state) => state.moduleOptions.isHidden);
    const [isHidden, updateIsHidden] = useImmer<Array<Array<boolean>>>(() => {

        let array = new Array<Array<boolean>>(module.sections.length);

        for (let i = 0; i < module.sections.length; ++i) {
            array[i] = new Array<boolean>(module.sections[i].segments.length).fill(true);
        }

        return array;
    });

    const [widthSegments, setWidthSegments] = useState<Array<number>>();
    console.log(isHidden);

    useEffect(() => {
        const elements = document.getElementsByClassName("vertical-view__sentence") as HTMLCollectionOf<HTMLElement>;

        const arrayWidths = new Array<number>();

        for (let i = 0; i < elements.length; ++i) {
            console.log(elements[i].offsetHeight);
            arrayWidths.push(elements[i].offsetWidth);
        }

        setWidthSegments(arrayWidths);
    }, [document.body.style.getPropertyValue("--tooltip-font-size")]);

    const sections = useMemo(() => {
        let fullText = "";
        let widthIndex = 0;

        const sections = module.sections.map((section: Section, sectionIndex: number) => {

            let fullSentence = "";

            const segments = section.segments.map((segment: Segment, segmentIndex: number) => {
                fullSentence += segment.sentence + " ";

                let sentencePiecies = segment.sentence.split(" ");
                let translationPiecies = segment.translation.split(" ");

                let sentenceSpans = sentencePiecies.map((word: string, internalIndex: number) => {
                    return (
                        <SpanElement
                            content={word}
                            colorId={segment.sentenceColors[internalIndex]}
                            onClick={() => {
                                updateIsHidden(state => { state[sectionIndex][segmentIndex] = false });
                            }}></SpanElement>
                    );
                })

                let translationSpans = translationPiecies.map((word: string, internalIndex: number) => {
                    return (
                        <SpanElement
                            content={word}
                            colorId={segment.translationColors[internalIndex]}></SpanElement>
                    );
                })

                return (
                    <section className="vertical-view__segment">
                        <section className="vertical-view__sentence">
                            {sentenceSpans}
                        </section>

                        {widthSegments &&
                            <Textfit mode="single" forceSingleModeWidth={false} className="vertical-view__translation" style={{ width: widthSegments[widthIndex++] }} max={22.4}>
                                {translationSpans}
                                {isHiddenOptions && <Button className={`view__visible-button ${isHidden[sectionIndex][segmentIndex] ? "hidden" : ""}`} onClick={() => updateIsHidden(state => { state[sectionIndex][segmentIndex] = !state[sectionIndex][segmentIndex] })}><i className="bi bi-arrow-left-right"></i></Button>}
                            </Textfit>
                        }
                    </section>
                );
            });

            fullText += fullSentence;

            return (
                <section className="vertical-view__row">
                    <section key={sectionIndex} className='vertical-view__audioplay'>
                        {segments.length > 0 && <AudioPlay id={sectionIndex} text={fullSentence} managementAudio={audioHub} audioUrl={audioUrl ? audioUrl[sectionIndex] : undefined}></AudioPlay>}
                    </section>

                    {segments}
                </section>
            );
        });

        setText(fullText);

        return sections;
    }, [module, widthSegments, isHidden, audioUrl]);

    return (
        <section className="vertical-view view-segments">
            <Container className="vertical-view__container" fluid>
                {sections}
            </Container>
        </section>
    );
}