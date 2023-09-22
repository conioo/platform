import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class ModuleState {
    currentParentFolderId: string = "";
}

export const moduleSlice = createSlice({
    name: 'module',
    initialState: new ModuleState(),
    reducers: {
        setParentFolderId: (state, action) => {
            return { ...state, currentParentFolderId: action.payload };
        }
    },
})

export const { setParentFolderId } = moduleSlice.actions;

export const selectCurrentParentFolderId = (state: RootState) => state.module.currentParentFolderId;

export default moduleSlice.reducer