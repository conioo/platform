import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/esm/Button';
import { useAppSelector } from '../../../redux/hook';
import { selectIsLogin } from '../../../redux/slices/authentication';
import { googleLogin, googleLogout } from '../../services/AuhorizationService';
import './GoogleLogin.scss';

export default function GoogleLogin() {
    const isLogin = useAppSelector(selectIsLogin);

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
        return (
            <Button className="" variant="outline-dark" onClick={handleLogout}>Wyloguj</Button>
        );
    }
    else {
        return (
            <Button className="" variant="outline-dark" onClick={handleLogin}>Zaloguj</Button>
        )
    }
};