import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="h-full w-full flex-col align-items-center justify-content-center">
      <div className="pt-8 text-center">
        <i className="pi pi-times-circle text-8xl text-500"></i>
        <h1 className="text-5xl text-center text-500">Error</h1>
        <p className="text-4xl text-center text-500">Something went wrong :(</p>
        <p className="text-xl text-center text-red-300">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
