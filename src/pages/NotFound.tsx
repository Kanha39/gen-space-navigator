import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center cosmic-card max-w-md mx-4">
        <h1 className="mb-4 text-6xl font-bold text-glow">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found in the cosmic void</p>
        <a href="/" className="btn-cosmic inline-block">
          Return to GenSpace
        </a>
      </div>
    </div>
  );
};

export default NotFound;
