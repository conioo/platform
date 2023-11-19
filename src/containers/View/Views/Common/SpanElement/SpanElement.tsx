import { Colors } from "../../../../../types/Colors";

interface SpanElementProps {
    content: string;
    colorId: number;
    // [key: string]: any;
}

export default function SpanElement({content, colorId}: SpanElementProps) {

    let color = Colors[colorId];
    
    return (
        <span key={Math.random()} className={color}>{content}&nbsp;</span>
    );
}