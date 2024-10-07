import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/esm/Button';
import { useAppSelector } from '../../../redux/hook';
import { selectIsAdmin, selectIsLogin } from '../../../redux/slices/authentication';
import { googleLogin, googleLogout } from '../../services/AuhorizationService';
import './GoogleLogin.scss';
import { selectDataTheme } from '../../../redux/slices/application';
import { useEffect, useState } from 'react';

export default function GoogleLogin() {
    const isLogin = useAppSelector(selectIsLogin);
    const isAdmin = useAppSelector(selectIsAdmin);

    const dataTheme = useAppSelector(selectDataTheme);

    // const CLIENT_ID_USER = process.env.REACT_APP_GITHUB_CLIENT_ID;

    // const [authAdmin, setAuthAdmin] = useState<gapi.auth2.GoogleAuthBase | null>(null);
    // const [authUser, setAuthUser] = useState<gapi.auth2.GoogleAuthBase | null>(null);

    // console.log(authAdmin);
    // console.log(authUser);

    // useEffect(() => {
    //     const initAuthClients = async () => {
    //         // Inicjalizacja dla zwykłego użytkownika
    //         await gapi.load('client:auth2', () => {
    //             gapi.auth2.init({
    //                 client_id: CLIENT_ID_USER,
    //                 scope: 'profile email',
    //             }).then((auth) => {
    //                 setAuthUser(auth);  // Zapisz instancję autoryzacji dla użytkownika
    //             });

    //             //gapi.signin2.
    //             gapi.auth2.init({
    //                 client_id: CLIENT_ID_ADMIN,
    //                 scope: 'profile email',
    //             }).then((auth) => {
    //                 console.log("tuuuuuuuuuuuuuuu");
    //                 console.log(auth);
    //                 setAuthAdmin(auth);  // Zapisz instancję autoryzacji dla admina
    //             });
    //         });

    //         // await gapi.load('client:auth2', () => {
    //         //     gapi.auth2.init({
    //         //         client_id: CLIENT_ID_ADMIN,
    //         //         scope: 'profile email',
    //         //     }).then((auth) => {
    //         //         console.log("tuuuuuuuuuuuuuuu");
    //         //         console.log(auth);
    //         //         setAuthAdmin(auth);  // Zapisz instancję autoryzacji dla admina
    //         //     });
    //         // });
    //     };

    //     initAuthClients();
    // }, []);

    // const loginAsAdmin = () => {
    //     if (authAdmin) {
    //         authAdmin.signIn().then((user) => {
    //             console.log('Admin logged in:', user);
    //         }).catch((error) => {
    //             console.error('Admin login failed:', error);
    //         });
    //     }
    // };

    // const loginAsUser = () => {
    //     if (authUser) {
    //         authUser.signIn().then((user) => {
    //             console.log('User logged in:', user);
    //         }).catch((error) => {
    //             console.error('User login failed:', error);
    //         });
    //     }
    // };

    // const logout = () => {
    //     const authInstance = gapi.auth2.getAuthInstance();
    //     if (authInstance) {
    //         authInstance.signOut().then(() => {
    //             console.log('User logged out');
    //         });
    //     }
    // };


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
                    <Button className="login-button" variant="outline-light" onClick={() => { handleLogin(true) }}>Zaloguj</Button>
                    {/* <Button className="login-button" variant="outline-light" onClick={() => { handleLogin(true) }}>Admin</Button> */}
                </>
            )
        } else if (dataTheme === "light") {
            return (
                <>
                    <Button className="login-button" variant="outline-dark" onClick={() => { handleLogin(true) }}>Zaloguj</Button>
                    {/* <Button className="login-button" variant="outline-dark" onClick={() => { handleLogin(true) }}>Admin</Button> */}
                </>
            )
        }
        return null;
    }
};