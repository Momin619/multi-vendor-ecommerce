import { useNavigate } from "react-router-dom";

export const useRedirect = () => {
  const navigate = useNavigate();

  const redirectTo = (
    path: string,
    replace = false,
  ) => {
    navigate(path, { replace });
  };

  const redirectBack = (fallback = "/") => {
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