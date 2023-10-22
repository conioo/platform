import '../css/Buttons.css';
import Segment from '../models/Segment';
import Module from '../models/Module';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import sanitizeHtml from "sanitize-html"
import { useEffect } from 'react';

interface ButtonsProps {
    goToColouring: () => void;
    module: Module;
    onSentenceChanged: (newSentence: string, index: number) => void;
    onTranslationChanged: (newTranslation: string, index: number) => void;
}

export default function Buttons({ module, onSentenceChanged, onTranslationChanged, goToColouring }: ButtonsProps) {
    console.log("Buttons");

    // const sanitizeConf = {
    //     allowedTags: ["b", "i", "a", "p"],
    //     allowedAttributes: { a: ["href"] }
    // };

    // useEffect(() => {
    //     for (let i = 0; i < module.segments.length; ++i) {
    //         onTranslationChanged(sanitizeHtml(module.segments[i].translation, sanitizeConf), i);
    //     }
    // }, []);

    if (!module) {
        return null;
    }

    function handleSentenceChanged(event: ContentEditableEvent, index: number) {
        let val = sanitizeHtml(event.currentTarget.innerHTML);

        onSentenceChanged(val, index);
    }

    function handleTranslationChanged(event: ContentEditableEvent, index: number) {
        let val = sanitizeHtml(event.currentTarget.innerHTML);

        onTranslationChanged(val, index);
    }

    const segments = module.segments.map((segment: Segment, index: number) => {
        return (
            <>
                <ContentEditable html={segment.sentence} onChange={(event: ContentEditableEvent) => handleSentenceChanged(event, index)} className='span-segment'></ContentEditable>
                <ContentEditable html={segment.translation} onChange={(event: ContentEditableEvent) => handleTranslationChanged(event, index)} className='span-segment'></ContentEditable>
                <div className='segments-separator'></div>
            </>
        );
    });

    return (
        <>
            <section className='segments'>
                {segments}
            </section>
            <section>
                <button type='button' onClick={() => { GoToColouring(); }} className='change-segments-button'>Koloruj</button>
            </section>
        </>
    );

    function GoToColouring() {
        if (module.segments.length === 0) {
            alert("nie wprowadzono danych");
            return;
        }
        goToColouring();
    }
}