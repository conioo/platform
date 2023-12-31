import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/esm/Button';
import { useAppSelector } from '../../../redux/hook';
import { selectIsLogin } from '../../../redux/slices/authentication';
import { googleLogin, googleLogout } from '../../services/AuhorizationService';
import './GoogleLogin.scss';
import { selectDataTheme } from '../../../redux/slices/application';

export default function GoogleLogin() {
    const isLogin = useAppSelector(selectIsLogin);
    const dataTheme = useAppSelector(selectDataTheme);

    const handleLogin = () => {
        console.log(gapi.auth2.getAuthInstance());
        gapi.auth2.getAuthInstance().signIn().then(() => {
            googleLogin();
        });
    };

    const handleLogout = () => {
        gapi.auth2.getAuthInstance().signOut().then(() => {
            googleLogout();
        });
    }

    if (isLogin) {
        if (dataTheme === "dark") {
            return (
                <Button className="" variant="outline-light" onClick={handleLogout}>Wyloguj</Button>
            );
        } else if (dataTheme === "light") {
            return (
                <Button className="" variant="outline-dark" onClick={handleLogout}>Wyloguj</Button>
            );
        }

        return null;
    }
    else {
        if (dataTheme === "dark") {
            return (
                <Button className="" variant="outline-light" onClick={handleLogin}>Zaloguj</Button>
            )
        } else if (dataTheme === "light") {
            return (
                <Button className="" variant="outline-dark" onClick={handleLogin}>Zaloguj</Button>
            )
        }
        return null;

    }
};