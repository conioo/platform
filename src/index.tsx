import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { LoaderFunction, Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import ErrorPage from './components/ErrorPage';
import NoAuthorization from './components/NoAuthorization';
import FileBrowser, { loader as fileBrowserLoader } from './containers/FileBrowser';
import Hub, { loader as hubLoader } from './containers/Hub';
import ModifyFolder, { loader as modifyFolderLoader } from './containers/ModifyFolder';
import ModifyModule, { loader as modifyModuleLoader } from './containers/ModifyModule';
import Record, { loader as recordLoader } from './containers/Record';
import View, { loader as viewLoader } from './containers/View';
import './css/index.css';
import store from './redux/store';
import Paths from './router/Paths';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createHashRouter([
  {
    path: Paths.hub,
    element: <Hub></Hub>,
    loader: hubLoader as LoaderFunction,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: Paths.browser,
        loader: fileBrowserLoader,
        element: <FileBrowser></FileBrowser>
      },
      {
        path: Paths.record,
        loader: recordLoader,
        element: <Record></Record>
      },
      {
        path: Paths.view,
        element: <View></View>,
        loader: viewLoader,
      },
      {
        path: Paths.modify,
        loader: modifyModuleLoader,
        element: <ModifyModule></ModifyModule>,
      },
      {
        path: Paths.modifyFolder,
        loader: modifyFolderLoader,
        element: <ModifyFolder></ModifyFolder>
      },
      {
        path: Paths.noAuthorization,
        element: <NoAuthorization></NoAuthorization>
      }
    ]
  },
  {
    path: "/",
    element: <Navigate to="/en/browser/home"></Navigate>,
  }
]);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.Fragment>
);