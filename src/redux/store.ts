import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import authenticationReducer from './slices/authentication';
import languageReducer from './slices/language';
import moduleReducer from './slices/module';

const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        language: languageReducer,
        module: moduleReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;