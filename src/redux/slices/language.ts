import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import Language from '../../types/Language';

class LanguageState {
    language: Language = Language.English;
    isEasySpeech: boolean = false;
    englishVoices?: Array<SpeechSynthesisVoice>;
    germanVoices?: Array<SpeechSynthesisVoice>;
    spanishVoices?: Array<SpeechSynthesisVoice>;
}

export const languageSlice = createSlice({
    name: 'language',
    initialState: new LanguageState(),
    reducers: {
        setLanguage: {
            reducer(state, action: PayloadAction<Language>) {
                return { ...state, language: action.payload };
            },
            prepare(language: Language) {
                return {
                    payload: language
                }
            }
        },
        setEnglishVoices: {
            reducer(state, action: PayloadAction<Array<SpeechSynthesisVoice>>) {
                return { ...state, englishVoices: action.payload };
            },
            prepare(voices: Array<SpeechSynthesisVoice>) {
                return {
                    payload: voices
                }
            }
        },
        setGermanVoices: {
            reducer(state, action: PayloadAction<Array<SpeechSynthesisVoice>>) {
                return { ...state, germanVoices: action.payload };
            },
            prepare(voices: Array<SpeechSynthesisVoice>) {
                return {
                    payload: voices
                }
            }
        },
        setSpanishVoices: {
            reducer(state, action: PayloadAction<Array<SpeechSynthesisVoice>>) {
                return { ...state, spanishVoices: action.payload };
            },
            prepare(voices: Array<SpeechSynthesisVoice>) {
                return {
                    payload: voices
                }
            }
        },
        setIsEasySpeech: {
            reducer(state, action: PayloadAction<boolean>) {
                return { ...state, isEasySpeech: action.payload };
            },
            prepare(isEasySpeech: boolean) {
                return {
                    payload: isEasySpeech
                }
            }
        }
    },
})

export const { setLanguage, setEnglishVoices, setGermanVoices, setSpanishVoices, setIsEasySpeech } = languageSlice.actions

export const selectLanguage = (state: RootState) => state.language.language;
export const selectBasePath = (state: RootState) => "/" + state.language.language;
export const selectEnglishVoices = (state: RootState) => state.language.englishVoices
export const selectGermanVoices = (state: RootState) => state.language.germanVoices;
export const selectSpanishVoices = (state: RootState) => state.language.spanishVoices;
export const selectLanguageState = (state: RootState) => state.language;
export const selectIsEasySpeech = (state: RootState) => state.language.isEasySpeech;

export default languageSlice.reducer