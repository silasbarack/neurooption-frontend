import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "./RouteTransition.css";

type RouteTransitionProps = {
  children: ReactNode;
};

// Remounting on each pathname replays a short top progress bar and a soft
// fade-in, so navigating feels like a page load instead of an instant swap.
export default function RouteTransition({ children }: RouteTransitionProps) {
  const { pathname } = useLocation();

  return (
    <>
      <div key={`progress-${pathname}`} className="route-progress" aria-hidden="true" />
      <div key={`view-${pathname}`} className="route-view">
        {children}
      </div>
    </>
  );
}
