'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import {
  SITE_BOOT_SCRIPT,
  SITE_FONT_STYLES,
  SITE_STYLES,
  hasNewSiteHeader,
  navKeyFromPath,
  wrapWithSiteShell,
  normalizeMediaUrls,
  replaceMobileNav,
} from '@/lib/siteChrome';
import { extractMainHtml, filterLegacyAssets } from '@/lib/publicPage';
import SplitHeadings from '@/components/SplitHeadings';

export default function LegacyPage({
  lang,
  dir,
  bodyClassName,
  styles = [],
  scripts = [],
  inlineScripts = [],
  html,
  siteShell,
  currentNav = '',
  splitHeadings = true,
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');
  const mediaHtml = normalizeMediaUrls(html);
  const embeddedChrome = hasNewSiteHeader(mediaHtml);
  const useShell = siteShell !== false && !isAdmin && !embeddedChrome;
  const nav = currentNav || navKeyFromPath(pathname || '');
  const pageHtml = useShell ? extractMainHtml(mediaHtml) : mediaHtml;
  const renderedHtml = replaceMobileNav(
    useShell ? wrapWithSiteShell(pageHtml, nav) : mediaHtml,
    nav,
  );

  const { styles: filteredStyles, scripts: filteredScripts } = useShell
    ? filterLegacyAssets(styles, scripts)
    : { styles, scripts };

  const extraStyles = filteredStyles.filter(
    (href) => !SITE_STYLES.includes(href) && !SITE_FONT_STYLES.includes(href),
  );
  const renderedStyles = useShell
    ? [...SITE_FONT_STYLES, ...SITE_STYLES, ...extraStyles]
    : filteredStyles;

  const bootScripts = useShell
    ? [
        `${SITE_BOOT_SCRIPT}\nif(window.nawalI18n&&typeof window.nawalI18n.setLang==='function'){window.nawalI18n.setLang(document.documentElement.getAttribute('lang'));}`,
        ...inlineScripts,
      ]
    : inlineScripts;

  useEffect(() => {
    const previous = document.body.className;
    document.body.className = [bodyClassName, useShell ? 'ny-site' : ''].filter(Boolean).join(' ');
    return () => {
      document.body.className = previous;
    };
  }, [bodyClassName, useShell]);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    const hadAdminRoute = root.classList.contains('admin-route');

    root.lang = lang || 'en';
    root.dir = dir || 'ltr';
    root.classList.add('admin-route');

    const frameId = window.requestAnimationFrame(() => {
      if (typeof window.nawalAdminBoot === 'function') {
        window.nawalAdminBoot();
      } else {
        document.dispatchEvent(new CustomEvent('nawal:admin-mount'));
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      root.lang = previousLang;
      root.dir = previousDir;
      if (!hadAdminRoute) root.classList.remove('admin-route');
    };
  }, [isAdmin, lang, dir, pathname]);

  return (
    <>
      {renderedStyles.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      {(isAdmin ? filteredScripts : [{ src: '/js/thank-you-modal.js' }, ...filteredScripts]).map(
        (script, index) => (
          <Script key={script.src + index} src={script.src} strategy="afterInteractive" />
        ),
      )}
      {bootScripts.map((code, index) => (
        <Script key={index} id={`legacy-inline-${index}`} strategy="afterInteractive">
          {code}
        </Script>
      ))}
      {useShell && splitHeadings !== false ? <SplitHeadings /> : null}
    </>
  );
}
