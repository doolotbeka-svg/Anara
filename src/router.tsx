import React, { useEffect, useState } from 'react';

// A minimal client-side router: the site has a handful of pages, no library needed.

const CHANGE_EVENT = 'anara:navigate';

export const currentPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '' ? '/' : path;
};

export function navigate(path: string) {
  if (path === currentPath()) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(CHANGE_EVENT));
  window.scrollTo({ top: 0 });
}

export function usePath(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const update = () => setPath(currentPath());
    window.addEventListener('popstate', update);
    window.addEventListener(CHANGE_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(CHANGE_EVENT, update);
    };
  }, []);
  return path;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** A real <a href> (works without JS and for search engines), navigating in place on a plain click. */
export const Link: React.FC<LinkProps> = ({ to, onClick, ...props }) => (
  <a
    href={to}
    onClick={(e) => {
      onClick?.(e);
      // Let the browser handle new-tab clicks (Ctrl/Cmd/Shift, middle button)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    }}
    {...props}
  />
);
