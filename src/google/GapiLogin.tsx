import './css/GapiLogin.css';
import { gapi } from 'gapi-script';
import { useAppSelector } from '../redux/hook';
import { googleLogin, googleLogout } from './services/AuhorizationService';
import { selectIsLogin } from '../redux/slices/authentication';

export default function GapiLogin() {
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
      <div className='login'>
        <button className='logout-button' onClick={handleLogout}>Wyloguj</button>
      </div>
    );
  }
  else {
    return (
      <div className='login'>
        <button className='login-button' onClick={handleLogin}>Zaloguj</button>
      </div>
    )
  }
};