export function LoadingSpinner({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`border-2 border-current border-t-transparent text-primary-500 dark:text-primary-400 rounded-full animate-spin ${className}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}