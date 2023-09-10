import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FileBrowser from "./FileBrowser";
import State from "../models/State";
import Action from "../types/Action";

interface RouterProps {
    state: State,
    dispatch: React.Dispatch<Action>
}

export default function Router({ state, dispatch }: RouterProps) {
    console.log("Router");

    const router = createBrowserRouter([
        {
            path: "/",
            element: <FileBrowser dispath={dispatch} state={state}></FileBrowser>,
        },
        {
            path: "/view",
        }
    ],
        {
            basename: "/platform"
        });

    return (
        <RouterProvider router={router} />
    );
}