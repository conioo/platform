import { useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsLogin } from "../../redux/slices/authentication";
import { selectLanguage } from "../../redux/slices/language";
import "./NoAuthorization.scss";

interface NoAuthorizationProps {
}

export default function NoAuthorization({ }: NoAuthorizationProps) {
    const navigate = useNavigate();

    const isLogin = useSelector(selectIsLogin);
    const language = useSelector(selectLanguage);

    useEffect(() => {
        if (isLogin) {
            navigate(-1);
        }
    }, [isLogin]);

    return (
        <section className="no-authorization">
            <h2>Brak uprawnień</h2>
            <Button variant="outline-dark" onClick={() => navigate(`/${language}/browser/home`)}>Strona Główne</Button>
        </section>
    )
}