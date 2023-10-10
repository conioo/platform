import React, { useCallback, useEffect, useState } from 'react';
import '../css/Buttons.css';
import '../css/Colouring.css';
import Segment from '../models/Segment';
import Module from '../models/Module';
import { Colors } from '../types/Colors';

interface ColouringProps {
    module: Module;
    onSentenceColorChanged: (index: number, internalIndex: number, colorNumber: number) => void;
    onTranslationColorChanged: (index: number, internalIndex: number, colorNumber: number) => void;
    goToButtons: () => void;
}

export default function Colouring({ module, onSentenceColorChanged, onTranslationColorChanged, goToButtons }: ColouringProps) {
    console.log("Colouring");

    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const [refsToCollorButton, setRefsToCollorButton] = useState<Array<React.RefObject<HTMLButtonElement>>>([
        React.createRef<HTMLButtonElement>(),
        React.createRef<HTMLButtonElement>(),
        React.createRef<HTMLButtonElement>(),
        React.createRef<HTMLButtonElement>(),
        React.createRef<HTMLButtonElement>(),
        React.createRef<HTMLButtonElement>()]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (refsToCollorButton.length === 0) {
            return;
        }

        switch (event.key) {
            case "z": { handleClickColor(refsToCollorButton[0], 0); break; }
            case "x": { handleClickColor(refsToCollorButton[1], 1); break; }
            case "c": { handleClickColor(refsToCollorButton[2], 2); break; }
            case "v": { handleClickColor(refsToCollorButton[3], 3); break; }
            case "b": { handleClickColor(refsToCollorButton[4], 4); break; }
            case "n": { handleClickColor(refsToCollorButton[5], 5); break; }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    if (!module) {
        return null;
    }

    const segments = module.segments.map((segment: Segment, index: number) => {
        let wordPiecies = segment.sentence.split(" ");

        let allWords = wordPiecies.map((word: string, internalIndex: number) => {
            let refToSpan = React.createRef<HTMLSpanElement>();
            return (
                <span key={Math.random()} className={`part-segment ${getAppropriateColorClassName(segment.sentenceColors[internalIndex])}`} onClick={() => { handleWordColorChanged(index, internalIndex, refToSpan); }} ref={refToSpan}>{word + " "}</span>
            );
        })

        let meaningPiecies = segment.translation.split(" ");

        let allMeanings = meaningPiecies.map((meaning: string, internalIndex: number) => {
            let refToSpan = React.createRef<HTMLSpanElement>();
            return (
                <span key={Math.random()} className={`part-segment ${getAppropriateColorClassName(segment.translationsColors[internalIndex])}`} onClick={() => { handleMeaningColorChanged(index, internalIndex, refToSpan); }} ref={refToSpan}>{meaning + " "}</span>
            );
        })

        return (
            <>
                <span key={Math.random()} className='span-segment'>
                    {allWords}
                </span>
                <span key={Math.random()} className='span-segment'>
                    {allMeanings}
                </span>
                <div className='segments-separator'></div>
            </>
        );
    });

    function getAppropriateColorClassName(colorNumber: number): string {
        return Colors[colorNumber];
    }

    function handleWordColorChanged(index: number, internalIndex: number, ref: React.RefObject<HTMLSpanElement>) {
        onSentenceColorChanged(index, internalIndex, currentColorIndex);
    }

    function handleMeaningColorChanged(index: number, internalIndex: number, ref: React.RefObject<HTMLSpanElement>) {
        onTranslationColorChanged(index, internalIndex, currentColorIndex);
    }

    const colors = Colors.map((colorName: string, index: number) => {
        return (
            <button type='button' id={index.toString() + "rgb"} ref={refsToCollorButton[index]} style={{ backgroundColor: colorName }} className='rgb-button' onClick={() => handleClickColor(refsToCollorButton[index], index)}>
            </button>
        )
    });

    function handleClickColor(ref: React.RefObject<HTMLButtonElement>, index: number) {
        refsToCollorButton?.forEach(ref => {
            if (ref.current) {
                ref.current.classList.remove('selected');
            }
        });

        if (ref.current) {
            ref.current.classList.add('selected');
            setCurrentColorIndex(index);
        }
    }

    return (
        <>
            <section className='colors-section'>
                {colors}
            </section>

            <section className='segments'>
                {segments}
            </section>

            <button onClick={goToButtons} className='change-segments-button'>Zmień zawartość</button>
        </>
    );
}