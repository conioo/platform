import { useRouteError } from "react-router-dom";

export default function ErrorPage() {

    const error = useRouteError() as any;
    console.log(error);

    return <div>something went wrong</div>
}