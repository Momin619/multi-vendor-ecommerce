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
   <div className="min-h-screen bg-paper p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
   <div className="rounded-md border border-border bg-surface p-5 sm:p-8">
   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                Seller Dashboard
              </h1>

              <p className="mt-1 text-ink-soft">
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

          <div className="mt-8 rounded-md border border-success-soft bg-success-soft p-5">
            <p className="font-medium text-success">
              Role: {user?.role}
            </p>

            {isLoading ? (
              <p className="mt-2 text-ink-soft">
                Loading protected API...
              </p>
            ) : (
              <p className="mt-2 text-ink-soft">
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