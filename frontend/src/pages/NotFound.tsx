import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-display text-8xl font-semibold tabular-nums text-border">404</p>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Page Not Found
      </h1>

      <p className="mt-2 max-w-md text-ink-soft">
        Sorry, the page you're looking for doesn't exist or may have been
        moved.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-dark"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;