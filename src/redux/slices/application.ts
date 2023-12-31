import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class ApplicationState {
    dataTheme: string = "light";
}

export const moduleSlice = createSlice({
    name: 'application',
    initialState: new ApplicationState(),
    reducers: {
        setDataTheme: {
            reducer(state, action: PayloadAction<string>) {
                return { ...state, dataTheme: action.payload };
            },
            prepare(dataTheme: string) {
                return {
                    payload: dataTheme
                }
            }
        },
    },
})

export const {setDataTheme} = moduleSlice.actions;

export const selectDataTheme = (state: RootState) => state.application.dataTheme;

export default moduleSlice.reducer