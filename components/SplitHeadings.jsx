'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const HEADING_SELECTOR = [
  'main h1',
  'main h2.display-xl',
  'main h2.display-l',
  'main h3.display-xl',
].join(',');

const LINE_COPY_SELECTOR = [
  'main .hero__sub',
  'main .body-l',
  'main .ny-page-hero__lead',
  'main .intro__lead',
  'main .intro__role',
  'main .worlds-intro-sub',
  'main .yg__lead',
  'main .rt__lead',
  'main .hl__lead',
  'main .shop-hero__lead',
  'main .shop-product__tagline',
  'main .shop-product__story p',
  'main .shop-material__copy',
  'main .shop-why__item p',
  'main .ny-hub-card__copy',
  'main .ny-hub-card__title',
  'main .intro__highlights li',
].join(',');

const SOFT_SELECTOR = [
  'main .eyebrow',
  'main .xp__tagline',
].join(',');

function waitForPageReady() {
  return new Promise((resolve) => {
    const done = () => resolve();
    if (document.documentElement.hasAttribute('data-ny-boot')) {
      done();
      return;
    }
    document.addEventListener('nawal:boot', done, { once: true });
    window.setTimeout(done, 480);
  });
}

function unique(nodes) {
  return [...new Set(nodes)];
}

export default function SplitHeadings() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) return;

    let cancelled = false;
    const splits = [];
    const triggers = [];

    function revert() {
      triggers.splice(0).forEach((st) => {
        try { st.kill(); } catch { /* noop */ }
      });
      splits.splice(0).forEach((split) => {
        try { split.revert(); } catch { /* noop */ }
      });
      document.querySelectorAll('.is-split, .is-copy-in').forEach((el) => {
        el.classList.remove('is-split', 'is-copy-in');
        gsap.set(el, { clearProps: 'opacity,transform' });
      });
    }

    function play(targets, vars) {
      if (!targets?.length) return;
      const tween = gsap.to(targets, vars);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    function init() {
      if (cancelled) return;
      revert();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isAr = document.documentElement.lang === 'ar';
      const headings = unique([...document.querySelectorAll(HEADING_SELECTOR)]);
      const headingSet = new Set(headings);

      headings.forEach((el) => {
        if (!el.textContent.trim()) return;
        if (el.closest('.wr-hero, .rp-hero, .haifa-hero, .event-sh-hero, .ib-hero, .baqa-hero, .ny-world-hero, .hero')) return;
        el.classList.add('is-split');
        const split = new SplitText(el, {
          type: isAr ? 'lines,words' : 'lines,chars',
          smartWrap: true,
          autoSplit: true,
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
          reduceWhiteSpace: false,
        });
        splits.push(split);
        const targets = isAr
          ? (split.words.length ? split.words : split.lines)
          : (split.chars.length ? split.chars : split.words);
        if (!targets?.length) return;
        gsap.set(targets, { opacity: 0, y: 40 });
        play(targets, {
          opacity: 1,
          y: 0,
          duration: 1.25,
          ease: 'power3.out',
          stagger: 0.05,
          force3D: true,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true, fastScrollEnd: true },
        });
      });

      unique([...document.querySelectorAll(LINE_COPY_SELECTOR)])
        .filter((el) => !headingSet.has(el) && !el.closest('h1, h2.display-xl, h2.display-l, h3.display-xl') && !el.closest('[hidden]'))
        .forEach((el) => {
          if (!el.textContent.trim()) return;
          el.classList.add('is-split');
          const split = new SplitText(el, {
            type: 'lines',
            smartWrap: true,
            autoSplit: true,
            linesClass: 'split-line',
            reduceWhiteSpace: false,
          });
          splits.push(split);
          const targets = split.lines.length ? split.lines : [el];
          gsap.set(targets, { opacity: 0, y: 18 });
          play(targets, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.08,
            force3D: true,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true, fastScrollEnd: true },
          });
        });

      unique([...document.querySelectorAll(SOFT_SELECTOR)])
        .filter((el) => !el.closest('[hidden]') && !el.classList.contains('is-split') && !el.closest('.worlds-stage'))
        .forEach((el, i) => {
          if (!el.textContent.trim()) return;
          el.classList.add('is-copy-in');
          gsap.set(el, { opacity: 0, y: 10 });
          play(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: Math.min(i % 4, 3) * 0.04,
            force3D: true,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true, fastScrollEnd: true },
          });
        });

      ScrollTrigger.refresh();
    }

    async function start() {
      await waitForPageReady();
      try { await document.fonts.ready; } catch { /* noop */ }
      if (cancelled) return;
      requestAnimationFrame(init);
    }

    start();
    const onLangWillChange = () => revert();
    const onLang = () => requestAnimationFrame(init);
    document.addEventListener('nawal:langwillchange', onLangWillChange);
    document.addEventListener('nawal:langchange', onLang);

    return () => {
      cancelled = true;
      document.removeEventListener('nawal:langwillchange', onLangWillChange);
      document.removeEventListener('nawal:langchange', onLang);
      revert();
    };
  }, [pathname]);

  return null;
}
