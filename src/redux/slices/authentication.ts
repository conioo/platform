import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class AuthenticationState {
    isLogin?: boolean = undefined;
    deeplToken: string = "";
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: new AuthenticationState(),
    reducers: {
        login: {
            reducer(state, action: PayloadAction<string>) {
                return { ...state, isLogin: true, deeplToken: action.payload }
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
        setIsLogin: {
            reducer(state, action: PayloadAction<boolean>) {
                return { ...state, isLogin: action.payload}
            },
            prepare(isLogin: boolean) {
                return {
                    payload: isLogin,
                }
            }
        }
    },
})

export const { login, logout, setIsLogin } = authenticationSlice.actions

export const selectIsLogin = (state: RootState) => state.authentication.isLogin
export const selectDeeplToken = (state: RootState) => state.authentication.deeplToken
export const selectAuthentication = (state: RootState) => state.authentication

export default authenticationSlice.reducer