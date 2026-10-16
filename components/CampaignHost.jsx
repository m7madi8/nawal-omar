'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  TIMING,
  checkHref,
  commitDismiss,
  commitImpression,
  findUiBlocker,
  isExcludedPath,
  normalizeCampaigns,
  readRecord,
  selectCampaign,
} from '@/lib/campaigns/engine';

/**
 * Shows at most one in-site campaign (modal or strip) when the rules in lib/campaigns/engine.js allow it.
 * Mounted by app/layout.jsx ONLY when at least one campaign is active, so a site without an active
 * campaign loads none of this. Independent from the consent UI: separate markup, styles and z-index.
 *
 * It never opens on page load, never opens over another dialog, sticky bar or menu, never locks page
 * scroll, never traps a visitor (X, Not now, Esc, backdrop), and fails closed when storage is unusable.
 * Nothing is sent anywhere: the only thing stored is a per-campaign counter (docs/CAMPAIGNS.md).
 */

const CSS_ID = 'ny-campaigns-css';
const CSS_HREF = '/css/campaigns.css';

const UI = {
  en: { close: 'Close', later: 'Not now', region: 'Announcement' },
  ar: { close: 'إغلاق', later: 'ليس الآن', region: 'إعلان' },
};

let cssPromise = null;

/** Resolves true once the stylesheet is applied, false if it failed: a promotion is never shown unstyled. */
function loadCss() {
  if (cssPromise) return cssPromise;
  cssPromise = new Promise((resolve) => {
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      if (!ok) cssPromise = null;
      resolve(ok);
    };
    const link = document.createElement('link');
    link.id = CSS_ID;
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    link.onload = () => finish(true);
    link.onerror = () => {
      link.remove();
      finish(false);
    };
    window.setTimeout(() => finish(false), 4000);
    (document.head || document.documentElement).appendChild(link);
  });
  return cssPromise;
}

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null; // even reading the property can throw when storage is blocked
  }
}

function readLang() {
  return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
}

function focusableIn(root) {
  return Array.prototype.filter.call(root.querySelectorAll('a[href], button:not([disabled])'), (node) => {
    return !node.hidden && node.getClientRects().length > 0;
  });
}

