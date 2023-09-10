import React, { useState, useEffect, useRef } from 'react';
import '../css/Buttons.css';
import '../css/Colouring.css';
import Segment from '../models/Segment';
import State from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import { saveModuleToGoogleDrive } from '../google/GoogleDriveService';
import Module from '../models/Module';

interface ColouringProps {
    module: Module;
    dispath: React.Dispatch<Action>;
    state: State;
    backToButtons: () => void;
}

export default function Colouring({ module, dispath, state, backToButtons }: ColouringProps) {
    console.log("ColouringProps");

    const [isSaving, setIsSaving] = useState(false);
    const [wordColors, setWordColors] = useState<Array<Array<number>>>(new Array<Array<number>>());
    const [meaningColors, setMeaningColors] = useState<Array<Array<number>>>(new Array<Array<number>>());

    if (isSaving === true) {
        saveFile().then(() => {
            dispath({ type: ActionType.Return });
        }).catch(exception => console.log(exception));
    }

    let wordColorsArray = new Array<Array<number>>(module.segments.length);
    let meaningColorsArray = new Array<Array<number>>(module.segments.length);

    let colorsRGB = new Array<string>();

    colorsRGB.push("black");
    colorsRGB.push("orange");
    colorsRGB.push("red");
    colorsRGB.push("purple");
    colorsRGB.push("navy");
    colorsRGB.push("green");

    let currentColorIndex: number = 0;

    const segments = module.segments.map((segment: Segment, index: number) => {

        let wordPiecies = segment.sentence.split(" ");
        wordColorsArray[index] = new Array(wordPiecies.length).fill(0);

        let allWords = wordPiecies.map((word: string, internalIndex: number) => {
            let refToSpan = React.createRef<HTMLSpanElement>();
            return (
                <span key={Math.random()} className='part-segment' onClick={() => { handleClickWord(index, internalIndex, refToSpan); }} ref={refToSpan}>{word + " "}</span>
            );
        })

        let meaningPiecies = segment.translation.split(" ");
        meaningColorsArray[index] = new Array(meaningPiecies.length).fill(0);

        let allMeanings = meaningPiecies.map((meaning: string, internalIndex: number) => {
            let refToSpan = React.createRef<HTMLSpanElement>();
            return (
                <span key={Math.random()} className='part-segment' onClick={() => { handleClickMeaning(index, internalIndex, refToSpan); }} ref={refToSpan}>{meaning + " "}</span>
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
            </>
        );
    });

    function removeColorFromSpanElement(colorNumber: number, ref: React.RefObject<HTMLSpanElement>) {
        switch (colorNumber) {
            case 0:
                break;
            case 1:
                ref.current?.classList.remove("orange");
                break;
            case 2:
                ref.current?.classList.remove("red");
                break;
            case 3:
                ref.current?.classList.remove("purple");
                break;
            case 4:
                ref.current?.classList.remove("navy");
                break;
            case 5:
                ref.current?.classList.remove("green");
                break;
        }
    }

    function handleClickWord(index: number, internalIndex: number, ref: React.RefObject<HTMLSpanElement>) {
        switch (currentColorIndex) {
            case 0:
                removeColorFromSpanElement(wordColorsArray[index][internalIndex], ref);
                wordColorsArray[index][internalIndex] = 0;
                break;
            case 1:
                removeColorFromSpanElement(wordColorsArray[index][internalIndex], ref);
                wordColorsArray[index][internalIndex] = 1;
                ref.current?.classList.add("orange");
                break;
            case 2:
                removeColorFromSpanElement(wordColorsArray[index][internalIndex], ref);
                wordColorsArray[index][internalIndex] = 2;
                ref.current?.classList.add("red");
                break;
            case 3:
                removeColorFromSpanElement(wordColorsArray[index][internalIndex], ref);
                wordColorsArray[index][internalIndex] = 3;
                ref.current?.classList.add("purple");
                break;
            case 4:
                removeColorFromSpanElement(wordColorsArray[index][internalIndex], ref);
                wordColorsArray[index][internalIndex] = 4;
                ref.current?.classList.add("navy");
                break;
            case 5:
                removeColorFromSpanElement(wordColorsArray[index][internalIndex], ref);
                wordColorsArray[index][internalIndex] = 5;
                ref.current?.classList.add("green");
                break;
        }
    }

    function handleClickMeaning(index: number, internalIndex: number, ref: React.RefObject<HTMLSpanElement>) {
        switch (currentColorIndex) {
            case 0:
                removeColorFromSpanElement(meaningColorsArray[index][internalIndex], ref);
                meaningColorsArray[index][internalIndex] = 0;
                break;
            case 1:
                removeColorFromSpanElement(meaningColorsArray[index][internalIndex], ref);
                meaningColorsArray[index][internalIndex] = 1;
                ref.current?.classList.add("orange");
                break;
            case 2:
                removeColorFromSpanElement(meaningColorsArray[index][internalIndex], ref);
                meaningColorsArray[index][internalIndex] = 2;
                ref.current?.classList.add("red");
                break;
            case 3:
                removeColorFromSpanElement(meaningColorsArray[index][internalIndex], ref);
                meaningColorsArray[index][internalIndex] = 3;
                ref.current?.classList.add("purple");
                break;
            case 4:
                removeColorFromSpanElement(meaningColorsArray[index][internalIndex], ref);
                meaningColorsArray[index][internalIndex] = 4;
                ref.current?.classList.add("navy");
                break;
            case 5:
                removeColorFromSpanElement(meaningColorsArray[index][internalIndex], ref);
                meaningColorsArray[index][internalIndex] = 5;
                ref.current?.classList.add("green");
                break;
        }
    }

    let arrayRefs = Array<React.RefObject<HTMLButtonElement>>();

    const colors = colorsRGB.map((rgb: string, index: number) => {
        let refToColorButton = React.createRef<HTMLButtonElement>();

        arrayRefs.push(refToColorButton);

        return (
            <button id={index.toString() + "rgb"} ref={refToColorButton} style={{ backgroundColor: rgb }} className='rgb-button' onClick={() => handleClickColor(refToColorButton, index)}>
            </button>
        )
    });

    function handleClickColor(ref: React.RefObject<HTMLButtonElement>, index: number) {
        console.log("klik");
        arrayRefs.forEach(ref => {
            if (ref.current) {
                ref.current.classList.remove('selected');
            }
        });

        if (ref.current) {
            ref.current.classList.add('selected');
            currentColorIndex = index;
        }
    }

    function handleBackToButtons() {
        backToButtons();
    }

    return (
        <>
            <section className='colors-section'>
                {colors}
            </section>

            <section className='segments-to-colouring'>
                {segments}
            </section>

            <button onClick={handleBackToButtons}>Powrót</button>

            <section className="save-section">
                Nazwa pliku: <input type='text' id='fileName'></input>
                <button className='save-button' onClick={() => { setWordColors(wordColorsArray); setMeaningColors(meaningColorsArray); setIsSaving(true) }}>Zapisz</button>
                {isSaving && <span>Zapisywanie...</span>}
            </section>
        </>
    );

    async function saveFile() {
        console.log("saving");

        console.log(wordColors);
        console.log(meaningColors);

        let fileName = (document.getElementById("fileName") as HTMLInputElement).value;

        if (fileName.length == 0) {
            setIsSaving(false)
            alert("missing filename");
            throw "missing name";
        }

        if (!state.folderParentId) {
            setIsSaving(false)
            throw "missing folder parent id";
        }

        for (let i = 0; i < module.segments.length; ++i) {
            module.segments[i].sentenceColors = wordColors[i];
            module.segments[i].translationsColors = meaningColors[i];
        }

        try {
            await saveModuleToGoogleDrive(fileName, module, state.folderParentId);

            console.log("saving all correctly");

        } catch (error: any) {
            console.error("Error occured:", error);
        }
    }
}