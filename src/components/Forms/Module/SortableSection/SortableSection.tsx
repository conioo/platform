import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/esm/Stack';
import { BaseSortableType } from '../Segmenting/Segmenting';
import './SortableSection.scss'

interface SortableSectionProps {
    segments: BaseSortableType[];
    onDoubleClick: (id: string) => void;
}//onDoubleClick(index)

const backgrounds = [
    "primary",
    "info",
    "danger",
    "success",
    "warning",
    "light"
]

export default function SortableSection({ segments, onDoubleClick }: SortableSectionProps) {
    let backgroundIndex = 0;

    return (
        <>
            {segments.map((baseSortable) => {
                if (baseSortable['word']) {
                    return (<Badge key={baseSortable.id} className='disabled' bg={backgrounds[backgroundIndex]}>{baseSortable.word}</Badge>);
                } else {
                    next();
                    return (<Badge key={baseSortable.id} className='sortable-section__separator' bg='dark' onDoubleClick={() => { onDoubleClick(baseSortable.id) }}> </Badge>);
                }
            })}
        </>
        // <Badge ref={setNodeRef} style={style} {...attributes} {...listeners}>{word}</Badge> 

        // <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        //     kapusta
        // </div>
    );

    function next() {
        ++backgroundIndex;

        if (backgroundIndex == backgrounds.length) {
            backgroundIndex = 0;
        }
    }
}