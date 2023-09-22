import EasySpeech from "easy-speech";
import Language from "../types/Language";
import store from "../redux/store";

export async function EasySpeechInit() {
    let success = await EasySpeech.init({ maxTimeout: 5000, interval: 250 });

    if (!success) {
        console.log("no loaded easy speech");
    }

    await ChangeVoice(store.getState().language.language);
}

export async function ChangeVoice(language: Language) {
    let voices = EasySpeech.voices();

    if (voices.length === 0) {
        console.log("any voices detected");
    }

    let defaultVoice: SpeechSynthesisVoice;

    if (language === Language.English) {
        let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === "Google UK English Male");
        if (!voice) {
            voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang === "en-GB" || voice.lang === "en_GB" || voice.lang.includes("en")));

            if (!voice) {
                voice = voices[0];
            }
        }
        defaultVoice = voice;
    }
    else {
        let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === "Google Deutsch");
        if (!voice) {
            voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang === "de-DE" || voice.lang === "de_DE" || voice.lang.includes("de")));

            if (!voice) {
                voice = voices[0];
            }
        }
        defaultVoice = voice;
    }

    EasySpeech.defaults({ voice: defaultVoice });
}