type SessionExpiredHandler = () => void;

let sessionExpiredHandler: SessionExpiredHandler | null = null;

export const setSessionExpiredHandler = (
  handler: SessionExpiredHandler
) => {
  sessionExpiredHandler = handler;
};

export const clearSessionExpiredHandler = () => {
  sessionExpiredHandler = null;
};

export const notifySessionExpired = () => {
  sessionExpiredHandler?.();
};