import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import ErrorPage from './components/ErrorPage/ErrorPage';
import NoAuthorization from './components/NoAuthorization';
import FileBrowser, {fileBrowserLoader } from './containers/FileBrowser';
import Hub, { hubLoader } from './containers/Hub';
import ModifyFolder, { modifyFolderLoader } from './containers/ModifyFolder';
import ModifyModule, { modifyModuleLoader } from './containers/ModifyModule';
import Record, { recordLoader } from './containers/Record';
import View, { viewLoader } from './containers/View';
import store from './redux/store';
import Paths from './router/Paths';
// import './styles/main.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createHashRouter([
  {
    path: Paths.hub,
    element: <Hub></Hub>,
    loader: hubLoader,
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