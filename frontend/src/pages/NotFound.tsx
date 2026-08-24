import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-bold text-gray-200">404</p>

      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Page Not Found
      </h1>

      <p className="mt-2 max-w-md text-gray-500">
        Sorry, the page you're looking for doesn't exist or may have been
        moved.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;