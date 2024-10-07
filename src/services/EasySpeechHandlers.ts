import EasySpeech from "easy-speech";
import store from "../redux/store";
import { selectIsEasySpeech, setEnglishVoices, setGermanVoices, setIsEasySpeech, setSpanishVoices } from "../redux/slices/language";
import { useEasySpeechType } from "../hooks/EasySpeech";
import AudioInfo from "../models/AudioInfo";
import { useSelector } from "react-redux";
import { bool, boolean } from "yup";

export async function EasySpeechInit() {
    try {
        let success = await EasySpeech.init({ maxTimeout: 5000, interval: 250 });

        if (!success) {
            console.log("no loaded easy speech");
            return;
        }

        let voices = EasySpeech.voices();

        let english = new Array<SpeechSynthesisVoice>();
        let german = new Array<SpeechSynthesisVoice>();
        let spanish = new Array<SpeechSynthesisVoice>();

        for (let i = 0; i < voices.length; ++i) {
            if (voices[i].lang.includes("en")) {
                english.push(voices[i]);
            }

            if (voices[i].lang.includes("de")) {
                german.push(voices[i]);
            }

            if (voices[i].lang.includes("es")) {
                spanish.push(voices[i]);
            }
        }

        if (english.length > 0) {
            store.dispatch(setEnglishVoices(english));
        }

        if (german.length > 0) {
            store.dispatch(setGermanVoices(german));
        }

        if (spanish.length > 0) {
            store.dispatch(setSpanishVoices(spanish));
        }

        store.dispatch(setIsEasySpeech(true));
    }
    catch (error) {
        console.log(error);
    }
}

export default async function ChangeVoice(voiceName: string) {
    let voices = EasySpeech.voices();

    if (voices.length === 0) {
        console.log("any voices detected");
        return;
    }

    let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === voiceName);

    if (!voice) {
        console.log(`voice ${voiceName} not found`);
        return;
    }

    EasySpeech.defaults({ voice });
    //console.log(voice);
}

export async function ChangeVoiceRate(rate: number) {
    //updatePlaybackRateForAllAudio(rate);
    EasySpeech.defaults({ rate });
}

export function UpdatePlaybackRateForAllAudio(rate: number) {
    const audios = document.querySelectorAll<HTMLAudioElement>("audio");
    audios.forEach(audio => {
        audio.playbackRate = rate;
    });
};

export function getEasySpeech(): useEasySpeechType {

    let audioInfoArray = new Array<AudioInfo>();
    let isFullMode: boolean = false;
    let isFullPause = false;
    let audioInfoFullIndex = 0;

    const addAudioInfo = (audioInfo: AudioInfo): void => {
        audioInfoArray.push(audioInfo);
    };

    const resetState = () => {
        reset();
        var fullAduioInfo = audioInfoArray.find(o => o.id === -1);

        audioInfoArray = new Array<AudioInfo>();

        if (fullAduioInfo) {
            audioInfoArray.push(fullAduioInfo);
        }
        else {
            console.log("error no full audio in audioInfoArray");
        }
    }

    const playAllAudio = (): void => {
        console.log("play allllllllll");

        audioInfoArray.sort((a, b) => a.id - b.id);
        //reset();

        //console.log(audioInfoArray);

        if (isFullMode) {
            if (isFullPause) {
                isFullPause = false;
                audioInfoArray[0].audioButton.current?.classList.remove("bi-play-fill");
                audioInfoArray[0].audioButton.current?.classList.add("bi-pause-fill");
                audioInfoArray[0].isSpeaking = true;

                playNextAudio(audioInfoFullIndex);
            }
            else {
                reset();
                isFullPause = true;
                audioInfoArray[0].audioButton.current?.classList.add("bi-play-fill");
                audioInfoArray[0].audioButton.current?.classList.remove("bi-pause-fill");
            }
        }
        else {
            audioInfoFullIndex = 1;
            isFullMode = true;
            audioInfoArray[0].audioButton.current?.classList.remove("bi-play-fill");
            audioInfoArray[0].audioButton.current?.classList.add("bi-pause-fill");
            audioInfoArray[0].isSpeaking = true;

            playNextAudio(audioInfoFullIndex);
        }

        //ascending sort
        return

        // for (let i = 0; i < audioInfoArray.length; ++i) {
        //     //audioInfoArray[i].audioElement?.current?.play();
        //     //audioInfoArray[i].audioElement?.current?.onended
        //     if (audioInfoArray[i].id !== 1) {

        //     }
        // }
    }

    const playNextAudio = (idx: number): void => {
        //console.log(audioInfoArray[idx]);

        audioInfoArray[idx].isSpeaking = true;
        audioInfoArray[idx].audioButton.current?.classList.remove("bi-play-fill");
        audioInfoArray[idx].audioButton.current?.classList.add("bi-pause-fill");

        audioInfoArray[idx].audioElement?.current?.play();
    }

    const stopAllAudio = (): void => {


    }

    const updateAudioInfo = (audioInfo: AudioInfo): void => {
        console.log(audioInfo);

        console.log("update");
        //console.log(audioInfoArray);

        const index = audioInfoArray.findIndex(item => item.id === audioInfo.id);

        console.log(index);
        if (index === -1) {
            addAudioInfo(audioInfo);
            return;
        }

        audioInfoArray[index] = audioInfo;

        console.log(audioInfoArray);
    }

    //const isEasySpeech = useSelector(selectIsEasySpeech);
    //console.log(isEasySpeech);

    const onStart = () => {
        if (isFullMode) {

        }
    }

    const onEnd = () => {
        if (isFullMode) {
            audioInfoArray[audioInfoFullIndex].audioButton.current?.classList.remove("bi-pause-fill");
            audioInfoArray[audioInfoFullIndex].audioButton.current?.classList.add("bi-play-fill");

            audioInfoArray[audioInfoFullIndex].isSpeaking = false;

            ++audioInfoFullIndex;

            if (!isFullPause && audioInfoArray.length > audioInfoFullIndex) {
                setTimeout(() => {
                    playNextAudio(audioInfoFullIndex);
                }, 100);//100 milliseconds delay
            }
            else {
                isFullMode = false;
            }
        }
        else {
            reset();
        }
    }

    const reset = () => {
        //EasySpeech.pause();

        let IsEasySpeech = store.getState().language.isEasySpeech;

        if (IsEasySpeech) {
            EasySpeech.cancel();
        }

        for (let audioInfo of audioInfoArray) {
            if (audioInfo.isSpeaking) {
                audioInfo.audioButton.current?.classList.remove("bi-pause-fill");
                audioInfo.audioButton.current?.classList.add("bi-play-fill");
                audioInfo.isSpeaking = false;

                if (audioInfo.audioElement) {
                    audioInfo.audioElement?.current?.pause();

                    if (audioInfo.audioElement?.current?.currentTime) {
                        audioInfo.audioElement.current.currentTime = 0;
                    }
                }
            }
        }
    };

    const handleEnd = () => {
        //console.log(audioInfoArray);
        reset();
    };

    let IsEasySpeech = store.getState().language.isEasySpeech;
    //do poprawy kiedy nie zdazy do tego momenty zainicjowac EasySpeech to będą błędy(trzeba dodac 3 wartosc)
    if (IsEasySpeech) {
        EasySpeech.on({ end: handleEnd });
    }

    return ({
        addAudioInfo,
        updateAudioInfo,
        reset,
        onStart,
        onEnd,
        stopAllAudio,
        playAllAudio,
        resetState
    });
}