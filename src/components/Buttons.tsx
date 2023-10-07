import '../css/Buttons.css';
import Segment from '../models/Segment';
import Module from '../models/Module';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import sanitizeHtml from "sanitize-html"

interface ButtonsProps {
    goToColouring: () => void;
    module: Module;
    onSentenceChanged: (newSentence: string, index: number) => void;
    onTranslationChanged: (newTranslation: string, index: number) => void;
}

export default function Buttons({ module, onSentenceChanged, onTranslationChanged, goToColouring }: ButtonsProps) {
    console.log("Buttons");

    if (!module) {
        return null;
    }

    function handleSentenceChanged(event: ContentEditableEvent, index: number) {
        const sanitizeConf = {
            allowedTags: ["b", "i", "a", "p"],
            allowedAttributes: { a: ["href"] }
        };

        let val = sanitizeHtml(event.currentTarget.innerHTML, sanitizeConf);

        onSentenceChanged(val, index);
    }

    function handleTranslationChanged(event: ContentEditableEvent, index: number) {
        onTranslationChanged(event.currentTarget.innerHTML, index);
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