import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class ModuleState {
    currentParentFolderId: string = "";
    moduleIdToBeChanged: string | null = null;
}

export const moduleSlice = createSlice({
    name: 'module',
    initialState: new ModuleState(),
    reducers: {
        setParentFolderId: (state, action) => {
            return { ...state, currentParentFolderId: action.payload };
        },
        setModuleIdToBeChanged: {
            reducer(state, action: PayloadAction<string | null>) {
                return { ...state, moduleIdToBeChanged: action.payload };
            },
            prepare(moduleIdToBeChanged: string | null) {
                return {
                    payload: moduleIdToBeChanged
                }
            }
        }
    },
})

export const { setParentFolderId } = moduleSlice.actions;

export const selectCurrentParentFolderId = (state: RootState) => state.module.currentParentFolderId;
export const moduleIdToBeChanged = (state: RootState) => state.module.moduleIdToBeChanged;

export default moduleSlice.reducer