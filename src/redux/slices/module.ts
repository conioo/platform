import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class ModuleState {
    currentParentFolderId: string = "";
    moduleIdToMove: string | null = null;
    moduleIdToCopy: string | null = null;
}

export const moduleSlice = createSlice({
    name: 'module',
    initialState: new ModuleState(),
    reducers: {
        setParentFolderId: (state, action) => {
            return { ...state, currentParentFolderId: action.payload };
        },
        setModuleIdToMove: {
            reducer(state, action: PayloadAction<string | null>) {
                return { ...state, moduleIdToMove: action.payload };
            },
            prepare(moduleId: string | null) {
                return {
                    payload: moduleId
                }
            }
        },
        setModuleIdToCopy: {
            reducer(state, action: PayloadAction<string | null>) {
                return { ...state, moduleIdToCopy: action.payload };
            },
            prepare(moduleId: string | null) {
                return {
                    payload: moduleId
                }
            }
        }
    },
})

export const { setParentFolderId, setModuleIdToMove, setModuleIdToCopy} = moduleSlice.actions;

export const selectCurrentParentFolderId = (state: RootState) => state.module.currentParentFolderId;
export const selectModuleIdToMove = (state: RootState) => state.module.moduleIdToMove;
export const selectModuleIdToCopy = (state: RootState) => state.module.moduleIdToCopy;

export default moduleSlice.reducer