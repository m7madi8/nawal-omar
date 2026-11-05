import LegacyPage from '@/components/LegacyPage';
import { loadSpaceToReturnContent, isSpaceToReturnContentReady } from '@/lib/localRetreats/loadSpaceToReturnContent.js';
import { renderSpaceToReturnHtml } from '@/lib/localRetreats/renderSpaceToReturnHtml.js';
import { STR_IMAGES, STR_TITLE } from '@/lib/localRetreats/spaceToReturnImages.js';
import { buildLegacyRenderedHtml, PUBLIC_PAGE_DEFAULTS } from '@/lib/publicPage.js';

/** Read JSON at request time so copy updates (cancellation, pricing) ship without stale static HTML. */
export const revalidate = 0;

export function generateMetadata() {
  const content = loadSpaceToReturnContent();
  const ready = isSpaceToReturnContentReady(content);
  return {
    title: `${STR_TITLE.en} | Local Retreats | Nawal Yoga`,
    description: ready
      ? content.en.intro.paragraphs[0]?.slice(0, 160)
      : 'Local retreat with Nawal Yoga — A Space to Return.',
    openGraph: {
      title: `${STR_TITLE.en} | Nawal Yoga`,
      images: [{ url: STR_IMAGES.hero.replace(/^\//, ''), width: 1600, height: 1200 }],
    },
  };
}

const pendingHtml = `
<main class="ny-inner str-page str-page--pending">
  <section class="ny-section">
    <div class="container">
      <a href="/local-retreats" class="str-back" data-en="Local Retreats" data-ar="خلوات محلية">Local Retreats</a>
      <h1 class="display-xl" data-en="${STR_TITLE.en}" data-ar="${STR_TITLE.ar}">${STR_TITLE.en}</h1>
      <p class="body-l" data-en="Program content is being finalized in the CMS files. Please check back soon." data-ar="محتوى البرنامج قيد الإعداد في ملفات المحتوى. عودي قريباً.">Program content is being finalized in the CMS files. Please check back soon.</p>
    </div>
  </section>
</main>`;

export default function SpaceToReturnPage() {
  const content = loadSpaceToReturnContent();
  const ready = isSpaceToReturnContentReady(content);
  const pageHtml = ready ? renderSpaceToReturnHtml(content) : pendingHtml;
  const prebuiltHtml = buildLegacyRenderedHtml(pageHtml, { currentNav: 'local-retreats' });

  return (
    <LegacyPage
      lang={PUBLIC_PAGE_DEFAULTS.lang}
      dir={PUBLIC_PAGE_DEFAULTS.dir}
      bodyClassName=""
      styles={
        ready
          ? ['/css/space-to-return.css', '/legacy/css/hyp-pay-methods.css']
          : ['/css/space-to-return.css']
      }
      scripts={
        ready
          ? [
              { src: '/legacy/js/i18n.js' },
              { src: '/legacy/js/hyp-pay-method-picker.js' },
              { src: '/legacy/js/space-to-return-deposit-pay.js' },
              { src: '/legacy/js/space-to-return-registration.js' },
            ]
          : []
      }
      html={pageHtml}
      prebuiltHtml={prebuiltHtml}
      currentNav="local-retreats"
    />
  );
}
