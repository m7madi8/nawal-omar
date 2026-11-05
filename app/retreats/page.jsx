import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Retreats',
  description:
    'Nawal Yoga retreats — five journeys coming in 2027.',
};

const html = `
<main class="ny-inner ny-world retreats-hub">
  <section class="ny-world-hero" aria-labelledby="retreats-title">
    <div class="ny-world-hero__media retreats-hub-hero__media" aria-hidden="true">
      <picture class="retreats-hub-hero__picture">
        <source
          media="(min-width: 768px)"
          srcset="/media/zanzibar/Mvuvi-Boutique-Resort---Kiwengwa.jpg"
          type="image/jpeg"
        >
        <img
          class="retreats-hub-hero__img"
          src="/media/Shams+resto+28.webp"
          alt=""
          decoding="async"
          fetchpriority="high"
          sizes="100vw"
        >
      </picture>
    </div>
    <div class="ny-world-hero__scrim" aria-hidden="true"></div>
    <div class="ny-world-hero__inner container">
      <a href="/" class="ny-world-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      <span class="eyebrow" data-en="03 — Go somewhere deeper" data-ar="٠٣ — اذهبي أعمق">03 — Go somewhere deeper</span>
      <h1 id="retreats-title" class="display-xl ny-world-hero__title" data-en="Retreats" data-ar="الرحلات">Retreats</h1>
      <p class="body-l ny-world-hero__lead" data-en="Leave everyday life behind, even if only for a few days." data-ar="اتركي يومياتك خلفك، ولو لأيام قليلة فقط.">Leave everyday life behind, even if only for a few days.</p>
    </div>
  </section>

  <section class="ny-section ny-world-list" aria-labelledby="retreats-upcoming-heading">
    <div class="container">
      <h2 id="retreats-upcoming-heading" class="retreats-hub-section-title" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</h2>
      <p class="retreats-hub-intro" data-en="Five retreats are taking shape in quiet—each with its own world, waiting to be revealed." data-ar="خمس رحلات تُصاغ في هدوء—كل واحدة بعالمها، في انتظار أن تُكشف.">Five retreats are taking shape in quiet—each with its own world, waiting to be revealed.</p>

      <div class="ny-door-grid ny-door-grid--feature retreats-hub-cards">
        <article
          class="ny-door ny-door--soon ny-door--teaser reveal"
          aria-labelledby="wadi-rum-card-title"
          data-en-label="Retreat coming in 2027 — display only, not open yet"
          data-ar-label="ريتريت قادم في 2027 — للعرض فقط، غير متاح بعد"
        >
          <span class="ny-door__status retreats-hub-badge-2027" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/wadi-rum/cover.jpg" alt="" width="1600" height="1200" loading="lazy" decoding="async" style="object-position: center 60%;">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
            <h2 id="wadi-rum-card-title" class="ny-door__title" data-en="Wadi Rum Retreat" data-ar="ريتريت وادي رم">Wadi Rum Retreat</h2>
            <p class="ny-door__text" data-en="A moonlit women&apos;s retreat in Wadi Rum with yoga, breathwork, healing circles, and desert rituals." data-ar="ريتريت نسائي تحت ضوء القمر في وادي رم — يوغا، تنفس، دوائر شفاء، وطقوس صحراوية.">A moonlit women's retreat in Wadi Rum with yoga, breathwork, healing circles, and desert rituals.</p>
          </div>
        </article>

        <article
          class="ny-door ny-door--soon ny-door--teaser ny-door--unrevealed reveal reveal-delay-1"
          aria-labelledby="unrevealed-retreat-title"
          aria-describedby="unrevealed-retreat-note"
          data-en-label="Upcoming retreat in 2027 — not open for booking yet"
          data-ar-label="ريتريت قادم في 2027 — غير متاح للحجز بعد"
        >
          <span class="ny-door__status retreats-hub-badge-2027" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
          <div class="ny-door__media retreat-teaser-media" aria-hidden="true">
            <img
              class="retreat-teaser-media__slide"
              src="/media/morocco/blackrhinoprivatetravel-20261104-0009.jpg"
              alt=""
              width="1600"
              height="1067"
              decoding="async"
              fetchpriority="high"
            >
            <img
              class="retreat-teaser-media__slide"
              src="/media/morocco/blackrhinoprivatetravel-20261104-0004.jpg"
              alt=""
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
            >
            <img
              class="retreat-teaser-media__slide"
              src="/media/morocco/blackrhinoprivatetravel-20261104-0006.jpg"
              alt=""
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
            >
            <img
              class="retreat-teaser-media__slide"
              src="/media/morocco/blackrhinoprivatetravel-20261104-0011.jpg"
              alt=""
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
            >
          </div>
          <div class="ny-door__scrim ny-door__scrim--unrevealed" aria-hidden="true"></div>
          <div class="ny-door__copy unrevealed-copy">
            <header class="unrevealed-copy__mast">
              <p class="unrevealed-eyebrow" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</p>
              <h3 id="unrevealed-retreat-title" class="unrevealed-headline">
                <span class="unrevealed-headline__line" data-en="Somewhere beyond" data-ar="ما وراء">Somewhere beyond</span>
                <span class="unrevealed-headline__line unrevealed-headline__line--soft" data-en="the ordinary" data-ar="المألوف">the ordinary</span>
              </h3>
            </header>
            <blockquote class="unrevealed-copy__verse">
              <p class="unrevealed-poetry" lang="ar">
                <span class="unrevealed-poetry__line">في 2027، نخبئ لك تجربة مختلفة تماما...</span>
                <span class="unrevealed-poetry__line">مكان لا يشبه الأماكن المعتادة، وأيام تستحق أن تعيشيها بكل تفاصيلها.</span>
              </p>
            </blockquote>
            <footer class="unrevealed-copy__closing">
              <p class="unrevealed-secondary" data-en="A new chapter is waiting to unfold." data-ar="فصل جديد يوشك أن ينفتح.">A new chapter is waiting to unfold.</p>
              <p id="unrevealed-retreat-note" class="unrevealed-whisper" data-en="A little mystery · A beautiful beginning." data-ar="قليل من الغموض · بداية جميلة.">A little mystery · A beautiful beginning.</p>
            </footer>
          </div>
        </article>

        <article
          class="ny-door ny-door--soon ny-door--teaser ny-door--horizon reveal reveal-delay-2"
          aria-labelledby="horizon-retreat-title"
          aria-describedby="horizon-retreat-note"
          data-en-label="Upcoming retreat in 2027 — not open for booking yet"
          data-ar-label="ريتريت قادم في 2027 — غير متاح للحجز بعد"
        >
          <span class="ny-door__status retreats-hub-badge-2027" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
          <div class="ny-door__media retreat-teaser-media horizon-media horizon-media--still" aria-hidden="true">
            <img
              class="retreat-teaser-media__slide"
              src="/media/nuwieba/874305352.jpg"
              alt=""
              width="1600"
              height="1067"
              decoding="async"
              loading="lazy"
            >
          </div>
          <div class="ny-door__scrim ny-door__scrim--horizon" aria-hidden="true"></div>
          <div class="ny-door__copy horizon-copy">
            <header class="horizon-copy__mast">
              <p class="horizon-eyebrow" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</p>
              <h3 id="horizon-retreat-title" class="horizon-headline">
                <span class="horizon-headline__line" data-en="Between the Sea" data-ar="بين البحر">Between the Sea</span>
                <span class="horizon-headline__line horizon-headline__line--amp" data-en="&amp; the Stars" data-ar="والنجوم">&amp; the Stars</span>
              </h3>
            </header>
            <blockquote class="horizon-copy__verse">
              <p class="horizon-poetry" lang="ar">
                <span class="horizon-poetry__line">بعيدا عن ضجيج العالم، حيث يلتقي البحر بسكون الجبال، وتصبح أبسط اللحظات أجمل الذكريات...</span>
                <span class="horizon-poetry__line">هناك تجربة جديدة نخبئها لك.</span>
              </p>
            </blockquote>
            <footer class="horizon-copy__closing">
              <p id="horizon-retreat-note" class="horizon-secondary" data-en="Somewhere between silence and freedom." data-ar="في مكان بين الصمت والحرية.">Somewhere between silence and freedom.</p>
            </footer>
          </div>
        </article>

        <article
          class="ny-door ny-door--soon ny-door--teaser reveal reveal-delay-3"
          aria-labelledby="zanzibar-card-title"
          data-en-label="Retreat coming in 2027 — display only, not open yet"
          data-ar-label="ريتريت قادم في 2027 — للعرض فقط، غير متاح بعد"
        >
          <span class="ny-door__status retreats-hub-badge-2027" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
          <div class="ny-door__media" aria-hidden="true">
            <img src="/media/zanzibar/zanzibarterminus-20260319-0007.jpg" alt="" width="1600" height="1067" loading="lazy" decoding="async">
          </div>
          <div class="ny-door__scrim" aria-hidden="true"></div>
          <div class="ny-door__copy">
            <span class="eyebrow" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
            <h2 id="zanzibar-card-title" class="ny-door__title" data-en="Zanzibar Retreat" data-ar="ريتريت زنجبار">Zanzibar Retreat</h2>
            <p class="ny-door__text" data-en="8 days · 7 nights of yoga, sound healing, nature, and deep restoration." data-ar="8 أيام · 7 ليالٍ من اليوغا، العلاج بالصوت، الطبيعة، والاستجمام العميق.">8 days · 7 nights of yoga, sound healing, nature, and deep restoration.</p>
          </div>
        </article>

        <article
          class="ny-door ny-door--soon ny-door--teaser ny-door--escape reveal reveal-delay-4"
          aria-labelledby="escape-retreat-title"
          aria-describedby="escape-retreat-note"
          data-en-label="Upcoming retreat experience in 2027 — not open for booking yet"
          data-ar-label="تجربة ريتريت قادمة في 2027 — غير متاحة للحجز بعد"
        >
          <span class="ny-door__status retreats-hub-badge-2027" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</span>
          <div class="ny-door__media retreat-teaser-media escape-media escape-media--still" aria-hidden="true">
            <img
              class="retreat-teaser-media__slide"
              src="/media/albania/classylebanese-20261104-0002.jpg"
              alt=""
              width="1600"
              height="1067"
              decoding="async"
              loading="lazy"
            >
          </div>
          <div class="ny-door__scrim ny-door__scrim--escape" aria-hidden="true"></div>
          <div class="ny-door__copy escape-copy">
            <header class="escape-copy__mast">
              <p class="escape-eyebrow" data-en="Coming in 2027" data-ar="قادمة في 2027">Coming in 2027</p>
              <h3 id="escape-retreat-title" class="escape-headline" data-en="Where the Soul Finds Its Way" data-ar="حيث تجد الروح طريقها">Where the Soul Finds Its Way</h3>
            </header>
            <blockquote class="escape-copy__verse">
              <p class="escape-poetry" lang="ar">
                <span class="escape-poetry__line">بين زرقة البحر، وسحر الطبيعة، وأماكن لم تكتشفها عيناك بعد...</span>
                <span class="escape-poetry__line">نحضر لك رحلة تعيد لك شعور الاكتشاف من جديد.</span>
              </p>
            </blockquote>
            <footer class="escape-copy__closing">
              <p id="escape-retreat-note" class="escape-secondary" data-en="Some journeys stay with you forever." data-ar="بعض الرحلات تبقى معك إلى الأبد.">Some journeys stay with you forever.</p>
            </footer>
          </div>
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
      styles={['/legacy/css/retreats-hub.css']}
      scripts={[]}
      inlineScripts={[]}
      html={html}
      currentNav="retreats"
    />
  );
}
