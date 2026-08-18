import {
  useNavigate,
} from "react-router-dom";

/**
 * Provides common navigation helpers.
 */
export const useRedirect = () => {
  const navigate = useNavigate();

  /**
   * Redirect to another page.
   */
  const redirectTo = (path: string) => {
    navigate(path);
  };

  /**
   * Go back to the previous page.
   *
   * Used when a user tries to access a role-restricted
   * page that they aren't allowed to access.
   */
  const redirectBack = (fallback = "/") => {
    /**
     * Browser history usually has a previous page.
     *
     * React Router's navigate(-1) uses that history.
     */
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback, {
        replace: true,
      });
    }
  };

  return {
    redirectTo,
    redirectBack,
  };
};