export default function CampaignHost({ campaigns }) {
  const pathname = usePathname();
  const [shown, setShown] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState('ar');
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  const list = useMemo(() => normalizeCampaigns(campaigns).campaigns, [campaigns]);

  // Follow the site language (it can change at any time through the language switcher).
  useEffect(() => {
    setLang(readLang());
    const observer = new MutationObserver(() => setLang(readLang()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  // Decide, per page view, whether and when to show. No timer is started unless something could show.
  useEffect(() => {
    setShown(null);
    setReady(false);
    setBlocked(false);
    if (!list.length || isExcludedPath(pathname)) return undefined;

    const storage = getStorage();
    const pick = () => {
      const now = Date.now();
      return selectCampaign(list, { now, pathname, record: readRecord(storage, now) }).campaign;
    };
    if (!pick()) return undefined;

    let seconds = 0;
    let engaged = false;
    let done = false;
    let busy = false;
    let timer = 0;

    const stop = () => {
      done = true;
      window.clearInterval(timer);
    };
    const markEngaged = () => {
      engaged = true;
    };
    const onScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY || 0;
      if (y >= 300 || (range > 0 && y / range >= 0.25)) engaged = true;
    };

    const tick = async () => {
      if (done || busy || document.visibilityState === 'hidden') return;
      seconds += 1;
      if (seconds > TIMING.maxWaitSeconds) {
        stop();
        return;
      }
      if (seconds < TIMING.stripSeconds) return; // nothing can show earlier than this: no storage reads yet
      const candidate = pick();
      if (!candidate) {
        stop();
        return;
      }
      const needed = candidate.format === 'modal' ? TIMING.modalSeconds : TIMING.stripSeconds;
      if (seconds < needed) return;
      if (candidate.format === 'modal' && !engaged) return;
      if (findUiBlocker(document)) return; // try again next second

      busy = true;
      const cssOk = await loadCss();
      busy = false;
      if (done) return;
      if (!cssOk) {
        stop();
        return;
      }
      if (findUiBlocker(document)) return;
      // Counting the display first: if the browser cannot remember it, it is not shown at all.
      if (!commitImpression(storage, candidate.id, Date.now())) {
        stop();
        return;
      }
      stop();
      returnFocusRef.current = document.activeElement;
      setShown(candidate);
    };

    timer = window.setInterval(tick, 1000);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', markEngaged, true);
    document.addEventListener('keydown', markEngaged, true);
    document.addEventListener('touchstart', markEngaged, { capture: true, passive: true });

    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', markEngaged, true);
      document.removeEventListener('keydown', markEngaged, true);
      document.removeEventListener('touchstart', markEngaged, true);
      setShown(null);
    };
  }, [list, pathname]);

  // Reveal on the next frame (so the entrance transition runs) and keep out of the way of other UI.
  useEffect(() => {
    if (!shown) return undefined;
    const frame = window.requestAnimationFrame(() => setReady(true));
    const watch = window.setInterval(() => {
      setBlocked(Boolean(findUiBlocker(document, { ignoreTyping: true })));
    }, 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(watch);
    };
  }, [shown]);

  const dismiss = useCallback(() => {
    if (!shown) return;
    commitDismiss(getStorage(), shown.id, Date.now());
    setShown(null);
    const back = returnFocusRef.current;
    returnFocusRef.current = null;
    if (shown.format === 'modal' && back && typeof back.focus === 'function' && document.body.contains(back)) {
      back.focus();
    }
  }, [shown]);

  const onCta = useCallback(() => {
    if (!shown) return;
    commitDismiss(getStorage(), shown.id, Date.now()); // acting on it counts as an answer: no repeat
    window.setTimeout(() => setShown(null), 0); // after the browser has started following the link
  }, [shown]);

  // Modal only: focus moves into the dialog, Tab stays inside, Esc closes. Strips never take focus.
  const isModal = shown && shown.format === 'modal' && !blocked;
  useEffect(() => {
    if (!isModal || !ready) return undefined;
    const dialog = dialogRef.current;
    if (dialog) dialog.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = focusableIn(dialogRef.current);
      if (!items.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isModal, ready, dismiss]);

  if (!shown) return null;

  const copy = UI[lang];
  const title = shown.title[lang];
  const body = shown.body ? shown.body[lang] : '';
  const external = checkHref(shown.cta.href).external === true;
  const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const cls = ['ny-campaign', `ny-campaign--${shown.format}`, ready ? 'is-visible' : ''].filter(Boolean).join(' ');
  const titleId = `ny-campaign-title-${shown.id}`;
  const bodyId = `ny-campaign-body-${shown.id}`;

  const cta = (
    <a className="ny-campaign__cta" href={shown.cta.href} onClick={onCta} {...linkProps}>
      {shown.cta.label[lang]}
    </a>
  );
  const closeButton = (
    <button type="button" className="ny-campaign__close" onClick={dismiss} aria-label={copy.close}>
      <span aria-hidden="true">×</span>
    </button>
  );

  if (shown.format === 'modal') {
    return (
      <div className={cls} data-ny-campaign={shown.id} lang={lang} hidden={blocked}>
        <div className="ny-campaign__backdrop" onClick={dismiss} aria-hidden="true" />
        <div
          className="ny-campaign__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={body ? bodyId : undefined}
          tabIndex={-1}
          ref={dialogRef}
        >
          {closeButton}
          {shown.image ? (
            <img
              className="ny-campaign__image"
              src={shown.image.src}
              alt={shown.image.alt[lang]}
              width={shown.image.width}
              height={shown.image.height}
              decoding="async"
            />
          ) : null}
          <h2 className="ny-campaign__title" id={titleId}>
            {title}
          </h2>
          {body ? (
            <p className="ny-campaign__body" id={bodyId}>
              {body}
            </p>
          ) : null}
          <div className="ny-campaign__actions">
            {cta}
            <button type="button" className="ny-campaign__later" onClick={dismiss}>
              {copy.later}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className={cls} data-ny-campaign={shown.id} lang={lang} aria-labelledby={titleId} hidden={blocked}>
      {closeButton}
      <div className="ny-campaign__copy">
        <p className="ny-campaign__title" id={titleId}>
          {title}
        </p>
        {body ? <p className="ny-campaign__body">{body}</p> : null}
      </div>
      <div className="ny-campaign__actions">{cta}</div>
    </aside>
  );
}
