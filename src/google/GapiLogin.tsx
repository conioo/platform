import './css/GapiLogin.css';
import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import State from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import GoogleSecrets from './GoogleSecrets';
import { getSecrets } from './GoogleDriveService';

interface GapiLoginProps {
  state: State,
  dispath: React.Dispatch<Action>
}

export default function GapiLogin({ state, dispath }: GapiLoginProps) {

  const [reloadGabiEffect, setReloadGabiEffect] = useState(false);

  useEffect(() => {
    handleGapiLoad();
  }, [reloadGabiEffect]);

  const handleGapiLoad = () => {
    gapi.load('client:auth2', initClient);
  };

  const initClient = async () => {
    await gapi.client.init({
      apiKey: GoogleSecrets.API_KEY,
      clientId: GoogleSecrets.GITHUB_CLIENT_ID,
      discoveryDocs: GoogleSecrets.DISCOVERY_DOCS,
      scope: GoogleSecrets.SCOPES,
    });

    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      login();
    }
  };

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      login();
    });
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      logout();
    });
  }

  async function login() {
    let tokens = await getSecrets();

    console.log(tokens);

    dispath({ type: ActionType.Login, payload: tokens?.deepl });
  }

  async function logout() {
    dispath({ type: ActionType.Logout });
  }

  if (state.isLogin) {
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