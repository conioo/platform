import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class AuthenticationState {
    isLogin = false;
    deeplToken: string = "";
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: new AuthenticationState(),
    reducers: {
        login: {
            reducer(state, action: PayloadAction<string>){
                return { ...state, isLogin: true, deeplToken: action.payload}
            },
            prepare(deeplToken: string) {
                return {
                    payload: deeplToken,
                }
            }
        },
        logout: (state) => {
            return { ...state, isLogin: false }
        },
    },
})

export const { login, logout } = authenticationSlice.actions

export const selectIsLogin = (state: RootState) => state.authentication.isLogin
export const selectDeeplToken = (state: RootState) => state.authentication.deeplToken
export const selectAuthentication = (state: RootState) => state.authentication

export default authenticationSlice.reducer