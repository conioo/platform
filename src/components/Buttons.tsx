import React, { useState, useEffect, useRef } from 'react';
import '../css/Buttons.css';
import { Segment } from '../models/Segment';
import axios from 'axios';
import { Buffer } from "buffer";
import { State } from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import AudioControl from './AudioControl';
import AudioInfo from '../models/AudioInfo';
import ManagementAudio from '../services/ManagementAudio';
//import SpeechSynthesisRecorder from '../services/SpeechSynthesisRecorder';

interface ButtonsProps {
    textAreaValue: string;
    dispath: React.Dispatch<Action>;
    state: State;
}

export default function Buttons({ textAreaValue, dispath, state }: ButtonsProps) {
    console.log("Buttons");
    const [segmentsData, setSegmentsData] = useState<Array<Segment>>(new Array<Segment>(0));
    const [isSaving, setIsSaving] = useState(false);
    // const [audioData, setAudioData] = useState<Array<Blob> | null>(null);
    // const [isGenerateAudio, setIsGenerateAudio] = useState(false);

    useEffect(() => {
        GenerateSegmentsDataFromString(textAreaValue).then(newSegmentData => setSegmentsData(newSegmentData));
    }, [textAreaValue]);

    // if (isGenerateAudio) {
    //     GenerateAudio();//async, useeffect
    // }

    if (isSaving === true) {
        saveFile().then(() => {
            dispath({ type: ActionType.Return});
        }).catch(exception => console.log(exception));
    }

    let managementAudio = new ManagementAudio();

    const segments = segmentsData.map((segment: Segment, index: number) => {

        return (
            <>
                <span id={index.toString() + "e"} key={Math.random()} className='span-segment' defaultValue={segment.word}>{segment.word}</span>
                <span contentEditable={true} suppressContentEditableWarning={true} id={index.toString() + "p"} key={Math.random()} className='span-segment'>{segment.meaning}</span>
                {/* <div className='audio-segment' key={Math.random()}>
                    <audio controls key={segment.pathToVoice} >
                        <source id={index.toString() + "src"} src={segment.pathToVoice ? segment.pathToVoice : ""} type="audio/mpeg" />
                        Twoja przeglądarka nie obsługuje elementu audio.
                    </audio>
                </div> */}
                <AudioControl text={segment.word} managementAudio={managementAudio} key={Math.random()}></AudioControl>
            </>
        );
    });

    return (
        <>
            <section className='segments'>
                {segments}
            </section>

            {/* <div>
                <button className='generate-audio-button' onClick={GenerateAudio}>Wygeneruj Audio</button>
                {isGenerateAudio && <span>Generowanie...</span>}
            </div> */}

            <section className="save-section">
                Nazwa pliku: <input type='text' id='fileName'></input>
                <button className='save-button' onClick={() => { setIsSaving(true) }}>Zapisz</button>
                {isSaving && <span>Zapisywanie...</span>}
            </section>
        </>
    );

    async function GenerateSegmentsDataFromString(stringData: string): Promise<Array<Segment>> {
        const sentences = stringData.split('\n');

        const translations = await TranslateSentences(sentences);

        let result = new Array<Segment>(sentences.length);

        for (let i: number = 0; i < sentences.length; ++i) {
            result[i] = new Segment(sentences[i], translations[i]);
        }

        return result;
    }

    // async function GenerateAudio() {
    //     //zmieniać tylko zapisane

    //     let newSegmentsData = new Array<Segment>();

    //     for (let i: number = 0; i < segmentsData.length; ++i) {
    //         let sentence = (document.getElementById(i.toString() + "e") as HTMLInputElement).value;
    //         let meaning = (document.getElementById(i.toString() + "p") as HTMLInputElement).value;

    //         newSegmentsData.push(new Segment(sentence, meaning));
    //     }

    //     let blobs = new Array<Blob>();

    //     let mainCounter = 0;

    //     for (let i: number = 0; mainCounter < newSegmentsData.length; ++i) {
    //         let sendRequests = new Array<Promise<Blob>>();

    //         for (let j: number = 0; j < 30; ++j) {
    //             sendRequests.push(SendRequestForSpeech(newSegmentsData[j].word));
    //             ++mainCounter;

    //             if (mainCounter == newSegmentsData.length) {
    //                 break;
    //             }
    //         }

    //         let blobsResult = await Promise.all(sendRequests);

    //         blobs = blobs.concat(blobsResult);

    //         if (mainCounter < newSegmentsData.length) {
    //             await oneSecond();
    //         }
    //     }

    //     function oneSecond(): Promise<void> {
    //         return new Promise<void>((resolve) => setTimeout(resolve, 1050));
    //     }

    //     for (let i: number = 0; i < newSegmentsData.length; ++i) {
    //         newSegmentsData[i].pathToVoice = URL.createObjectURL(blobs[i]);
    //     }

    //     setSegmentsData(newSegmentsData);
    //     setAudioData(blobs);
    //     setIsGenerateAudio(false);
    // }

    async function SendRequestForSpeech(text: string): Promise<Blob> {
        const options = {
            method: 'GET',
            url: 'https://text-to-speech-api3.p.rapidapi.com/speak',
            params: {
                text: text,
                lang: 'en',
            },
            headers: {
                'X-RapidAPI-Key': state.tokens.speech,
                'X-RapidAPI-Host': 'text-to-speech-api3.p.rapidapi.com'
            },
            responseType: 'arraybuffer'
        } as any;

        try {
            const audiobufferToBlob = require('audiobuffer-to-blob');

            const response = await axios.request(options);
            const ctx = new AudioContext();
            const decode = await ctx.decodeAudioData(response.data);
            const blob = audiobufferToBlob(decode);

            return new Promise<Blob>((resolve, reject) => { resolve(blob) });
        } catch (error) {
            console.error(error);
            return new Promise<Blob>((resolve, reject) => { reject(error) });
        }
    }

    async function saveFile() {
        console.log("zapisujemy");
        // katalog{nazwa pliku}, json z segmentami, katalog voices z audio

        let fileName = (document.getElementById("fileName") as HTMLInputElement).value;

        // if (audioData == null) {
        //     return;
        // }

        if (fileName.length == 0) {
            setIsSaving(false)
            alert("brak nazwy pliku");
            throw "missing name";
        }

        const basePath = state.recordDestinationPath + `/${fileName}/`;
        const basePathForAudio = `${basePath}audio/`;

        let newSegmentsData = segmentsData.slice();

        try {
            // for (let i: number = 0; i < segmentsData.length; ++i) {
            //     await saveFileToGithub(basePathForAudio + `${i}.mp3`, audioData[i]);
            //     newSegmentsData[i].pathToVoice = `https://raw.githubusercontent.com/miandrop/data-public/main/${basePathForAudio}${i}.mp3`;
            // }
            console.log(basePath);

            await saveFileToGithub(basePath + "segments.json", newSegmentsData);

            console.log("zapisano wszystko");

        } catch (error: any) {
            console.error("Wystąpił błąd:", error);
        }
    }

    async function TranslateSentences(sentences: Array<string>): Promise<Array<string>> {
        const sourceLanguage = 'en';
        const targetLanguage = 'pl';

        const request = require('sync-request');
        const baseApiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${state.tokens.deepl}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`;

        let mainCounter = 0;
        let resultArray: Array<string> = new Array<string>();

        try {

            for (let i: number = 0; mainCounter < sentences.length; ++i) {
                let apiUrl = baseApiUrl;

                for (let j: number = 0; j < 50; ++j) {
                    apiUrl += "&text=" + sentences[mainCounter];
                    ++mainCounter;

                    if (mainCounter == sentences.length) {
                        break;
                    }
                }

                const response = request('POST', apiUrl);
                console.log(response);

                const responseBody = JSON.parse(response.getBody('utf8'));

                const responseTranslations = responseBody.translations.map((translation: any) => translation.text) as Array<string>;

                resultArray = resultArray.concat(responseTranslations);
            }

            return resultArray;
        } catch (error: any) {
            return ['Error: ' + error.message];
        }
    }

    async function blobToBase64Async(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onerror = (e) => reject(fileReader.error);
            fileReader.onloadend = (e) => {
                const dataUrl = fileReader.result as string;
                // remove "data:mime/type;base64," prefix from data url
                const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
                resolve(base64);
            };
            fileReader.readAsDataURL(blob);
        });
    }

    async function saveFileToGithub(filePath: string, fileContent: any): Promise<any> {
        let stringContent: string;

        if (fileContent instanceof Blob) {
            stringContent = await blobToBase64Async(fileContent);
        }
        else {
            stringContent = Buffer.from(JSON.stringify(fileContent)).toString('base64');
        }

        try {
            await state.octokitInfo.octokitPublic.repos.createOrUpdateFileContents({
                owner: state.octokitInfo.owner,
                repo: state.octokitInfo.publicRepoName,
                path: filePath,
                message: `${Math.random()} ${filePath}`,
                content: stringContent,
                // headers: {
                //     'Content-Type': 'audio/mp3',
                // },
            });
        }
        catch (error) {
            console.error('Wystąpił błąd podczas zapisywania pliku:', error);
        }
    }
}

// function setValueForButton(button: HTMLButtonElement | null, value: string | null) {
//     if (button == null || value == null) {
//         return;
//     }
//     button.innerHTML = value;
//     button.classList.toggle('onmouse');
// }

// function getWidthFromtext(text: string) {
//     var canvas = document.createElement("canvas");
//     var context = canvas.getContext("2d");
//     if (context == null) {
//         return;
//     }
//     context.font = "16px Arial";
//     let sum = 0;

//     for (let i = 0; i < text.length; ++i) {
//         sum += context.measureText(text[i]).width;
//     }
//     return sum + 15;
// }