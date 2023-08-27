import '../css/LoginPart.css';
import React, { useState } from 'react';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import { State } from '../models/State';

interface LoginPartProps{
    state: State,
    dispath: React.Dispatch<Action>
}

export default function LoginPart({state, dispath}: LoginPartProps) {
    console.log("LoginPart");

    if (state.isLogin === true) {
        return (
            <div className='login'>
                <button className='logout-button' onClick={() => dispath({type: ActionType.Logout})}>Wyloguj</button>
            </div>
        );
    }
    else{
        return (
            <div className='login'>
                <input type='text' id='login-input'></input>
                <button className='login-button' onClick={() => dispath({type: ActionType.Logging})}>Zaloguj</button>
            </div>
        )
    }
}