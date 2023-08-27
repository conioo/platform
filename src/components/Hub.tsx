import FileBrowser from './FileBrowser';
import Record from './Record';
import View from './View';
import '../css/Hub.css'
import { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";
import { Tokens } from "../models/Tokens";
import { State } from '../models/State';
import reducer from '../reducer';
import LoginPart from './LoginPart';
import ActionType from '../types/ActionType';
import ModifyFile from './ModifyFile';
// import { GoogleLogin } from '../services/GoogleDriveApiService';

export default function Hub() {
    console.log("Hub");
    const [state, dispath] = useReducer(reducer, new State());

    useEffect(() => { if (state.isLogging) { login(); } }, [state.isLogging]);

    let isFileBrowser = false;

    return (
        <>
            <header>
                {/* <LoginPart state={state} dispath={dispath} ></LoginPart> */}
                {/* <button onClick={() => {GoogleLogin()}}></button> */}
            </header>

            <section className='sections-container'>
                <section className='left-section'>
                </section>

                <section className='main-section'>
                    {
                        (state.fileNameToView && <View dispath={dispath} state={state} ></View>) ||
                        (state.isRecord && <Record dispath={dispath} state={state}></Record>) ||
                        (state.fileNameToModify && <ModifyFile dispath={dispath} state={state}></ModifyFile>) ||
                        (isFileBrowser = true, <FileBrowser dispath={dispath} state={state}></FileBrowser>)
                    }
                </section>

                <section className='right-section'>
                    {!isFileBrowser && <button className='return-button' onClick={() => { dispath({ type: ActionType.Return }) }}>Powrót</button> }
                </section>
            </section>

            <footer></footer>
        </>
    );


    async function login() {
        console.log("login");

        const partOfToken = "github_pat_11AYN4LWY0Uayj0vvgPDwI_op26AoI3deV8UhcJJ2V9HpKaGf4gzw9vs4dMT69cLtI3CDFNECRqiJ";

        let backPartOfToken = (document.getElementById("login-input") as HTMLInputElement).value;

        if (backPartOfToken.length <= 0) {
            return;
        }

        const tokenToCheck = partOfToken + backPartOfToken;

        try {
            const responseUser = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${tokenToCheck}`,
                },
            });

            if (responseUser.status !== 200) {
                alert("nieprawidlowe dane logowania")
                throw "nieprawidłowe hasło";
            }

            const path = "Secrets/trans.json";

            const octokit = new Octokit({
                auth: tokenToCheck,
                baseUrl: "https://api.github.com",
            });

            const response = await octokit.repos.getContent({
                owner: state.octokitInfo.owner,
                repo: state.octokitInfo.privateRepoName,
                path,
            }) as any;

            let fileContent = Buffer.from(response.data.content, "base64").toString();

            let tokensInfo: Tokens = JSON.parse(fileContent);

            tokensInfo.gitPrivate = tokenToCheck;


            dispath({ type: ActionType.Login, payload: tokensInfo })
        }
        catch (error) {
            console.error('Błąd zapytania do GitHub API:', error);
        }
    }
}