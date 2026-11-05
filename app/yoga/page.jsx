import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Yoga',
  description:
    'Yoga with Nawal — Haifa Vinyasa by the sea and Power Yoga in Baqa al-Gharbiyye every Wednesday at Reshape studio.',
};

const html = `
<main class="ny-inner ny-world yoga-hub">
  <section class="ny-world-hero yoga-hub-hero" aria-labelledby="yoga-title">
    <div class="ny-world-hero__media" aria-hidden="true">
      <img class="yoga-hub-hero__img" src="/media/yoga/hero.jpg" alt="" width="1600" height="900" decoding="async" fetchpriority="high" data-en-alt="Yoga practice with Nawal Yoga" data-ar-alt="ممارسة يوغا مع نوال يوغا">
    </div>
    <div class="ny-world-hero__scrim" aria-hidden="true"></div>
    <div class="ny-world-hero__inner container">
      <a href="/" class="ny-world-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      <span class="eyebrow" data-en="02 — Move · Breathe · Practice" data-ar="٠٢ — تحرّكي · تنفّسي · مارسي">02 — Move · Breathe · Practice</span>
      <h1 id="yoga-title" class="display-xl ny-world-hero__title" data-en="Yoga" data-ar="اليوغا">Yoga</h1>
      <p class="body-l ny-world-hero__lead" data-en="Move with intention — on the mat, in the studio, and in community." data-ar="تحرّكي بنيّة — على السجادة، في الاستوديو، ومع المجتمع.">Move with intention — on the mat, in the studio, and in community.</p>
    </div>
  </section>

  <section class="ny-section ny-world-list">
    <div class="container">
      <div class="ny-door-grid">
        <a href="/workshops/haifa" class="ny-door reveal">
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/haifa/hero.jpg" alt="" width="1600" height="2000" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__num" aria-hidden="true">01</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Haifa" data-ar="حيفا">Haifa</span>
            <h2 class="ny-door__title" data-en="Haifa Yoga" data-ar="يوغا حيفا">Haifa Yoga</h2>
            <p class="ny-door__text" data-en="Holistic Vinyasa, meditation and a supportive community by the sea." data-ar="فينياسا شمولية، تأمل، ومجتمع داعم بجانب البحر.">Holistic Vinyasa, meditation and a supportive community by the sea.</p>
            <span class="ny-door__cta" data-en="Explore Haifa" data-ar="اكتشفي حيفا">Explore Haifa</span>
          </div>
        </a>
        <a href="/yoga/baqa" class="ny-door reveal">
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/baqa/1000245792.jpg" alt="" width="1080" height="1624" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__num" aria-hidden="true">02</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Baqa al-Gharbiyye" data-ar="باقة الغربية">Baqa al-Gharbiyye</span>
            <h2 class="ny-door__title" data-en="Baqa al-Gharbiyye Yoga" data-ar="يوغا باقة الغربية">Baqa al-Gharbiyye Yoga</h2>
            <p class="ny-door__text" data-en="Power Yoga every Wednesday at 7:20 PM — at Reshape studio, Baqa al-Gharbiyye." data-ar="Power Yoga كل أربعاء الساعة 7:20 مساءً — في Reshape studio، باقة الغربية.">Power Yoga every Wednesday at 7:20 PM — at Reshape studio, Baqa al-Gharbiyye.</p>
            <span class="ny-door__cta" data-en="Explore Baqa al-Gharbiyye" data-ar="اكتشفي باقة الغربية">Explore Baqa al-Gharbiyye</span>
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
      styles={[]}
      scripts={[]}
      inlineScripts={[]}
      html={html}
      currentNav="yoga"
    />
  );
}
