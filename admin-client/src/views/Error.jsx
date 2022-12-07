import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="h-full w-full flex-col align-items-center justify-content-center">
      <div className="text-center p-5">
        <i className="pi pi-times-circle text-5xl text-gray-500"></i>
        <h1 className="text-center text-gray-500">Oops!</h1>
        <p className="text-center text-gray-500">Sorry, an unexpected error has occurred.</p>
        <p className="text-center text-gray-500">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
