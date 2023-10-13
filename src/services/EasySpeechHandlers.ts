import EasySpeech from "easy-speech";
import Language from "../types/Language";
import { EnglishVoices } from "../types/EnglishVoices";
import { GermanVoices } from "../types/GermanVoices";

export async function EasySpeechInit() {
    let success = await EasySpeech.init({ maxTimeout: 5000, interval: 250 });

    if (!success) {
        console.log("no loaded easy speech");
    }

    //await ChangeVoice(store.getState().language.language);
}

export async function ChangeVoice(language: Language, voiceType: number, rate: number = 1) {
    let voices = EasySpeech.voices();

    if (voices.length === 0) {
        console.log("any voices detected");
        return;
    }

    let defaultVoice: SpeechSynthesisVoice;

    if (language === Language.English) {
        let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === EnglishVoices[voiceType]);
        if (!voice) {
            voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang === "en-GB" || voice.lang === "en_GB"));
            if (!voice) {
                voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang.includes("en")));
                if (!voice) {
                    return;
                }
            }
        }
        defaultVoice = voice;
    }
    else {
        let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === GermanVoices[voiceType]);
        if (!voice) {
            voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang === "de-DE" || voice.lang === "de_DE"));

            if (!voice) {
                voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang.includes("de")));
                if (!voice) {
                    return;
                }
            }
        }
        defaultVoice = voice;
    }

    EasySpeech.defaults({ voice: defaultVoice, rate });
}

export async function ChangeVoiceRate(rate: number) {
    EasySpeech.defaults({rate });
}