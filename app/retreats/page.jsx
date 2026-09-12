import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Retreats',
  description: 'Upcoming Nawal Yoga retreats — Wadi Rum and more.',
};

const html = `
<main class="ny-inner ny-world retreats-hub">
  <section class="ny-world-hero" aria-labelledby="retreats-title">
    <div class="ny-world-hero__media" aria-hidden="true">
      <img src="/media/wadi-rum/cover.jpg" alt="" width="1600" height="1200" decoding="async">
    </div>
    <div class="ny-world-hero__scrim" aria-hidden="true"></div>
    <div class="ny-world-hero__inner container">
      <a href="/" class="ny-world-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      <span class="eyebrow" data-en="03 — Go somewhere deeper" data-ar="٠٣ — اذهبي أعمق">03 — Go somewhere deeper</span>
      <h1 id="retreats-title" class="display-xl ny-world-hero__title" data-en="Retreats" data-ar="الرحلات">Retreats</h1>
      <p class="body-l ny-world-hero__lead" data-en="Leave everyday life behind, even if only for a few days." data-ar="اتركي يومياتك خلفك، ولو لأيام قليلة فقط.">Leave everyday life behind, even if only for a few days.</p>
    </div>
  </section>

  <section class="ny-section ny-world-list">
    <div class="container">
      <p class="retreats-hub-intro" data-en="Desert journeys for rest, release, and return to yourself." data-ar="رحلات صحراوية للراحة والتحرر والعودة إلى الذات.">Desert journeys for rest, release, and return to yourself.</p>
      <div class="ny-door-grid">
        <a href="/retreats/wadi-rum" class="ny-door reveal" aria-labelledby="retreats-wadi-rum-title">
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/wadi-rum/cover.jpg" alt="" width="1600" height="1200" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <span class="ny-door__status" data-en="Soon" data-ar="قريباً">Soon</span>
          <span class="ny-door__num" aria-hidden="true">01</span>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Retreat" data-ar="ريتريت">Retreat</span>
            <h2 id="retreats-wadi-rum-title" class="ny-door__title" data-en="Wadi Rum" data-ar="وادي رم">Wadi Rum</h2>
            <p class="ny-door__text" data-en="22–26.10.2027 · desert yoga, sound healing & women circle in Wadi Rum." data-ar="22–26.10.2027 · يوغا الصحراء، ساوند هيلينغ ودائرة نسائية في وادي رم.">22–26.10.2027 · desert yoga, sound healing & women circle in Wadi Rum.</p>
            <span class="ny-door__cta" data-en="View details" data-ar="عرض التفاصيل">View details</span>
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
      styles={["/legacy/css/retreats-hub.css"]}
      scripts={[]}
      inlineScripts={[]}
      html={html}
      currentNav="retreats"
    />
  );
}
