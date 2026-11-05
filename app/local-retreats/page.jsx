import LegacyPage from '@/components/LegacyPage';
import { STR_IMAGES, STR_TITLE } from '@/lib/localRetreats/spaceToReturnImages.js';
import { isSpaceToReturnContentReady } from '@/lib/localRetreats/loadSpaceToReturnContent.js';
import { loadSpaceToReturnContent } from '@/lib/localRetreats/loadSpaceToReturnContent.js';

export const metadata = {
  title: 'Local Retreats',
  description:
    'Local retreats with Nawal Yoga — programs close to home.',
};

const strContent = loadSpaceToReturnContent();
const contentReady = isSpaceToReturnContentReady(strContent);
const cardTeaserEn = contentReady ? strContent.en.hero.dateDuration : '';
const cardTeaserAr = contentReady ? strContent.ar.hero.dateDuration : '';

const html = `
<main class="ny-inner ny-world inner-retreats-hub">
  <section class="ny-world-hero" aria-labelledby="local-retreats-title">
    <div class="ny-world-hero__media" aria-hidden="true">
      <img class="inner-retreats-hub__hero-img" src="/media/local-retreats/hero.jpg" alt="" width="1600" height="1067" decoding="async" fetchpriority="high" data-en-alt="Local retreats with Nawal Yoga" data-ar-alt="خلوات محلية مع نوال يوغا">
    </div>
    <div class="ny-world-hero__scrim" aria-hidden="true"></div>
    <div class="ny-world-hero__inner container">
      <a href="/" class="ny-world-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      <span class="eyebrow" data-en="02 — Stillness · Depth · Return" data-ar="٠٢ — سكون · عمق · عودة">02 — Stillness · Depth · Return</span>
      <h1 id="local-retreats-title" class="display-xl ny-world-hero__title" data-en="Local Retreats" data-ar="خلوات محلية">Local Retreats</h1>
      <p class="body-l ny-world-hero__lead" data-en="Local programs close to home — held in quiet, shared when the time is right." data-ar="برامج محلية قريبة منك — تُصاغ بهدوء، وتُعرَض حين يحين وقتها.">Local programs close to home — held in quiet, shared when the time is right.</p>
    </div>
  </section>

  <section class="ny-section ny-world-list" aria-labelledby="local-retreats-programs-heading">
    <div class="container">
      <h2 id="local-retreats-programs-heading" class="retreats-hub-section-title" data-en="Programs" data-ar="البرامج">Programs</h2>
      <div class="ny-door-grid">
        <a href="/local-retreats/a-space-to-return" class="ny-door str-hub-card reveal" aria-labelledby="str-card-title">
          <div class="ny-door__media" aria-hidden="true">
            <img class="str-hub-card__img" src="${STR_IMAGES.cardCover}" alt="" width="1600" height="1200" loading="lazy" decoding="async" data-en-alt="${STR_TITLE.en}" data-ar-alt="${STR_TITLE.ar}">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__num" aria-hidden="true">01</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Local retreat" data-ar="خلوة محلية">Local retreat</span>
            <h2 id="str-card-title" class="ny-door__title" data-en="${STR_TITLE.en}" data-ar="${STR_TITLE.ar}">${STR_TITLE.en}</h2>
            ${
              contentReady
                ? `<p class="ny-door__text" data-en="${cardTeaserEn.replace(/"/g, '&quot;')}" data-ar="${cardTeaserAr.replace(/"/g, '&quot;')}">${cardTeaserEn}</p>`
                : ''
            }
            <span class="ny-door__cta" data-en="Explore the retreat" data-ar="استكشفي الخلوة">Explore the retreat</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</main>
`;

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={['/legacy/css/inner-retreats.css', '/legacy/css/retreats-hub.css']}
      scripts={[]}
      inlineScripts={[]}
      html={html}
      currentNav="local-retreats"
    />
  );
}
