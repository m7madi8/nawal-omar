'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const NAV_SELECTOR = '.site-nav a, .mobile-nav__link, a.brand-mark--header';
const STORAGE_KEY = 'ny-transit';
const FADE_OUT_MS = 280;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function closeMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  if (!mobileNav?.classList.contains('is-open')) return;
  mobileNav.classList.add('is-closing');
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('nav-open');
  document.getElementById('navToggle')?.setAttribute('aria-expanded', 'false');
}

export default function PageTransit() {
  const pathname = usePathname();
  const leaving = useRef(false);

  useEffect(() => {
    let incoming = false;
    try {
      incoming = sessionStorage.getItem(STORAGE_KEY) === '1';
      if (incoming) sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      incoming = false;
    }

    if (!incoming || prefersReducedMotion()) {
      document.documentElement.classList.remove('ny-transit-pending', 'ny-is-leaving');
      return undefined;
    }

    document.documentElement.classList.add('ny-page-enter');
    const show = window.requestAnimationFrame(() => {
      document.documentElement.classList.remove('ny-transit-pending');
    });
    const done = window.setTimeout(() => {
      document.documentElement.classList.remove('ny-page-enter');
    }, 700);

    return () => {
      window.cancelAnimationFrame(show);
      window.clearTimeout(done);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;
      if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) return;

      const link = event.target.closest(NAV_SELECTOR);
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      let url;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      if (leaving.current) return;

      closeMobileNav();
      const next = url.pathname + url.search + url.hash;

      if (prefersReducedMotion()) {
        window.location.assign(next);
        return;
      }

      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        window.location.assign(next);
        return;
      }

      leaving.current = true;
      document.documentElement.classList.add('ny-is-leaving');
      window.setTimeout(() => {
        window.location.assign(next);
      }, FADE_OUT_MS);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  return null;
}
