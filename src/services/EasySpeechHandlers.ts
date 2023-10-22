import EasySpeech from "easy-speech";
import store from "../redux/store";
import { setEnglishVoices, setGermanVoices, setSpanishVoices } from "../redux/slices/language";

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
}

export async function ChangeVoiceRate(rate: number) {
    EasySpeech.defaults({ rate });
}