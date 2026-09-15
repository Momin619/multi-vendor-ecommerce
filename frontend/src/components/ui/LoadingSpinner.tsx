/**
 * Simple reusable loading spinner.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
};

export default LoadingSpinner;