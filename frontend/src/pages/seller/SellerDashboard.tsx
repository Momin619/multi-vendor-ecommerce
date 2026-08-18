import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "react-hot-toast";

import {
  getSellerDashboard,
} from "../../api/dashboard.api";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  getErrorMessage,
} from "../../api/error.utils";

import Button from "../../components/ui/Button";

const SellerDashboard = () => {
  const {
    user,
    logout,
  } = useAuth();

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response =
          await getSellerDashboard();

        setMessage(
          response.data.message,
        );
      } catch (error) {
        toast.error(
          getErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();

      toast.success(
        "Logged out successfully.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Seller Dashboard
              </h1>

              <p className="mt-1 text-gray-500">
                Welcome, {user?.name}
              </p>
            </div>

            <div className="w-32">
              <Button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-green-50 p-5">
            <p className="font-medium text-green-900">
              Role: {user?.role}
            </p>

            {isLoading ? (
              <p className="mt-2 text-green-700">
                Loading protected API...
              </p>
            ) : (
              <p className="mt-2 text-green-700">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;