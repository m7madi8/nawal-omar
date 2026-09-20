import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Events',
  description: 'Upcoming gatherings with Nawal Omar — sound, breath, and connection.',
};

const html = `
<main class="ny-inner ny-world">
  <section class="ny-world-hero" aria-labelledby="events-title">
    <div class="ny-world-hero__media" aria-hidden="true">
      <img src="/media/events/sound-healing-01.jpg" alt="" width="1600" height="1200" decoding="async">
    </div>
    <div class="ny-world-hero__scrim" aria-hidden="true"></div>
    <div class="ny-world-hero__inner container">
      <a href="/" class="ny-world-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      <span class="eyebrow" data-en="01 — Sound · Movement · Connection" data-ar="٠١ — صوت · حركة · تواصل">01 — Sound · Movement · Connection</span>
      <h1 id="events-title" class="display-xl ny-world-hero__title" data-en="Events" data-ar="الفعاليات">Events</h1>
      <p class="body-l ny-world-hero__lead" data-en="Upcoming gatherings with Nawal Omar — sound, breath, and connection." data-ar="لقاءات قادمة مع نوال عمر — صوت، نفَس، وتواصل.">Upcoming gatherings with Nawal Omar — sound, breath, and connection.</p>
    </div>
  </section>

  <section class="ny-section ny-world-list">
    <div class="container">
      <div class="ny-door-grid">
        <a href="/events/sound-healing" class="ny-door reveal">
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/events/sound-healing-01.jpg" alt="" width="1600" height="1200" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__num" aria-hidden="true">01</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Event" data-ar="فعالية">Event</span>
            <h2 class="ny-door__title" data-en="Sound Healing" data-ar="العلاج بالصوت">Sound Healing</h2>
            <p class="ny-door__text" data-en="Friday 25 September · 18:00 · Haifa, Atlit beach — open to everyone." data-ar="الجمعة 25.9 · 18:00 · حيفا، شط عتليت — مناسبة للجميع.">Friday 25 September · 18:00 · Haifa, Atlit beach — open to everyone.</p>
            <span class="ny-door__cta" data-en="View details" data-ar="عرض التفاصيل">View details</span>
          </div>
        </a>

        <article class="ny-door" hidden data-event-listing-hidden="ice-bath">
          <a href="/events/ice-bath">
            <div class="ny-door__media" aria-hidden="true">
              <img src="/media/events/ice-bath/hero.jpg" alt="" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
          </a>
        </article>

        <article class="ny-door" hidden data-event-listing-hidden="nature-chocolate">
          <a href="/events/nature-chocolate">
            <div class="ny-door__media" aria-hidden="true">
              <img src="/media/events/nature-chocolate-hero.jpg" alt="" loading="lazy">
            </div>
          </a>
        </article>
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
      currentNav="experiences"
    />
  );
}
