import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="h-full w-full flex-col align-items-center justify-content-center">
      <div className="text-center pt-8">
        <i className="pi pi-times-circle text-8xl text-500"></i>
        <h1 className="text-center text-5xl text-500">Error</h1>
        <p className="text-center text-4xl text-500">Something went wrong :(</p>
        <p className="text-center text-xl text-red-300">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
