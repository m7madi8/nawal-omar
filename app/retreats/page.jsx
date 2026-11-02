import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Retreats',
  description: 'Nawal Yoga retreats — upcoming journeys will be announced here.',
};

const html = `
<main class="ny-inner ny-world retreats-hub">
  <section class="ny-world-hero" aria-labelledby="retreats-title">
    <div class="ny-world-hero__media" aria-hidden="true">
      <img src="/media/home/hero.jpg" alt="" width="1600" height="1200" decoding="async">
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
      <p class="retreats-hub-intro" data-en="Our latest desert retreat has ended. New dates will be shared here and on Instagram when they open." data-ar="آخر ريتريت صحراوي انتهى. التواريخ القادمة ستُعلَن هنا وعلى إنستغرام عند فتح الحجز.">Our latest desert retreat has ended. New dates will be shared here and on Instagram when they open.</p>
      <p class="retreats-hub-empty body-l" data-en="No retreats open for booking right now." data-ar="لا يوجد ريتريت مفتوح للحجز حالياً.">No retreats open for booking right now.</p>
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
      styles={['/legacy/css/retreats-hub.css']}
      scripts={[]}
      inlineScripts={[]}
      html={html}
      currentNav="retreats"
    />
  );
}
