import { Updater } from "use-immer";
import classNames from 'classnames';
import { Colors } from "../../types/Colors";

interface ElementProps {
    updateCurrentTranslationIndex: Updater<number[]>;
    updateIsHidden: Updater<boolean[]>;
    sectionIndex: number;
    segmentIndex: number;
    content: string;
    colorId: number;
}

export default function Element({ updateCurrentTranslationIndex, updateIsHidden, sectionIndex, segmentIndex, content, colorId }: ElementProps) {
    const color = Colors[colorId];

    const segmentClassName = `${sectionIndex}-${segmentIndex}`;
    const names = classNames('word', color, segmentClassName);

    return (
        <span key={Math.random()} className={names} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {content}
            &nbsp;
        </span>
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