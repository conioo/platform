import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface moduleInfoToCopy {
    moduleId: string;
    moduleName: string;
}

class ModuleState {
    currentParentFolderId: string = "";
    moduleIdToMove: string | null = null;
    moduleInfoToCopy: moduleInfoToCopy | null = null;
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
        setModuleInfoToCopy: {
            reducer(state, action: PayloadAction<moduleInfoToCopy | null>) {
                return { ...state, moduleInfoToCopy: action.payload };
            },
            prepare(moduleInfo: moduleInfoToCopy | null) {
                return {
                    payload: moduleInfo
                }
            }
        }
    },
})

export const { setParentFolderId, setModuleIdToMove, setModuleInfoToCopy } = moduleSlice.actions;

export const selectCurrentParentFolderId = (state: RootState) => state.module.currentParentFolderId;
export const selectModuleIdToMove = (state: RootState) => state.module.moduleIdToMove;
export const selectModuleInfoToCopy = (state: RootState) => state.module.moduleInfoToCopy;

export default moduleSlice.reducer