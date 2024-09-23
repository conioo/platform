import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/esm/Button';
import { useAppSelector } from '../../../redux/hook';
import { selectIsAdmin, selectIsLogin } from '../../../redux/slices/authentication';
import { googleLogin, googleLogout } from '../../services/AuhorizationService';
import './GoogleLogin.scss';
import { selectDataTheme } from '../../../redux/slices/application';

export default function GoogleLogin() {
    const isLogin = useAppSelector(selectIsLogin);
    const isAdmin = useAppSelector(selectIsAdmin);

    const dataTheme = useAppSelector(selectDataTheme);

    const handleLogin = (isAdmin: boolean) => {
        //console.log(gapi.auth2.getAuthInstance());

        gapi.auth2.getAuthInstance().signIn().then((user) => {
            //console.log(user.getBasicProfile().getEmail());

            googleLogin(isAdmin);
            // if (user.getBasicProfile().getEmail() === "modeplatform@gmail.com") {
            //     //console.log("admin");
            //     googleLogin(true);
            // }
            // else {
            //     googleLogin();
            // }
        });
    };

    const handleLogout = () => {
        gapi.auth2.getAuthInstance().signOut().then(() => {
            googleLogout();
        });
    }

    if (isLogin) {
        if (dataTheme === "dark") {
            if (isAdmin) {
                return (
                    <Button className="" variant="outline-light" onClick={handleLogout}>Wyloguj (Admin)</Button>
                );
            } else {
                return (
                    <Button className="" variant="outline-light" onClick={handleLogout}>Wyloguj</Button>
                );
            }

        } else if (dataTheme === "light") {
            if (isAdmin) {
                return (
                    <Button className="" variant="outline-dark" onClick={handleLogout}>Wyloguj (Admin)</Button>
                );
            }
            else {
                return (
                    <Button className="" variant="outline-dark" onClick={handleLogout}>Wyloguj</Button>
                );
            }
        }

        return null;
    }
    else {
        if (dataTheme === "dark") {
            return (
                <>
                    <Button className="login-button" variant="outline-light" onClick={() => {handleLogin(false)}}>Zaloguj</Button>
                    <Button className="login-button" variant="outline-light" onClick={() => {handleLogin(true)}}>Admin</Button>
                </>
            )
        } else if (dataTheme === "light") {
            return (
                <>
                    <Button className="login-button" variant="outline-dark" onClick={() => {handleLogin(false)}}>Zaloguj</Button>
                    <Button className="login-button" variant="outline-dark" onClick={() => {handleLogin(true)}}>Admin</Button>
                </>
            )
        }
        return null;
    }
};