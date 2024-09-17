import { useEffect, useMemo, useRef, useState } from "react";
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
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

import { getAudio } from '../../../../google/GoogleDriveService';

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

    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);

    const audioRef = useRef<HTMLAudioElement>(null);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
            console.log('Odtwarzanie rozpoczęte.');
        }
    };
  
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            console.log('Odtwarzanie zatrzymane.');
        }
    };
    
    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const url = await getAudio("d");
                console.log(url);
                setAudioUrl(url);
            } catch (error) {
                console.error('Błąd podczas pobierania pliku audio', error);
            }
        };

        fetchAudio();
    }, []);

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

            if (fullSentence.length === 1) {
                return ([]);
                // console.log(fullSentence.length);
            }

            return (
                [
                    (<section key={sectionIndex} className='classic-view__audioplay-container'>
                        <AudioPlay text={fullSentence} managementAudio={audioHub}></AudioPlay>
                    </section>),
                    (<section className="classic-view__sentence-segment">
                        {segments}
                    </section>)
                ]
            );
        });

        setText(fullText);
        setTranslations(translations);

        return sections;

    }, [module]);

    const sections = sectionsParts.map((sectionParts: JSX.Element[], index: number) => {

        if (sectionParts.length === 0) {
            return (
                <Row>
                    <Col sm={12} md={6} className="classic-view__column-segment">
                        &nbsp;
                    </Col>
                    <Col sm={12} md={6}>
                    </Col>
                </Row>
            );
        }

        return (
            <Row>
                <Col sm={12} md={6} className="classic-view__column-segment">
                    {sectionParts}
                </Col>
                <Col sm={12} md={6}>
                    <section className="classic-view__translation-segment">
                        {translations && currentTranslationIndex[index] === -1 && translations[index]}
                        {translations && currentTranslationIndex[index] !== -1 && translations[index][currentTranslationIndex[index]]}
                        {isHiddenOptions && <Button className={`view__visible-button ${isHidden[index] ? "hidden" : ""}`} onClick={() => updateIsHidden(state => { state[index] = !state[index] })}><i className="bi bi-arrow-left-right"></i></Button>}
                    </section >
                </Col>
            </Row>
        );
    });

    return (
        <Container fluid className={"classic-view"}>
            {sections}

            {/* {audioUrl ? (
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Twoja przeglądarka nie obsługuje elementu audio.
              </audio>
            ) : (
              <p>Ładowanie pliku audio...</p>
            )} */}
 {/* style={{ display: 'none' }} */}
            {/* <div>
                <h1>Odtwarzanie MP3 z Google Drive</h1>

            <audio ref={audioRef} controls style={{ display: 'none' }}>
              <source
                src={audioUrl}
                type="audio/mpeg"
              />
              Twoja przeglądarka nie obsługuje elementu audio.
            </audio>

            <button onClick={playAudio}>Odtwórz</button>
            <button onClick={pauseAudio}>Pauza</button>
          </div>  */}

        </Container>
    );
}