import { Updater } from "use-immer";
import SpanElement from "../SpanElement";

interface HoverElementProps {
    updateCurrentTranslationIndex: Updater<number[]>;
    updateIsHidden: Updater<boolean[]>;
    sectionIndex: number;
    segmentIndex: number;
    content: string;
    colorId: number;
}

export default function HoverElement({ updateCurrentTranslationIndex, updateIsHidden, sectionIndex, segmentIndex, content, colorId }: HoverElementProps) {

    const segmentClassName = `${sectionIndex}-${segmentIndex}`;

    return (
        <SpanElement content={content} colorId={colorId} className={segmentClassName} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}></SpanElement>
    );

    function onClick() {
        updateCurrentTranslationIndex(indexes => {
            indexes[sectionIndex] = segmentIndex
        });
        updateIsHidden(state => { state[sectionIndex] = false });
    }

    function onMouseEnter() {
        const elements = document.getElementsByClassName(segmentClassName);
        for (let i = 0; i < elements.length; ++i) {
            elements[i].classList.add("hovered");
        }
    }

    function onMouseLeave() {
        const elements = document.getElementsByClassName(segmentClassName);

        for (let i = 0; i < elements.length; ++i) {
            elements[i].classList.remove("hovered");
        }
    }
}