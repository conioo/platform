import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import authenticationReducer from './slices/authentication';
import languageReducer from './slices/language';
import moduleReducer from './slices/module';
import moduleOptionsReducer from './slices/moduleOptions';
import folderReducer from './slices/folder';
import application from './slices/application';

const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        language: languageReducer,
        module: moduleReducer,
        moduleOptions: moduleOptionsReducer,
        folder: folderReducer,
        application: application
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['your/action/type'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: ['language'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;