import React from 'react';
import ReactDOM from 'react-dom/client';
import Hub from './containers/Hub';
import './css/index.css';
import { BrowserRouter, LoaderFunction, Navigate, RouterProvider, createBrowserRouter, createHashRouter } from "react-router-dom";
import FileBrowser from './containers/FileBrowser';
import { Provider } from 'react-redux';
import store from './redux/store';
import ErrorPage from './components/ErrorPage';
import View, { loader as viewLoader } from './containers/View';
import { loader as hubLoader } from './containers/Hub';
import { loader as fileBrowserLoader } from './containers/FileBrowser';
import ModifyModule, { loader as modifyModuleLoader } from './containers/ModifyModule';
import Paths from './router/Paths';
import Record from './containers/Record';

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
        element: <ModifyModule></ModifyModule>
      }
    ]
  },
  {
    path: "/",
    element: <Navigate to="/en/browser/home"></Navigate>,
  }
],
  {
    // basename: "/platform"
  });

root.render(
  <React.Fragment>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.Fragment>
);