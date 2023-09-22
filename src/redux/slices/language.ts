import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import Language from '../../types/Language';

class LanguageState {
    language: Language = Language.English;
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
        }
    },
})

export const { setLanguage } = languageSlice.actions

export const selectLanguage = (state: RootState) => state.language.language;

export default languageSlice.reducer