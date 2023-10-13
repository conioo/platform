import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class ModuleOptionsState {
    displayMode: string = "classic";
    playBackSpeed: number = 1;
    isHidden: boolean = true;
}

export const moduleSlice = createSlice({
    name: 'moduleOptions',
    initialState: new ModuleOptionsState(),
    reducers: {
        setDisplayMode: {
            reducer(state, action: PayloadAction<string>) {
                return { ...state, displayMode: action.payload };
            },
            prepare(displayMode: string) {
                return {
                    payload: displayMode
                }
            }
        },
        setPlayBackSpeed: {
            reducer(state, action: PayloadAction<number>) {
                return { ...state, playBackSpeed: action.payload };
            },
            prepare(playBackSpeed: number) {
                return {
                    payload: playBackSpeed
                }
            }
        },
        setIsHidden: {
            reducer(state, action: PayloadAction<boolean>) {
                return { ...state, isHidden: action.payload };
            },
            prepare(isHidden: boolean) {
                return {
                    payload: isHidden
                }
            }
        },
    },
})

export const { setDisplayMode, setPlayBackSpeed, setIsHidden } = moduleSlice.actions;

export const selectDisplayMode = (state: RootState) => state.moduleOptions.displayMode;
export const selectPlayBackSpeed = (state: RootState) => state.moduleOptions.playBackSpeed;
export const selectAllOptions = (state: RootState): ModuleOptionsState => { return ({ playBackSpeed: state.moduleOptions.playBackSpeed, displayMode: state.moduleOptions.displayMode, isHidden: state.moduleOptions.isHidden }); };

export default moduleSlice.reducer