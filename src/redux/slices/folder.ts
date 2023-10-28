import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface folderInfoToCopy {
    folderId: string;
    folderName: string;
}

class FolderState {
    currentParentFolderId: string = "";
    folderIdToMove: string | null = null;
    folderInfoToCopy: folderInfoToCopy | null = null;
}

export const folderSlice = createSlice({
    name: 'folder',
    initialState: new FolderState(),
    reducers: {
        setParentFolderId: (state, action) => {
            return { ...state, currentParentFolderId: action.payload };
        },
        setFolderIdToMove: {
            reducer(state, action: PayloadAction<string | null>) {
                return { ...state, folderIdToMove: action.payload };
            },
            prepare(folderId: string | null) {
                return {
                    payload: folderId
                }
            }
        },
        setFolderInfoToCopy: {
            reducer(state, action: PayloadAction<folderInfoToCopy | null>) {
                return { ...state, folderInfoToCopy: action.payload };
            },
            prepare(folderInfo: folderInfoToCopy | null) {
                return {
                    payload: folderInfo
                }
            }
        }
    },
})

export const { setParentFolderId, setFolderIdToMove, setFolderInfoToCopy } = folderSlice.actions;

export const selectCurrentParentFolderId = (state: RootState) => state.folder.currentParentFolderId;
export const selectfolderIdToMove = (state: RootState) => state.folder.folderIdToMove;
export const selectfolderInfoToCopy = (state: RootState) => state.folder.folderInfoToCopy;

export default folderSlice.reducer