import classNames from "classnames";
import { Colors } from "../../../../../types/Colors";

interface SpanElementProps {
    content: string;
    colorId: number;
    className?: string;
    onClick?: () => void;
    onMouseEnter?: ()=>void;
    onMouseLeave?: ()=>void;
}

export default function SpanElement({content, colorId, className, onClick, onMouseEnter, onMouseLeave}: SpanElementProps) {

    let color = Colors[colorId];

    const names = classNames(className, color);
    
    return (
        <span key={Math.random()} className={names} onClick={onClick} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>{content}&nbsp;</span>
    );
}