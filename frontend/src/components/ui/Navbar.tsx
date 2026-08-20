import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      {/* Left side */}
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="font-semibold text-gray-800 hover:text-blue-600"
        >
          Dashboard
        </Link>

        <Link
          to="/protected-test"
          className="text-gray-700 hover:text-blue-600"
        >
          Protected Test
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <span className="text-sm text-gray-600">
              {user.name}
            </span>

            <button
              onClick={() => {
                void logout();
              }}
              className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;