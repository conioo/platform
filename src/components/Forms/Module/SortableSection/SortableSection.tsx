import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/esm/Stack';
import { BaseSortableType } from '../Segmenting/Segmenting';
import './SortableSection.scss'

interface SortableSectionProps {
    segments: BaseSortableType[];
    onDoubleClick?: (index: number) => void;
}//onDoubleClick(index)

export default function SortableSection({ segments, onDoubleClick }: SortableSectionProps) {

    return (
        <>
            {segments.map((baseSortable, index) => {
                if (baseSortable['word']) {
                    return (<Badge key={baseSortable.id} className='disabled' bg='secondary'>{baseSortable.word}</Badge>);
                } else {
                    return (<Badge key={baseSortable.id} className='sortable-section__separator' bg='dark' onDoubleClick={() => {  }}></Badge>);
                }
            })}
        </>
        // <Badge ref={setNodeRef} style={style} {...attributes} {...listeners}>{word}</Badge> 

        // <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        //     kapusta
        // </div>
    );
}