import Button from "react-bootstrap/esm/Button";
import { useLocation, useNavigate } from "react-router-dom"
import "./ReturnButton.scss";
import { selectLanguage } from '../../redux/slices/language';
import { useSelector } from "react-redux";

interface ReturnButtonProps {
    variant?: string;
}

export default function ReturnButton({ variant = 'outline-secondary' }: ReturnButtonProps) {
    const navigate = useNavigate();

    let location = useLocation();
    let language = useSelector(selectLanguage);

    let isPreviousPath = location.key !== "default";

    return (
        <Button className='return-button' variant={variant} onClick={() => {
            if (isPreviousPath) {
                navigate(-1);
            }
            else {
                navigate(`/${language}/browser/home`);
            }
        }}>
            <i className="bi bi-reply-fill"></i>
        </Button>
    )
}