import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Wadi Rum',
  description: 'Wadi Rum women retreat with Nawal Omar. Desert yoga, sound healing, breathwork, and inner reset under the stars.',
};

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
const waIcon = (size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;
const WA_HREF = 'https://wa.me/972522496366?text=Hi%20Nawal%2C%20I%27m%20interested%20in%20the%20Wadi%20Rum%20retreat%20(22%E2%80%9326.10).%20Could%20you%20tell%20me%20more%3F';
const PLAY_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

const GALLERY = [
  ['gallery-11.jpg', 11], ['gallery-12.jpg', 12], ['gallery-01.jpg', 1], ['gallery-13.jpg', 13],
  ['gallery-02.jpg', 2], ['gallery-14.jpg', 14], ['gallery-03.jpg', 3], ['gallery-15.jpg', 15],
  ['gallery-04.jpg', 4], ['gallery-16.jpg', 16], ['desert.jpg', 5], ['gallery-17.jpg', 17],
  ['panorama.jpg', 6], ['gallery-18.jpg', 18], ['tent.jpg', 7], ['gallery-19.jpg', 19],
  ['camp.jpg', 8], ['gallery-20.jpg', 20], ['cover.jpg', 9], ['night-bivouac.jpg', 10],
];
const REELS = [
  ['reel-05.mp4', 'gallery-11.jpg', 5], ['reel-06.mp4', 'gallery-12.jpg', 6], ['reel-01.mp4', 'gallery-01.jpg', 1],
  ['reel-02.mp4', 'gallery-02.jpg', 2], ['reel-03.mp4', 'gallery-03.jpg', 3], ['reel-04.mp4', 'gallery-04.jpg', 4],
];
const BUBBLES_PHOTOS = ['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0011', '0012'];
const PANORAMA_PHOTOS = ['0010', '0008', '0009', '0013', '0014'];

/* Widths must be in Next's default deviceSizes/imageSizes or /_next/image rejects them. */
const optimized = (src, w) => `/_next/image?url=${encodeURIComponent(src)}&amp;w=${w}&amp;q=75`;
const srcset = (src, widths) => widths.map((w) => `${optimized(src, w)} ${w}w`).join(', ');
const img = (src, widths, sizes) => `src="${optimized(src, widths[widths.length - 1])}" srcset="${srcset(src, widths)}" sizes="${sizes}"`;

const galleryItems = GALLERY.map(
  ([file, n]) => `<figure class="wr-carousel__item"><img ${img(`/media/wadi-rum/${file}`, [384, 640], '(min-width: 720px) 18rem, 82vw')} alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt${n}" width="640" height="800" loading="lazy" decoding="async"></figure>`,
).join('\n          ');
const reelItems = REELS.map(
  ([file, poster, n]) => `<figure class="wr-carousel__item wr-carousel__item--reel"><div class="wr-reel-card"><video class="wr-reel-video" src="/media/wadi-rum/${file}" poster="${optimized(`/media/wadi-rum/${poster}`, 640)}" muted playsinline loop preload="none" width="360" height="640" data-i18n-attr="aria-label:retreat_wadi_reel_aria_${n}"></video><button type="button" class="wr-reel-playbtn" data-i18n-attr="aria-label:retreat_wadi_reel_play">${PLAY_ICON}</button></div></figure>`,
).join('\n          ');
const staySlides = (folder, ids, altKey) => ids.map(
  (id) => `<figure class="wr-stay-gallery__slide"><img ${img(`/media/wadi-rum/${folder}/shahrazadluxury-20260914-${id}.jpg`, [640, 828, 1200], '(min-width: 860px) 32rem, 90vw')} alt="" data-i18n-attr="alt:${altKey}" width="1200" height="800" loading="lazy" decoding="async"></figure>`,
).join('\n                ');

const riskLine = (loc) => `<p class="wr-risk"><span data-i18n="retreat_wadi_risk_line">Sending a request is free and non-binding — your place is confirmed after a short call with a 400 ₪ deposit.</span> <a class="wr-risk__link" href="#wr-faq-policy" data-track-cta="policy" data-track-loc="${loc}" data-i18n="retreat_wadi_policy_link">Payment &amp; cancellation terms</a></p>`;

const ctaBlock = (loc, { lineKey, lineText, whatsapp = false, risk = false } = {}) => `<div class="wr-inline-cta" data-sticky-hide>
        ${lineKey ? `<p class="wr-inline-cta__line" data-i18n="${lineKey}">${lineText}</p>` : ''}
        <div class="wr-inline-cta__buttons">
          <a href="/register/wadi-rum" class="wr-register-btn" data-track-cta="book" data-track-loc="${loc}">
            <span data-i18n="retreat_wadi_book_now">Reserve your spot</span>
            <span class="wr-register-btn__arrow" aria-hidden="true">→</span>
          </a>
          ${whatsapp ? `<a href="${WA_HREF}" target="_blank" rel="noopener noreferrer" class="wr-inline-cta__wa" data-i18n-attr="href:retreat_wadi_wa_href" data-track-cta="whatsapp" data-track-loc="${loc}">
            ${waIcon(16)}
            <span data-i18n="retreat_wadi_ask_wa">Ask on WhatsApp</span>
          </a>` : ''}
        </div>
        ${risk ? riskLine(loc) : ''}
      </div>`;

const DAYS = [
  {
    chip: 'Day 01',
    title: 'Arrival &amp; intention setting',
    summary: 'Border pick-up, a stop in Al-Salt and a Bedouin welcome dinner',
    items: [
      'Meet at Beit Shean crossing and transfer to Wadi Rum.',
      'A stop in Al-Salt, including breakfast at a balcony restaurant.',
      'Warm Bedouin welcome and traditional dinner.',
      'Deep introductions and intention workshop.',
      'Light breath session and calm night under stars.',
    ],
  },
  {
    chip: 'Day 02',
    title: 'Desert power day',
    summary: 'Sunrise yoga, sound healing and stargazing',
    items: [
      'Sunrise yoga focused on root and pelvis.',
      'Breathwork, healthy breakfast, and a deep workshop session.',
      'Silent reflection + journaling and sound healing session.',
      'Star meditation and telescope workshop.',
    ],
  },
  {
    chip: 'Day 03',
    title: 'Inner and outer journey',
    summary: 'Heart-opening yoga, a jeep tour and sunset yoga',
    items: [
      'Heart-opening yoga + guided meditation.',
      'Power cards and emotional writing.',
      'Jeep desert tour in Wadi Rum.',
      'Sunset yoga with light acro for trust and balance.',
    ],
  },
  {
    chip: 'Day 04',
    title: 'Integration and transformation',
    summary: 'Feminine-energy yoga, a camel ride and the closing circle',
    items: [
      'Deep morning yoga to integrate feminine energy.',
      'Second workshop session and personal rest time.',
      'Camel ride and deep closing sound healing.',
      'Light celebration and retreat closing circle.',
    ],
  },
  {
    chip: 'Day 05',
    title: 'Farewell and anchoring',
    summary: 'Closing breakfast and the journey home',
    items: [
      'Closing breakfast and intention anchoring circle.',
      'Desert farewell and return with renewed energy.',
    ],
  },
];

const PROGRAM_PANEL_IDS = DAYS.map((_, i) => `wr-day${i + 1}-panel`).join(' ');

const accItem = ({ id, open, itemClass = '', track, heading, panel }) => `<div class="wr-acc__item${itemClass ? ` ${itemClass}` : ''}${open ? ' is-open' : ''}" id="${id}" data-acc-item data-track-id="${track}">
          <h3 class="wr-acc__heading">
            <button type="button" class="wr-acc__trigger" id="${id}-btn" aria-expanded="${open}" aria-controls="${id}-panel">
              ${heading}
              <span class="wr-acc__icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div class="wr-acc__panel" id="${id}-panel" role="region" aria-labelledby="${id}-btn">
            <div class="wr-acc__inner">
              ${panel}
            </div>
          </div>
        </div>`;

const programDays = DAYS.map((day, i) => {
  const n = i + 1;
  return accItem({
    id: `wr-day${n}`,
    open: n === 1,
    itemClass: 'wr-day',
    track: `day${n}`,
    heading: `<span class="wr-day__chip" data-i18n="retreat_wadi_day${n}_chip">${day.chip}</span>
              <span class="wr-acc__label">
                <span class="wr-day__title" data-i18n="retreat_wadi_day${n}_title">${day.title}</span>
                <span class="wr-day__summary" data-i18n="retreat_wadi_day${n}_summary">${day.summary}</span>
              </span>`,
    panel: `<ul>${day.items.map((text, j) => `<li data-i18n="retreat_wadi_day${n}_b${j + 1}">${text}</li>`).join('')}</ul>`,
  });
}).join('\n        ');

const faqItems = [
  accItem({
    id: 'wr-faq-includes',
    track: 'faq_includes',
    heading: '<span class="wr-acc__label wr-faq__q" data-i18n="retreat_wadi_faq_q_includes">What does the price include?</span>',
    panel: `<p class="wr-host__text" data-i18n="retreat_wadi_faq_a_includes">Four nights’ stay, daily breakfast and dinner plus 3 lunches, transfers to and from the border crossing, and every activity and workshop in the programme.</p>
              <a class="wr-faq__link" href="#wr-includes" data-i18n="retreat_wadi_faq_includes_link">See the full list</a>`,
  }),
  accItem({
    id: 'wr-faq-meet',
    track: 'faq_meet',
    heading: '<span class="wr-acc__label wr-faq__q" data-i18n="retreat_wadi_faq_q_meet">Where do we meet?</span>',
    panel: '<p class="wr-host__text" data-i18n="retreat_wadi_faq_a_meet">At the Beit Shean crossing — transfers to Wadi Rum and back are included in the price.</p>',
  }),
  accItem({
    id: 'wr-faq-secure',
    track: 'faq_secure',
    heading: '<span class="wr-acc__label wr-faq__q" data-i18n="retreat_wadi_faq_q_secure">How do I secure my place?</span>',
    panel: '<p class="wr-host__text" data-i18n="retreat_wadi_faq_a_secure">After the short call, with a first deposit of 400 ₪ by bank transfer or Bit.</p>',
  }),
  accItem({
    id: 'wr-faq-policy',
    track: 'faq_policy',
    heading: '<span class="wr-acc__label wr-faq__q" data-i18n="retreat_wadi_payment_title">Payment and cancellation policy</span>',
    panel: `<ul class="wr-booking__list">
                <li data-i18n="retreat_wadi_policy_1">A non-refundable first deposit of 400 ILS confirms booking.</li>
                <li data-i18n="retreat_wadi_policy_2">Remaining amount is due before the retreat date — exact date to be confirmed.</li>
                <li data-i18n="retreat_wadi_policy_3">Available methods: bank transfer or Bit.</li>
                <li data-i18n="retreat_wadi_policy_4">Please send transfer proof image to confirm your booking.</li>
                <li data-i18n="retreat_wadi_policy_5">Seats are limited and priority is for first confirmed bookings.</li>
                <li data-i18n="retreat_wadi_policy_6">Cancellation within 14 days of retreat date is non-refundable.</li>
                <li data-i18n="retreat_wadi_policy_7">No-show is non-refundable. Booking transfer is allowed if you find a replacement.</li>
              </ul>`,
  }),
].join('\n        ');

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={["/legacy/css/wadi-rum-retreat.css", "/legacy/css/booking-cta.css"]}
      scripts={[{"src":"/legacy/js/i18n.js","attrs":"  "},{"src":"/legacy/js/wadi-rum-retreat.js","attrs":"  "}]}
      inlineScripts={[]}
      currentNav="retreats"
      html={`<main class="wadi-rum-page ny-inner">
  <!-- 1. HERO -->
  <section class="wr-hero" aria-labelledby="wadi-hero-title">
    <div class="wr-hero__media" aria-hidden="true">
      <img ${img('/media/wadi-rum/cover.jpg', [640, 828, 1200, 1920], '100vw')} alt="" width="1600" height="1200" fetchpriority="high" decoding="async">
    </div>
    <div class="wr-hero__scrim" aria-hidden="true"></div>
    <a href="/retreats" class="wr-back wr-back--hero top-back-link" aria-label="Back">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      <span data-i18n="back">Back</span>
    </a>
    <div class="wr-hero__inner wr-container">
      <div class="wr-hero__layout">
        <header class="wr-hero__main">
          <p class="wr-hero__eyebrow">
            <span class="wr-kicker" data-i18n="retreat_wadi_page_label">Wadi Rum Women Retreat</span>
            <span class="wr-hero__dot" aria-hidden="true"></span>
            <span class="wr-hero__year">2026</span>
          </p>
          <h1 id="wadi-hero-title" class="wr-title" data-i18n="retreat_wadi_page_title">Moonlit Wadi Rum Retreat</h1>
          <div class="wr-hero__leads">
            <p class="wr-lead" data-i18n="retreat_wadi_page_intro">A journey into the depth of the soul — where the desert meets the sky.</p>
            <p class="wr-lead wr-lead--sub" data-i18n="retreat_wadi_page_intro2">Yoga, breathwork, sound healing & women’s circle under the stars.</p>
          </div>
        </header>
        <aside class="wr-hero__facts" data-i18n-attr="aria-label:retreat_wadi_hero_facts_aria" aria-label="Retreat details">
          <ul class="wr-hero__meta">
            <li class="wr-hero__fact">
              <span class="wr-hero__fact-label" data-i18n="retreat_wadi_hero_label_dates">Dates</span>
              <span class="wr-hero__fact-value" dir="ltr" data-i18n="retreat_wadi_hero_meta_date">22–26.10.2026</span>
            </li>
            <li class="wr-hero__fact">
              <span class="wr-hero__fact-label" data-i18n="retreat_wadi_hero_label_duration">Duration</span>
              <span class="wr-hero__fact-value" data-i18n="retreat_wadi_hero_meta_duration">5 days · 4 nights</span>
            </li>
            <li class="wr-hero__fact">
              <span class="wr-hero__fact-label" data-i18n="retreat_wadi_hero_label_place">Location</span>
              <span class="wr-hero__fact-value" data-i18n="retreat_wadi_hero_meta_place">Wadi Rum, Jordan</span>
            </li>
          </ul>
        </aside>
        <div class="wr-hero__actions">
          <p class="wr-hero__price" data-i18n="retreat_wadi_hero_price">From 3,650 ₪ · accommodation, meals &amp; transfers included</p>
          <div class="wr-hero__buttons">
            <a href="/register/wadi-rum" class="wr-hero__cta" data-track-cta="book" data-track-loc="hero">
              <span data-i18n="retreat_wadi_book_now">Reserve your spot</span>
              <span class="wr-hero__cta-arrow" aria-hidden="true">→</span>
            </a>
            <a href="${WA_HREF}" target="_blank" rel="noopener noreferrer" class="wr-hero__cta wr-hero__cta--wa" data-i18n-attr="href:retreat_wadi_wa_href" data-track-cta="whatsapp" data-track-loc="hero">
              ${waIcon(18)}
              <span data-i18n="retreat_wadi_ask_wa">Ask on WhatsApp</span>
            </a>
          </div>
          <p class="wr-hero__urgency"><span data-i18n="retreat_wadi_hero_urgency">Small women’s group · limited spots</span><span class="wr-hero__sep" aria-hidden="true"> · </span><strong class="wr-spots" data-i18n="retreat_wadi_spots_left">About 10 spots left</strong></p>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. TRUST STRIP -->
  <section class="wr-trust" data-i18n-attr="aria-label:retreat_wadi_trust_aria" aria-label="Who is guiding you">
    <div class="wr-container wr-trust__inner">
      <a class="wr-trust__hosts" href="#wr-about" data-track-cta="hosts" data-track-loc="trust">
        <span class="wr-trust__avatars" aria-hidden="true">
          <img src="${optimized('/media/home/portrait.jpg', 96)}" alt="" width="96" height="96" decoding="async">
          <img src="${optimized('/media/wadi-rum/israa.jpeg', 96)}" alt="" width="96" height="96" decoding="async">
        </span>
        <span class="wr-trust__names">
          <span class="wr-trust__host"><strong data-i18n="retreat_wadi_about_nawal_name">Nawal Omar</strong> · <span data-i18n="retreat_wadi_about_nawal_role">Nurse and Vinyasa Yoga Teacher</span></span>
          <span class="wr-trust__host"><strong data-i18n="retreat_wadi_about_esraa_name">Esraa Taye</strong> · <span data-i18n="retreat_wadi_about_esraa_role">Psychotherapist &amp; content creator</span></span>
          <span class="wr-trust__more" data-i18n="retreat_wadi_trust_more">Meet your guides</span>
        </span>
      </a>
      <ul class="wr-trust__stats">
        <li class="wr-trust__stat"><strong dir="ltr">2,000+</strong><span data-i18n="retreat_wadi_trust_trainees">trained with Nawal</span></li>
        <li class="wr-trust__stat"><strong dir="ltr">7+</strong><span data-i18n="retreat_wadi_trust_years">years of teaching</span></li>
        <li class="wr-trust__stat"><strong dir="ltr">20</strong><span data-i18n="retreat_wadi_trust_group">women max per group</span></li>
      </ul>
    </div>
  </section>

  <!-- 3. WHO IS THIS RETREAT FOR -->
  <section id="wr-forwhom" class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_forwhom_title">Who is this retreat for?</h2>
        <p class="wr-section__lead" data-i18n="retreat_wadi_forwhom_intro">This retreat is for you if:</p>
      </div>
      <div class="wr-grid-2 wr-forwhom">
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_1_title">1. You feel you need to pause.</h3><p data-i18n="retreat_wadi_forwhom_1_text">Not because you are weak, but because you have been running between work, people, responsibilities and expectations — and you need space where you come first.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_2_title">2. You feel distant from your body and yourself.</h3><p data-i18n="retreat_wadi_forwhom_2_text">And you want to hear it again through movement, breath and silence — instead of living only from your head.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_3_title">3. You are in a transition or change.</h3><p data-i18n="retreat_wadi_forwhom_3_text">A decision, a relationship, a beginning, an ending, a big question — or even an inner feeling that the old version of you no longer fits.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_4_title">4. You want a women\'s experience with depth and belonging.</h3><p data-i18n="retreat_wadi_forwhom_4_text">A place where you don\'t need to prove anything, compare yourself to anyone, or be a certain image.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_5_title">5. You want to give yourself an experience that stays with you.</h3><p data-i18n="retreat_wadi_forwhom_5_text">Not just a trip or a holiday — but days of adventure, laughter, nature, women, movement, calm, and real space for you.</p></article>
      </div>
      ${ctaBlock('forwhom', { lineKey: 'retreat_wadi_forwhom_cta', lineText: 'Recognised yourself in one of these? The next step is simple.' })}
    </div>
  </section>

  <!-- 4. WHY DIFFERENT -->
  <section class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_why_title">Why this retreat is different?</h2>
      </div>
      <div class="wr-grid-2">
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_1_title">1) The desert returns you to yourself</h3><p data-i18n="retreat_wadi_why_1_text">Desert silence calms overthinking and brings you back to your roots and grounding.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_2_title">2) The women circle heals</h3><p data-i18n="retreat_wadi_why_2_text">A space without judgment or comparison. Women supporting women with awareness and love.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_3_title">3) The body is released</h3><p data-i18n="retreat_wadi_why_3_text">Daily yoga, deep breathwork, and sound healing to restore inner balance.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_4_title">4) A true release ritual</h3><p data-i18n="retreat_wadi_why_4_text">Under Wadi Rum stars, we release old patterns and return lighter, clearer, and more aligned.</p></article>
      </div>
    </div>
  </section>

  <!-- 5. GALLERY: photos + reels -->
  <section id="wr-gallery" class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_gallery_title">Moments from Wadi Rum</h2>
      <div class="wr-carousel wr-gallery-photos">
        <div class="wr-carousel__track" id="wadi-carousel-track">
          ${galleryItems}
        </div>
        <div class="wr-carousel__controls">
          <button type="button" class="wr-carousel__btn" id="wadi-prev" data-i18n-attr="aria-label:gallery_prev" aria-label="Previous image">←</button>
          <button type="button" class="wr-carousel__btn" id="wadi-next" data-i18n-attr="aria-label:gallery_next" aria-label="Next image">→</button>
        </div>
      </div>

      <div class="wr-gallery-reels">
        <h3 class="wr-h3" data-i18n="retreat_wadi_reels_title">Reels from the retreat</h3>
        <p class="wr-reels-hint" data-i18n="retreat_wadi_reels_hint">Swipe sideways and tap play.</p>
        <div class="wr-carousel wr-reels-carousel" data-i18n-attr="aria-label:retreat_wadi_reels_label" aria-label="Wadi Rum retreat reels">
          <div class="wr-carousel__track" id="wadi-reels-track">
          ${reelItems}
          </div>
          <div class="wr-carousel__controls">
            <button type="button" class="wr-carousel__btn" id="wadi-reels-prev" data-i18n-attr="aria-label:gallery_prev" aria-label="Previous video">←</button>
            <button type="button" class="wr-carousel__btn" id="wadi-reels-next" data-i18n-attr="aria-label:gallery_next" aria-label="Next video">→</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. WHO AM I (full) -->
  <section id="wr-about" class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_about_title">Who am I?</h2>
      </div>
      <article class="wr-host wr-card">
        <div class="wr-host__media">
          <img ${img('/media/home/portrait.jpg', [384, 640], '(min-width: 720px) 11rem, 90vw')} alt="Nawal Omar" data-i18n-attr="alt:retreat_wadi_about_nawal_name" width="640" height="640" loading="lazy" decoding="async">
        </div>
        <div class="wr-host__copy">
          <h3 class="wr-host__name" data-i18n="retreat_wadi_about_nawal_name">Nawal Omar</h3>
          <p class="wr-host__role" data-i18n="retreat_wadi_about_nawal_role">Nurse and Vinyasa Yoga Teacher</p>
          <p class="wr-host__text" data-i18n="retreat_wadi_about_nawal_text">I blend science with body awareness and spiritual practice, creating safe spaces for women to return to their bodies, heal the pelvis, calm the nervous system, and release old patterns that no longer serve them. This retreat is a natural extension of my message.</p>
        </div>
      </article>
      <article class="wr-host wr-card">
        <div class="wr-host__media">
          <img ${img('/media/wadi-rum/israa.jpeg', [384, 640], '(min-width: 720px) 11rem, 90vw')} alt="Esraa Taye" data-i18n-attr="alt:retreat_wadi_about_esraa_name" width="640" height="640" loading="lazy" decoding="async">
        </div>
        <div class="wr-host__copy">
          <h3 class="wr-host__name" data-i18n="retreat_wadi_about_esraa_name">Esraa Taye</h3>
          <p class="wr-host__role" data-i18n="retreat_wadi_about_esraa_role">Psychotherapist & content creator</p>
          <p class="wr-host__text" data-i18n="retreat_wadi_about_esraa_text">A psychotherapist and content creator specializing in nervous system understanding, relationship dynamics, and emotional wound healing. She supports individuals, couples, and mothers on their path toward emotional balance, regulation, and a safer relationship with self and others.</p>
          <a href="https://www.instagram.com/esraa_therapy/" target="_blank" rel="noopener noreferrer" class="wr-host__social" data-i18n-attr="aria-label:retreat_wadi_esraa_instagram_aria" aria-label="Esraa Taye on Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
            <span data-i18n="retreat_wadi_esraa_instagram_label">Follow @esraa_therapy on Instagram</span>
          </a>
        </div>
      </article>
    </div>
  </section>

  <!-- 6b. VOICES (participant messages) -->
  <section id="wr-voices" class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_voices_title">In their words</h2>
        <p class="wr-section__lead" data-i18n="retreat_wadi_voices_sub">From messages participants sent after the previous retreat</p>
      </div>
      <div class="wr-voices">
        <figure class="wr-voice">
          <blockquote class="wr-voice__quote">
            <p class="wr-voice__hl" data-i18n="retreat_wadi_voice1_highlight">Each one of you left a beautiful mark on my heart.</p>
            <details class="wr-voice__more" data-track-id="voice1">
              <summary data-i18n="retreat_wadi_voice_read_more">Read the full message</summary>
              <p class="wr-host__text" data-i18n="retreat_wadi_voice1_text">My dearest ❤️ I honestly don’t know how to describe how special this time was because of you…</p>
            </details>
          </blockquote>
          <figcaption class="wr-voice__author" data-i18n="retreat_wadi_voice_author">Participant · previous retreat</figcaption>
        </figure>
        <figure class="wr-voice">
          <blockquote class="wr-voice__quote">
            <p class="wr-voice__hl" data-i18n="retreat_wadi_voice2_highlight">From today I have a second, big family.</p>
            <details class="wr-voice__more" data-track-id="voice2">
              <summary data-i18n="retreat_wadi_voice_read_more">Read the full message</summary>
              <p class="wr-host__text" data-i18n="retreat_wadi_voice2_text">Thank you, girls, for the holding, optimism, joy, calm and support…</p>
            </details>
          </blockquote>
          <figcaption class="wr-voice__author" data-i18n="retreat_wadi_voice_author">Participant · previous retreat</figcaption>
        </figure>
        <figure class="wr-voice">
          <blockquote class="wr-voice__quote">
            <p class="wr-voice__hl" data-i18n="retreat_wadi_voice3_highlight">Thank you for creating a safe, beautiful space, with so much love.</p>
            <details class="wr-voice__more" data-track-id="voice3">
              <summary data-i18n="retreat_wadi_voice_read_more">Read the full message</summary>
              <p class="wr-voice__to" data-i18n="retreat_wadi_voice3_to_nawal">To Nawal 🤍</p>
              <p class="wr-host__text" data-i18n="retreat_wadi_voice3_text_nawal">Thank you for creating a safe, beautiful space with so much love…</p>
              <p class="wr-voice__to" data-i18n="retreat_wadi_voice3_to_esraa">To Esraa ❤️</p>
              <p class="wr-host__text" data-i18n="retreat_wadi_voice3_text_esraa">Your presence alone is ease and safety…</p>
            </details>
          </blockquote>
          <figcaption class="wr-voice__author" data-i18n="retreat_wadi_voice_author">Participant · previous retreat</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- 7. FULL PROGRAM -->
  <section id="wr-program" class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_program_title">Full program</h2>
      </div>
      <div class="wr-acc-toolbar">
        <button type="button" class="wr-acc-toggle-all" data-acc-toggle-all="wr-program-acc" aria-controls="${PROGRAM_PANEL_IDS}">
          <span data-acc-label="expand" data-i18n="retreat_wadi_program_expand_all">Open all days</span>
          <span data-acc-label="collapse" data-i18n="retreat_wadi_program_collapse_all" hidden>Close all days</span>
        </button>
      </div>
      <div class="wr-program wr-acc" id="wr-program-acc" data-acc>
        ${programDays}
      </div>
    </div>
  </section>

  <!-- 8. ACCOMMODATION & PRICES -->
  <section id="wr-stay" class="wr-section">
    <div class="wr-container">
      <div class="wr-booking">
        <h2 class="wr-booking__title" data-i18n="retreat_wadi_accommodation_title">Accommodation</h2>
        <p class="wr-booking__sub" data-i18n="retreat_wadi_accommodation_sub">Choose your room — the price covers the whole programme</p>
        <div class="wr-booking__grid wr-booking__grid--stays">
          <article class="wr-booking__block wr-stay-card">
            <span class="wr-stay-badge" data-i18n="retreat_wadi_stay1_b4">Full privacy</span>
            <div class="wr-stay-gallery" data-stay-gallery data-i18n-attr="aria-label:retreat_wadi_stay1_gallery_label" aria-label="Bubbles room photos">
              <div class="wr-stay-gallery__track" data-stay-track>
                ${staySlides('bubbles', BUBBLES_PHOTOS, 'retreat_wadi_stay1_photo_alt')}
              </div>
              <div class="wr-stay-gallery__controls">
                <button type="button" class="wr-stay-gallery__btn wr-stay-gallery__btn--prev" data-stay-prev hidden data-i18n-attr="aria-label:gallery_prev" aria-label="Previous image">←</button>
                <button type="button" class="wr-stay-gallery__btn wr-stay-gallery__btn--next" data-stay-next data-i18n-attr="aria-label:gallery_next" aria-label="Next image">→</button>
              </div>
            </div>
            <div class="wr-stay-card__body">
            <h4 data-i18n="retreat_wadi_stay1_heading">🫧 BUBBLES ROOM</h4>
            <p class="wr-stay-rate" data-i18n="retreat_wadi_stay1_rate">3,850 ₪ per person | double room</p>
            <p class="wr-stay-intro" data-i18n="retreat_wadi_stay1_intro">A unique experience sleeping in the heart of the desert, under the sky.</p>
            <p class="wr-stay-includes-label" data-i18n="retreat_wadi_stay1_includes_label">The room includes:</p>
            <ul class="wr-booking__list">
              <li data-i18n="retreat_wadi_stay1_b1">Luxury circular Bubble design</li>
              <li data-i18n="retreat_wadi_stay1_b2">Air conditioning</li>
              <li data-i18n="retreat_wadi_stay1_b3">Private bathroom</li>
              <li data-i18n="retreat_wadi_stay1_b4">Full privacy</li>
              <li data-i18n="retreat_wadi_stay1_b5">Comfortable beds</li>
              <li data-i18n="retreat_wadi_stay1_b6">Private outdoor sitting area</li>
            </ul>
            </div>
          </article>
          <article class="wr-booking__block wr-stay-card">
            <span class="wr-stay-badge wr-stay-badge--soft" data-i18n="retreat_wadi_stay2_b1">Panoramic view</span>
            <div class="wr-stay-gallery" data-stay-gallery data-i18n-attr="aria-label:retreat_wadi_stay2_gallery_label" aria-label="Panorama room photos">
              <div class="wr-stay-gallery__track" data-stay-track>
                ${staySlides('panorama', PANORAMA_PHOTOS, 'retreat_wadi_stay2_photo_alt')}
              </div>
              <div class="wr-stay-gallery__controls">
                <button type="button" class="wr-stay-gallery__btn wr-stay-gallery__btn--prev" data-stay-prev hidden data-i18n-attr="aria-label:gallery_prev" aria-label="Previous image">←</button>
                <button type="button" class="wr-stay-gallery__btn wr-stay-gallery__btn--next" data-stay-next data-i18n-attr="aria-label:gallery_next" aria-label="Next image">→</button>
              </div>
            </div>
            <div class="wr-stay-card__body">
            <h4 data-i18n="retreat_wadi_stay2_heading">🏜️ PANORAMA ROOM</h4>
            <p class="wr-stay-rate" data-i18n="retreat_wadi_stay2_rate">3,650 ₪ per person | double room</p>
            <p class="wr-stay-intro" data-i18n="retreat_wadi_stay2_intro">A spacious room with an open view over the Wadi Rum desert.</p>
            <p class="wr-stay-includes-label" data-i18n="retreat_wadi_stay2_includes_label">Includes:</p>
            <ul class="wr-booking__list">
              <li data-i18n="retreat_wadi_stay2_b1">Panoramic view</li>
              <li data-i18n="retreat_wadi_stay2_b2">Air conditioning</li>
              <li data-i18n="retreat_wadi_stay2_b3">Private bathroom</li>
              <li data-i18n="retreat_wadi_stay2_b4">Comfortable beds</li>
              <li data-i18n="retreat_wadi_stay2_b5">A calm, comfortable stay experience</li>
            </ul>
            </div>
          </article>
        </div>
        <div id="wr-includes" class="wr-booking__block wr-includes-block">
          <h4 data-i18n="retreat_wadi_includes_title">Price includes</h4>
          <div class="wr-includes-groups">
            <div class="wr-includes-group">
              <p class="wr-includes-group__title"><span class="wr-includes-group__icon" aria-hidden="true">⛺</span><span data-i18n="retreat_wadi_includes_g1">Stay &amp; meals</span></p>
              <ul class="wr-booking__list wr-includes-list">
                <li data-i18n="retreat_wadi_inc1">5 days and 4 nights accommodation</li>
                <li data-i18n="retreat_wadi_inc2">Daily breakfast and dinner</li>
                <li data-i18n="retreat_wadi_inc3">3 lunches</li>
              </ul>
            </div>
            <div class="wr-includes-group">
              <p class="wr-includes-group__title"><span class="wr-includes-group__icon" aria-hidden="true">🐪</span><span data-i18n="retreat_wadi_includes_g2">Transfers &amp; adventures</span></p>
              <ul class="wr-booking__list wr-includes-list">
                <li data-i18n="retreat_wadi_inc4">Transfers to and from the border crossing</li>
                <li data-i18n="retreat_wadi_inc5">Jeep Tour in Wadi Rum</li>
                <li data-i18n="retreat_wadi_inc6">Camel Ride</li>
                <li data-i18n="retreat_wadi_inc7">Telescope Workshop</li>
              </ul>
            </div>
            <div class="wr-includes-group">
              <p class="wr-includes-group__title"><span class="wr-includes-group__icon" aria-hidden="true">🧘‍♀️</span><span data-i18n="retreat_wadi_includes_g3">Daily practice</span></p>
              <ul class="wr-booking__list wr-includes-list">
                <li data-i18n="retreat_wadi_inc8">Daily Yoga</li>
                <li data-i18n="retreat_wadi_inc9">Breathwork</li>
                <li data-i18n="retreat_wadi_inc10">Meditation</li>
                <li data-i18n="retreat_wadi_inc11">Two deep workshops</li>
                <li data-i18n="retreat_wadi_inc12">Sound Healing</li>
              </ul>
            </div>
            <div class="wr-includes-group">
              <p class="wr-includes-group__title"><span class="wr-includes-group__icon" aria-hidden="true">🤍</span><span data-i18n="retreat_wadi_includes_g4">Circle &amp; support</span></p>
              <ul class="wr-booking__list wr-includes-list">
                <li data-i18n="retreat_wadi_inc13">Women\'s circles and sharing spaces</li>
                <li data-i18n="retreat_wadi_inc14">Support and guidance throughout the experience</li>
                <li data-i18n="retreat_wadi_inc15">Professional photography to document the journey</li>
              </ul>
            </div>
          </div>
        </div>
        ${ctaBlock('offer', { whatsapp: true, risk: true })}
      </div>
    </div>
  </section>

  <!-- 9. REGISTRATION STEPS (before you register + registration) -->
  <section id="wr-steps" class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_registration_title">Registration & securing your place</h2>
      <div class="wr-before">
        <p class="wr-before__title" data-i18n="retreat_wadi_before_title">Before you register…</p>
        <div class="wr-before-lines">
          <p class="wr-host__text" data-i18n="retreat_wadi_before_line1">You don\'t need to practice yoga.</p>
          <p class="wr-host__text" data-i18n="retreat_wadi_before_line2">You don\'t need to be flexible.</p>
          <p class="wr-host__text" data-i18n="retreat_wadi_before_line3">And you don\'t need to be going through something "difficult" to deserve space for yourself.</p>
          <p class="wr-host__text" data-i18n="retreat_wadi_before_line4">It\'s enough that you feel the time has come to choose yourself a little more.</p>
        </div>
      </div>
      <ol class="wr-steps">
        <li class="wr-step">
          <span class="wr-step__num" aria-hidden="true">1</span>
          <div class="wr-step__body">
            <h3 class="wr-step__title" data-i18n="retreat_wadi_steps_1_title">Send your request</h3>
            <p class="wr-host__text" data-i18n="retreat_wadi_registration_text1">Because this retreat is built around a small women's group and a close, deep experience, final registration is not automatic.</p>
          </div>
        </li>
        <li class="wr-step">
          <span class="wr-step__num" aria-hidden="true">2</span>
          <div class="wr-step__body">
            <h3 class="wr-step__title" data-i18n="retreat_wadi_steps_2_title">A short getting-to-know-you call</h3>
            <p class="wr-host__text" data-i18n="retreat_wadi_registration_text2">After you submit your application, we will contact you for a short phone call to get to know you, understand your expectations, answer your questions, and make sure the experience is right for you.</p>
          </div>
        </li>
        <li class="wr-step">
          <span class="wr-step__num" aria-hidden="true">3</span>
          <div class="wr-step__body">
            <h3 class="wr-step__title" data-i18n="retreat_wadi_steps_3_title">Secure your place</h3>
            <p class="wr-host__text" data-i18n="retreat_wadi_registration_text3">After the call, your place is secured with a non-refundable deposit of 400 ₪.</p>
            <p class="wr-host__text" data-i18n="retreat_wadi_registration_text4">Places are limited — priority goes to confirmed bookings.</p>
          </div>
        </li>
      </ol>
      <div class="wr-register-actions" data-sticky-hide>
        <a href="/register/wadi-rum" class="wr-register-btn" data-track-cta="book" data-track-loc="steps">
          <span data-i18n="retreat_wadi_open_form">Open registration form</span>
          <span class="wr-register-btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- 10. FAQ -->
  <section id="wr-faq" class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_faq_title">Questions before you book</h2>
      </div>
      <div class="wr-faq wr-acc" data-acc>
        ${faqItems}
      </div>
    </div>
  </section>

  <!-- 11. FINAL WORD -->
  <section class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_final_title">A final word</h2>
      <div class="wr-final-lines">
        <p class="wr-host__text" data-i18n="retreat_wadi_final_line1">Maybe you don\'t need to escape your life.</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_final_line2">Maybe you just need to step away for five days,</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_final_line3">breathe,</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_final_line4">move,</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_final_line5">listen to yourself,</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_final_line6">and remember who you are beyond all the roles you carry every day.</p>
      </div>
      <p class="wr-host__text" data-i18n="retreat_wadi_final_text2">Wadi Rum is not a promise that it will change your life. It is a space that may help you see clearly what you want to change in it.</p>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section id="wr-book" class="wr-section wr-section--cta" data-sticky-hide>
    <div class="wr-container">
      <div class="wr-cta-panel">
        <div class="wr-cta-panel__head">
          <p class="wr-cta-panel__dates" dir="ltr" data-i18n="retreat_wadi_price_dates">22–26.10.2026</p>
          <p class="wr-cta-panel__place" data-i18n="retreat_wadi_price_place">Wadi Rum, Jordan</p>
          <p class="wr-cta-panel__spots"><span class="wr-cta-panel__spots-dot" aria-hidden="true"></span><span data-i18n="retreat_wadi_spots_left">About 10 spots left</span></p>
        </div>
        <div class="wr-cta-panel__rooms" data-i18n-attr="aria-label:retreat_wadi_rooms_aria" aria-label="Room options">
          <article class="wr-cta-price-card wr-cta-price-card--premium">
            <img class="wr-cta-price-card__photo" ${img('/media/wadi-rum/bubbles/shahrazadluxury-20260914-0001.jpg', [384, 640], '(min-width: 560px) 20rem, 90vw')} alt="" data-i18n-attr="alt:retreat_wadi_stay1_photo_alt" width="800" height="520" loading="lazy" decoding="async">
            <div class="wr-cta-price-card__copy">
              <p class="wr-cta-price-card__line" data-i18n="retreat_wadi_price_bubbles">Bubbles Room — 3,850 ₪</p>
              <p class="wr-cta-price-card__note" data-i18n="retreat_wadi_cta_per_person">per person · double room</p>
            </div>
          </article>
          <article class="wr-cta-price-card">
            <img class="wr-cta-price-card__photo" ${img('/media/wadi-rum/panorama/shahrazadluxury-20260914-0010.jpg', [384, 640], '(min-width: 560px) 20rem, 90vw')} alt="" data-i18n-attr="alt:retreat_wadi_stay2_photo_alt" width="800" height="520" loading="lazy" decoding="async">
            <div class="wr-cta-price-card__copy">
              <p class="wr-cta-price-card__line" data-i18n="retreat_wadi_price_panorama">Panorama Room — 3,650 ₪</p>
              <p class="wr-cta-price-card__note" data-i18n="retreat_wadi_cta_per_person">per person · double room</p>
            </div>
          </article>
        </div>
        <blockquote class="wr-cta-quote">
          <p data-i18n="retreat_wadi_voice2_highlight">From today I have a second, big family.</p>
          <cite data-i18n="retreat_wadi_voice_author">Participant · previous retreat</cite>
        </blockquote>
        <p class="wr-cta-panel__closing" data-i18n="retreat_wadi_final_text3">If, as you read this, you felt: "I need this space"… maybe that is enough of a sign to ask about it.</p>
        <div class="ny-book-actions wr-cta-panel__actions">
          <a href="/register/wadi-rum" class="dahab-includes-cta ny-book-btn-primary wr-cta-panel__btn" data-track-cta="book" data-track-loc="final"><span data-i18n="retreat_wadi_book_now">Submit registration request</span><span aria-hidden="true">→</span></a>
          <div class="ny-book-alt">
            <a href="https://wa.me/972522496366" target="_blank" rel="noopener noreferrer" class="ny-book-wa-link" data-i18n-attr="aria-label:booking_wa_aria" data-track-cta="whatsapp" data-track-loc="final">
              ${waIcon(16)}
              <span data-i18n="booking_wa_or">Or contact us on WhatsApp</span>
            </a>
          </div>
          ${riskLine('final')}
        </div>
      </div>
    </div>
  </section>

  <div class="wr-sticky" data-wr-sticky>
    <div class="wr-sticky__price">
      <span class="wr-sticky__label" data-i18n="retreat_wadi_sticky_from">From</span>
      <strong class="wr-sticky__amount" dir="ltr">3,650 ₪</strong>
    </div>
    <a href="${WA_HREF}" target="_blank" rel="noopener noreferrer" class="wr-sticky__wa" data-i18n-attr="href:retreat_wadi_wa_href" data-track-cta="whatsapp" data-track-loc="sticky">
      ${waIcon(18)}
      <span data-i18n="retreat_wadi_wa_short">WhatsApp</span>
    </a>
    <a href="/register/wadi-rum" class="wr-sticky__cta" data-track-cta="book" data-track-loc="sticky">
      <span data-i18n="retreat_wadi_book_now">Reserve your spot</span>
    </a>
  </div>
</main>`}
    />
  );
}
