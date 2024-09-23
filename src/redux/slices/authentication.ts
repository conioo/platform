import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

class AuthenticationState {
    isLogin?: boolean = undefined;
    isAdmin: boolean = false;
    deeplToken?: string = undefined;
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: new AuthenticationState(),
    reducers: {
        login: {
            reducer(state, action: PayloadAction<{ deeplToken: string | undefined, isAdmin: boolean }>) {
                return { ...state, isLogin: true, deeplToken: action.payload.deeplToken, isAdmin: action.payload.isAdmin }
            },
            prepare(deeplToken: string | undefined = undefined, isAdmin: boolean = false) {
                return {
                    payload: { deeplToken, isAdmin },
                }
            }
        },
        logout: (state) => {
            return { ...state, isLogin: false, isAdmin: false }
        },
        setIsLogin: {
            reducer(state, action: PayloadAction<boolean>) {
                if (action.payload) {
                    return { ...state, isLogin: action.payload }

                } else {
                    return { ...state, isLogin: action.payload, isAdmin: false }
                }
            },
            prepare(isLogin: boolean) {
                return {
                    payload: isLogin,
                }
            }
        },
        setIsAdmin: {
            reducer(state, action: PayloadAction<boolean>) {
                return { ...state, isAdmin: action.payload }
            },
            prepare(isAdmin: boolean) {
                return {
                    payload: isAdmin,
                }
            }
        }
    },
})

export const { login, logout, setIsLogin, setIsAdmin } = authenticationSlice.actions

export const selectIsLogin = (state: RootState) => state.authentication.isLogin
export const selectIsAdmin = (state: RootState) => state.authentication.isAdmin
export const selectDeeplToken = (state: RootState) => state.authentication.deeplToken
export const selectAuthentication = (state: RootState) => state.authentication

export default authenticationSlice.reducer