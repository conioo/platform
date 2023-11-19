import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom"
import "./ReturnButton.scss";

interface ReturnButtonProps {
    variant: string;
}

export default function ReturnButton({ variant }: ReturnButtonProps) {
    const Navigate = useNavigate();
    return (
        <Button className='return-button' variant={variant} onClick={() => Navigate(-1)}>
            <i className="bi bi-reply-fill"></i>
        </Button>
    )
}