import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";
import { Button } from "./ui/button";

function FlockWatchLogo({ className }: { className?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" fill="#0a0a0a"/>
      {/* Camera body */}
      <rect x="4" y="10" width="18" height="12" rx="2" fill="#ef4444"/>
      {/* Camera lens */}
      <circle cx="13" cy="16" r="4" fill="#0a0a0a"/>
      <circle cx="13" cy="16" r="2.5" fill="#1a1a1a"/>
      <circle cx="13" cy="16" r="1" fill="#ef4444"/>
      {/* Lens glint */}
      <circle cx="11.5" cy="14.5" r="0.6" fill="white" opacity="0.6"/>
      {/* Camera mount arm */}
      <rect x="22" y="13" width="6" height="3" rx="1" fill="#ef4444"/>
      {/* Mount base */}
      <rect x="26" y="11" width="2" height="10" rx="1" fill="#666"/>
      {/* Viewfinder dot */}
      <rect x="6" y="12" width="3" height="2" rx="0.5" fill="#0a0a0a" opacity="0.5"/>
    </svg>
  );
}

export function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <FlockWatchLogo />
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-2">
            {isLoading ? null : isAuthenticated ? (
              <Button size="sm" asChild>
                <Link to="/dashboard">
                  Open App
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              !isAuthPage && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
