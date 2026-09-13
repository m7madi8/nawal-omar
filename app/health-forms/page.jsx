import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Wellbeing',
  description: 'Awareness and care before you arrive — preparation for Nawal Yoga practices and experiences.',
};

const html = `
<main class="ny-inner ny-world">
  <section class="ny-world-hero" aria-labelledby="wellbeing-title">
    <div class="ny-world-hero__media" aria-hidden="true">
      <img src="/media/events/ice%20bath/IMG-20260727-WA0033.jpg" alt="" width="1600" height="1200" decoding="async">
    </div>
    <div class="ny-world-hero__scrim" aria-hidden="true"></div>
    <div class="ny-world-hero__inner container">
      <a href="/" class="ny-world-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      <span class="eyebrow" data-en="04 — Prepare · Listen · Care" data-ar="٠٤ — تحضّري · أنصتي · اعتني">04 — Prepare · Listen · Care</span>
      <h1 id="wellbeing-title" class="display-xl ny-world-hero__title" data-en="Wellbeing &amp; Preparation" data-ar="العناية والتحضير">Wellbeing &amp; Preparation</h1>
      <p class="body-l ny-world-hero__lead" data-en="Wellbeing isn't only movement and retreats — it's also awareness, preparation and care, before you arrive." data-ar="العناية بالنفس ليست فقط حركة ورحلات — بل وعي وتحضير واهتمام، قبل أن تصلي حتى.">Wellbeing isn't only movement and retreats — it's also awareness, preparation and care, before you arrive.</p>
    </div>
  </section>

  <section class="ny-section ny-world-list">
    <div class="container">
      <div class="ny-door-grid">
        <a href="/register/mountain-voice" class="ny-door ny-door--nawal-care reveal">
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/nawal.png" alt="" width="1600" height="1600" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__num" aria-hidden="true">01</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Nawal Yoga" data-ar="نوال يوغا">Nawal Yoga</span>
            <h2 class="ny-door__title" data-en="Nawal's Care" data-ar="عناية نوال">Nawal's Care</h2>
            <p class="ny-door__text" data-en="A general health declaration for Nawal's practices and gatherings." data-ar="إقرار صحي عام لممارسات نوال ولقاءاتها.">A general health declaration for Nawal's practices and gatherings.</p>
            <span class="ny-door__cta" data-en="Open form" data-ar="افتحي الاستمارة">Open form</span>
          </div>
        </a>

        <a href="/register/ice-bath" class="ny-door reveal reveal-delay-1">
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/events/ice-bath/health-form.jpg" alt="" width="1600" height="1200" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__num" aria-hidden="true">02</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Ice Bath" data-ar="حوض الثلج">Ice Bath</span>
            <h2 class="ny-door__title" data-en="Health Declaration" data-ar="الإقرار الصحي">Health Declaration</h2>
            <p class="ny-door__text" data-en="Required health form before joining the Ice Bath day retreat." data-ar="استمارة صحية مطلوبة قبل الانضمام إلى يوم حوض الثلج.">Required health form before joining the Ice Bath day retreat.</p>
            <span class="ny-door__cta" data-en="Open form" data-ar="افتحي الاستمارة">Open form</span>
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
      currentNav="health-forms"
    />
  );
}
