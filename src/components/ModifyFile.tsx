import React, { useState, useEffect } from 'react';
import '../css/Buttons.css';
import '../css/ModifyFile.css';
import Segment from '../models/Segment';
import State from '../models/State';
import Action from '../types/Action';
import { getModule, removeModule } from '../google/GoogleDriveService';
import ActionType from '../types/ActionType';

interface ModifyFile {
    dispath: React.Dispatch<Action>;
    state: State;
}

export default function ModifyFile({ state, dispath }: ModifyFile) {
    console.log("ModifyFile");
    return null;
}

//     const [segmentsData, setSegmentsData] = useState<Array<Segment>>(new Array<Segment>(0));
//     const [isRemovingModule, setIsRemovingModule] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);

//     if (isRemovingModule && state.fileToModify) {
//         removeModule(state.fileToModify?.id).then(() => {
//             dispath({ type: ActionType.Return });
//             setIsSaving(false);
//         }).catch(exception => console.log(exception));
//     }

//     useEffect(() => {
//         if (state.fileToModify) {
//             getModule(state.fileToModify.id).then(segmentsData => {
//                 if (segmentsData) {
//                     setSegmentsData(segmentsData);
//                 }
//             });
//         }
//     }, [state.fileToModify]);

//     if (isSaving === true) {
//         //zapisac o tutaj
//     }

//     let managementAudio = new ManagementAudio();

//     const segments = segmentsData.map((segment: Segment, index: number) => {
//         return (
//             <>
//                 <span contentEditable={true} suppressContentEditableWarning={true} id={index.toString() + "e"} key={Math.random()} className='span-segment' defaultValue={segment.word}>{segment.word}</span>
//                 <span contentEditable={true} suppressContentEditableWarning={true} id={index.toString() + "p"} key={Math.random()} className='span-segment'>{segment.meaning}</span>
//                 <AudioControl state={state} text={segment.word} managementAudio={managementAudio} key={Math.random()}></AudioControl>
//             </>
//         );
//     });

//     return (
//         <>
//             <h2 className='modify-filename'>{state.fileToModify?.name}</h2>

//             <div>
//                 <button className='remove-file-button' onClick={() => setIsRemovingModule(true)}>Usuń plik</button>
//                 {isRemovingModule && <span>Usuwanie...</span>}
//             </div>

//             <section className="segments">
//                 {segments}
//             </section>

//             <section className="save-section">
//                 Nazwa pliku: <input type='text' id='fileName' defaultValue={state.fileToModify?.name}></input>
//                 <button onClick={() => { setIsSaving(true) }}>Zapisz</button>
//                 {isSaving && <span>Zapisywanie...</span>}
//             </section>
//         </>
//     );

//     function getupdateSegmentsData(): Array<Segment> {

//         let newSegmentsData = segmentsData.slice();

//         for (let i = 0; i < segmentsData.length; ++i) {
//             let spanElement = document.getElementById(i + "p") as HTMLSpanElement;

//             if(spanElement.textContent)
//             {
//                newSegmentsData[i].meaning = spanElement.textContent;
//             }
//             else{
//                 newSegmentsData[i].meaning = "";
//             }
//         }

//         return newSegmentsData;
//     }
// }

// //     async function GenerateAudio() {
// //         //zmieniać tylko zapisan

// //         let newSegmentsData = new Array<Segment>();

// //         for (let i: number = 0; i < segmentsData.length; ++i) {
// //             let sentence = (document.getElementById(i.toString() + "e") as HTMLInputElement).value;
// //             let meaning = (document.getElementById(i.toString() + "p") as HTMLInputElement).value;

// //             newSegmentsData.push(new Segment(sentence, meaning));
// //         }

// //         let blobs = new Array<Blob>();

// //         let mainCounter = 0;

// //         for (let i: number = 0; mainCounter < newSegmentsData.length; ++i) {
// //             let sendRequests = new Array<Promise<Blob>>();

// //             for (let j: number = 0; j < 30; ++j) {
// //                 sendRequests.push(SendRequestForSpeech(newSegmentsData[j].word));
// //                 ++mainCounter;

// //                 if (mainCounter == newSegmentsData.length) {
// //                     break;
// //                 }
// //             }

// //             let blobsResult = await Promise.all(sendRequests);

// //             blobs = blobs.concat(blobsResult);

// //             if (mainCounter < newSegmentsData.length) {
// //                 await oneSecond();
// //             }
// //         }

// //         function oneSecond(): Promise<void> {
// //             return new Promise<void>((resolve) => setTimeout(resolve, 1050));
// //         }

// //         for (let i: number = 0; i < newSegmentsData.length; ++i) {
// //             newSegmentsData[i].pathToVoice = URL.createObjectURL(blobs[i]);
// //         }

// //         setSegmentsData(newSegmentsData);
// //         setAudioData(blobs);
// //         setIsGenerateAudio(false);
// //     }

// //     async function SendRequestForSpeech(text: string): Promise<Blob> {
// //         const options = {
// //             method: 'GET',
// //             url: 'https://text-to-speech-api3.p.rapidapi.com/speak',
// //             params: {
// //                 text: text,
// //                 lang: 'en',
// //             },
// //             headers: {
// //                 'X-RapidAPI-Key': state.tokens.speech,
// //                 'X-RapidAPI-Host': 'text-to-speech-api3.p.rapidapi.com'
// //             },
// //             responseType: 'arraybuffer'
// //         } as any;

// //         try {
// //             const audiobufferToBlob = require('audiobuffer-to-blob');

// //             const response = await axios.request(options);
// //             const ctx = new AudioContext();
// //             const decode = await ctx.decodeAudioData(response.data);
// //             const blob = audiobufferToBlob(decode);

// //             return new Promise<Blob>((resolve, reject) => { resolve(blob) });
// //         } catch (error) {
// //             console.error(error);
// //             return new Promise<Blob>((resolve, reject) => { reject(error) });
// //         }
// //     }

// //     async function saveFile() {
// //         console.log("zapisujemy");
// //         // katalog{nazwa pliku}, json z segmentami, katalog voices z audio

// //         //dispath({type: ActionType.ReturnFromRecord});

// //         let fileName = (document.getElementById("fileName") as HTMLInputElement).value;

// //         if (audioData == null) {
// //             return;
// //         }

// //         if (fileName.length == 0) {
// //             alert("brak nazwy pliku");
// //             throw "missing name";
// //         }

// //         const basePath = `data/${fileName}/`;
// //         const basePathForAudio = `${basePath}audio/`;

// //         let newSegmentsData = segmentsData.slice();

// //         try {
// //             for (let i: number = 0; i < segmentsData.length; ++i) {
// //                 await saveFileToGithub(basePathForAudio + `${i}.mp3`, audioData[i]);
// //                 newSegmentsData[i].pathToVoice = `https://raw.githubusercontent.com/miandrop/data-public/main/${basePathForAudio}${i}.mp3`;
// //             }

// //             await saveFileToGithub(basePath + "segments.json", newSegmentsData);

// //             console.log("zapisano wszystko");

// //         } catch (error: any) {
// //             console.error("Wystąpił błąd:", error);
// //         }

