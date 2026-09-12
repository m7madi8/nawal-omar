import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Wadi Rum',
  description: 'Wadi Rum women retreat with Nawal Omar. Desert yoga, sound healing, breathwork, and inner reset under the stars.',
};

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
  <section class="wr-hero" aria-labelledby="wadi-hero-title">
    <div class="wr-hero__media" aria-hidden="true">
      <img src="/media/wadi-rum/cover.jpg" alt="" width="1600" height="1200" fetchpriority="high" decoding="async">
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
            <span class="wr-hero__year">2027</span>
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
              <span class="wr-hero__fact-value" dir="ltr" data-i18n="retreat_wadi_hero_meta_date">22–26.10.2027</span>
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
          <a href="/register/wadi-rum" class="wr-hero__cta">
            <span data-i18n="retreat_wadi_book_now">Submit registration request</span>
            <span class="wr-hero__cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- WHO AM I -->
  <section id="wr-about" class="wr-section">
    <div class="wr-container">
      <div class="wr-section__head">
        <h2 class="wr-h2" data-i18n="retreat_wadi_about_title">Who am I?</h2>
      </div>
      <article class="wr-host wr-card">
        <div class="wr-host__media">
          <img src="/media/home/portrait.jpg" alt="Nawal Omar" data-i18n-attr="alt:retreat_wadi_about_nawal_name" loading="lazy">
        </div>
        <div class="wr-host__copy">
          <h3 class="wr-host__name" data-i18n="retreat_wadi_about_nawal_name">Nawal Omar</h3>
          <p class="wr-host__role" data-i18n="retreat_wadi_about_nawal_role">Nurse and Vinyasa Yoga Teacher</p>
          <p class="wr-host__text" data-i18n="retreat_wadi_about_nawal_text">I blend science with body awareness and spiritual practice, creating safe spaces for women to return to their bodies, heal the pelvis, calm the nervous system, and release old patterns that no longer serve them. This retreat is a natural extension of my message.</p>
        </div>
      </article>

      <!-- CO-HOST: Esraa Taye -->
      <article class="wr-host wr-card" style="margin-top:1.5rem;">
        <div class="wr-host__media">
          <img src="/media/wadi-rum/israa.jpeg" alt="Esraa Taye" data-i18n-attr="alt:retreat_wadi_about_esraa_name" loading="lazy">
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

  <section class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_gallery_title">Moments from Wadi Rum</h2>
      <div class="wr-carousel">
        <div class="wr-carousel__track" id="wadi-carousel-track">
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/gallery-01.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt1" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/gallery-02.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt2" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/gallery-03.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt3" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/gallery-04.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt4" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/desert.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt5" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/panorama.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt6" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/tent.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt7" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/camp.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt8" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/cover.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt9" loading="lazy"></figure>
          <figure class="wr-carousel__item"><img src="/media/wadi-rum/night-bivouac.jpg" alt="" data-i18n-attr="alt:retreat_wadi_gallery_alt10" loading="lazy"></figure>
        </div>
        <div class="wr-carousel__controls">
          <button type="button" class="wr-carousel__btn" id="wadi-prev" data-i18n-attr="aria-label:gallery_prev" aria-label="Previous image">←</button>
          <button type="button" class="wr-carousel__btn" id="wadi-next" data-i18n-attr="aria-label:gallery_next" aria-label="Next image">→</button>
        </div>
      </div>
    </div>
  </section>

  <section class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_reels_title">Reels from the retreat</h2>
      <p class="wr-reels-hint" data-i18n="retreat_wadi_reels_hint">Swipe sideways and tap play.</p>
      <div class="wr-reels-grid" data-i18n-attr="aria-label:retreat_wadi_reels_label">
        <div class="wr-reel-card"><video class="wr-reel-video" src="/media/wadi-rum/reel-01.mp4" poster="/media/wadi-rum/gallery-01.jpg" muted playsinline loop preload="metadata" data-i18n-attr="aria-label:retreat_wadi_reel_aria_1"></video><button type="button" class="wr-reel-playbtn" data-i18n-attr="aria-label:retreat_wadi_reel_play"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button></div>
        <div class="wr-reel-card"><video class="wr-reel-video" src="/media/wadi-rum/reel-02.mp4" poster="/media/wadi-rum/gallery-02.jpg" muted playsinline loop preload="metadata" data-i18n-attr="aria-label:retreat_wadi_reel_aria_2"></video><button type="button" class="wr-reel-playbtn" data-i18n-attr="aria-label:retreat_wadi_reel_play"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button></div>
        <div class="wr-reel-card"><video class="wr-reel-video" src="/media/wadi-rum/reel-03.mp4" poster="/media/wadi-rum/gallery-03.jpg" muted playsinline loop preload="metadata" data-i18n-attr="aria-label:retreat_wadi_reel_aria_3"></video><button type="button" class="wr-reel-playbtn" data-i18n-attr="aria-label:retreat_wadi_reel_play"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button></div>
        <div class="wr-reel-card"><video class="wr-reel-video" src="/media/wadi-rum/reel-04.mp4" poster="/media/wadi-rum/gallery-04.jpg" muted playsinline loop preload="metadata" data-i18n-attr="aria-label:retreat_wadi_reel_aria_4"></video><button type="button" class="wr-reel-playbtn" data-i18n-attr="aria-label:retreat_wadi_reel_play"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button></div>
      </div>
    </div>
  </section>

  <section class="wr-section">
    <div class="wr-container">
      <h2 class="wr-h2" data-i18n="retreat_wadi_why_title">Why this retreat is different?</h2>
      <div class="wr-grid-2">
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_1_title">1) The desert returns you to yourself</h3><p data-i18n="retreat_wadi_why_1_text">Desert silence calms overthinking and brings you back to your roots and grounding.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_2_title">2) The women circle heals</h3><p data-i18n="retreat_wadi_why_2_text">A space without judgment or comparison. Women supporting women with awareness and love.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_3_title">3) The body is released</h3><p data-i18n="retreat_wadi_why_3_text">Daily yoga, deep breathwork, and sound healing to restore inner balance.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_why_4_title">4) A true release ritual</h3><p data-i18n="retreat_wadi_why_4_text">Under Wadi Rum stars, we release old patterns and return lighter, clearer, and more aligned.</p></article>
      </div>
    </div>
  </section>

  <section class="wr-section">
    <div class="wr-container">
      <h2 class="wr-h2" data-i18n="retreat_wadi_program_title">Full program</h2>
      <div class="wr-program">
        <article class="wr-day"><div class="wr-day__head"><span class="wr-day__chip" data-i18n="retreat_wadi_day1_chip">Day 01</span><h3 data-i18n="retreat_wadi_day1_title">Arrival &amp; intention setting</h3></div><ul><li data-i18n="retreat_wadi_day1_b1">Meet at Beit Shean crossing and transfer to Wadi Rum.</li><li data-i18n="retreat_wadi_day1_b2">Warm Bedouin welcome and traditional dinner.</li><li data-i18n="retreat_wadi_day1_b3">Deep introductions and intention workshop.</li><li data-i18n="retreat_wadi_day1_b4">Light breath session and calm night under stars.</li></ul></article>
        <article class="wr-day"><div class="wr-day__head"><span class="wr-day__chip" data-i18n="retreat_wadi_day2_chip">Day 02</span><h3 data-i18n="retreat_wadi_day2_title">Desert power day</h3></div><ul><li data-i18n="retreat_wadi_day2_b1">Sunrise yoga focused on root and pelvis.</li><li data-i18n="retreat_wadi_day2_b2">Breathwork, healthy breakfast, and a deep workshop session.</li><li data-i18n="retreat_wadi_day2_b3">Silent reflection + journaling and sound healing session.</li><li data-i18n="retreat_wadi_day2_b4">Star meditation and telescope workshop.</li></ul></article>
        <article class="wr-day"><div class="wr-day__head"><span class="wr-day__chip" data-i18n="retreat_wadi_day3_chip">Day 03</span><h3 data-i18n="retreat_wadi_day3_title">Inner and outer journey</h3></div><ul><li data-i18n="retreat_wadi_day3_b1">Heart-opening yoga + guided meditation.</li><li data-i18n="retreat_wadi_day3_b2">Power cards and emotional writing.</li><li data-i18n="retreat_wadi_day3_b3">Jeep desert tour in Wadi Rum.</li><li data-i18n="retreat_wadi_day3_b4">Sunset yoga with light acro for trust and balance.</li></ul></article>
        <article class="wr-day"><div class="wr-day__head"><span class="wr-day__chip" data-i18n="retreat_wadi_day4_chip">Day 04</span><h3 data-i18n="retreat_wadi_day4_title">Integration and transformation</h3></div><ul><li data-i18n="retreat_wadi_day4_b1">Deep morning yoga to integrate feminine energy.</li><li data-i18n="retreat_wadi_day4_b2">Second workshop session and personal rest time.</li><li data-i18n="retreat_wadi_day4_b3">Camel ride and deep closing sound healing.</li><li data-i18n="retreat_wadi_day4_b4">Light celebration and retreat closing circle.</li></ul></article>
        <article class="wr-day"><div class="wr-day__head"><span class="wr-day__chip" data-i18n="retreat_wadi_day5_chip">Day 05</span><h3 data-i18n="retreat_wadi_day5_title">Farewell and anchoring</h3></div><ul><li data-i18n="retreat_wadi_day5_b1">Closing breakfast and intention anchoring circle.</li><li data-i18n="retreat_wadi_day5_b2">Desert farewell and return with renewed energy.</li></ul></article>
      </div>
    </div>
  </section>

  <!-- ACCOMMODATION -->
  <section class="wr-section">
    <div class="wr-container">
      <div class="wr-booking">
        <h2 class="wr-booking__title" data-i18n="retreat_wadi_accommodation_title">Accommodation</h2>
        <div class="wr-booking__grid wr-booking__grid--stays">
          <article class="wr-booking__block wr-stay-card">
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
            <p class="wr-price-note" data-i18n="retreat_wadi_stay1_price">Price: 3,850 ₪ per person</p>
          </article>
          <article class="wr-booking__block wr-stay-card">
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
            <p class="wr-price-note" data-i18n="retreat_wadi_stay2_price">Price: 3,650 ₪ per person</p>
          </article>
        </div>
        <div class="wr-booking__block wr-includes-block">
          <h4 data-i18n="retreat_wadi_includes_title">Price includes</h4>
          <ul class="wr-booking__list wr-includes-list">
            <li data-i18n="retreat_wadi_inc1">5 days and 4 nights accommodation</li>
            <li data-i18n="retreat_wadi_inc2">Daily breakfast and dinner</li>
            <li data-i18n="retreat_wadi_inc3">3 lunches</li>
            <li data-i18n="retreat_wadi_inc4">Transfers to and from the border crossing</li>
            <li data-i18n="retreat_wadi_inc5">Jeep Tour in Wadi Rum</li>
            <li data-i18n="retreat_wadi_inc6">Camel Ride</li>
            <li data-i18n="retreat_wadi_inc7">Telescope Workshop</li>
            <li data-i18n="retreat_wadi_inc8">Daily Yoga</li>
            <li data-i18n="retreat_wadi_inc9">Breathwork</li>
            <li data-i18n="retreat_wadi_inc10">Meditation</li>
            <li data-i18n="retreat_wadi_inc11">Two deep workshops</li>
            <li data-i18n="retreat_wadi_inc12">Sound Healing</li>
            <li data-i18n="retreat_wadi_inc13">Women\'s circles and sharing spaces</li>
            <li data-i18n="retreat_wadi_inc14">Support and guidance throughout the experience</li>
            <li data-i18n="retreat_wadi_inc15">Professional photography to document the journey</li>
          </ul>
        </div>
        <div class="wr-booking__block wr-payment-block">
          <h4 data-i18n="retreat_wadi_payment_title">Payment and cancellation policy</h4>
          <ul class="wr-booking__list">
            <li data-i18n="retreat_wadi_policy_1">A non-refundable first deposit of 400 ILS confirms booking.</li>
            <li data-i18n="retreat_wadi_policy_2">Remaining amount is due before the retreat date — exact date to be confirmed.</li>
            <li data-i18n="retreat_wadi_policy_3">Available methods: bank transfer or Bit.</li>
            <li data-i18n="retreat_wadi_policy_4">Please send transfer proof image to confirm your booking.</li>
            <li data-i18n="retreat_wadi_policy_5">Seats are limited and priority is for first confirmed bookings.</li>
            <li data-i18n="retreat_wadi_policy_6">Cancellation within 14 days of retreat date is non-refundable.</li>
            <li data-i18n="retreat_wadi_policy_7">No-show is non-refundable. Booking transfer is allowed if you find a replacement.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- WHO IS THIS RETREAT FOR -->
  <section class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_forwhom_title">Who is this retreat for?</h2>
      <p class="wr-lead" data-i18n="retreat_wadi_forwhom_intro">This retreat is for you if:</p>
      <div class="wr-grid-2">
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_1_title">1. You feel you need to pause.</h3><p data-i18n="retreat_wadi_forwhom_1_text">Not because you are weak, but because you have been running between work, people, responsibilities and expectations — and you need space where you come first.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_2_title">2. You feel distant from your body and yourself.</h3><p data-i18n="retreat_wadi_forwhom_2_text">And you want to hear it again through movement, breath and silence — instead of living only from your head.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_3_title">3. You are in a transition or change.</h3><p data-i18n="retreat_wadi_forwhom_3_text">A decision, a relationship, a beginning, an ending, a big question — or even an inner feeling that the old version of you no longer fits.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_4_title">4. You want a women\'s experience with depth and belonging.</h3><p data-i18n="retreat_wadi_forwhom_4_text">A place where you don\'t need to prove anything, compare yourself to anyone, or be a certain image.</p></article>
        <article class="wr-feature"><h3 data-i18n="retreat_wadi_forwhom_5_title">5. You want to give yourself an experience that stays with you.</h3><p data-i18n="retreat_wadi_forwhom_5_text">Not just a trip or a holiday — but days of adventure, laughter, nature, women, movement, calm, and real space for you.</p></article>
      </div>
    </div>
  </section>

  <!-- BEFORE YOU REGISTER -->
  <section class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_before_title">Before you register…</h2>
      <div class="wr-before-lines">
        <p class="wr-host__text" data-i18n="retreat_wadi_before_line1">You don\'t need to practice yoga.</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_before_line2">You don\'t need to be flexible.</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_before_line3">And you don\'t need to be going through something "difficult" to deserve space for yourself.</p>
        <p class="wr-host__text" data-i18n="retreat_wadi_before_line4">It\'s enough that you feel the time has come to choose yourself a little more.</p>
      </div>
    </div>
  </section>

  <!-- REGISTRATION PROCESS -->
  <section class="wr-section">
    <div class="wr-container wr-card">
      <h2 class="wr-h2" data-i18n="retreat_wadi_registration_title">Registration & securing your place</h2>
      <p class="wr-host__text" data-i18n="retreat_wadi_registration_text1">Because this retreat is built around a small women's group and a close, deep experience, final registration is not automatic.</p>
      <p class="wr-host__text" data-i18n="retreat_wadi_registration_text2">After you submit your application, we will contact you for a short phone call to get to know you, understand your expectations, answer your questions, and make sure the experience is right for you.</p>
      <p class="wr-host__text" data-i18n="retreat_wadi_registration_text3">After the call, your place is secured with a non-refundable deposit of 400 ₪.</p>
      <p class="wr-host__text" data-i18n="retreat_wadi_registration_text4">Places are limited — priority goes to confirmed bookings.</p>
    </div>
  </section>

  <!-- FINAL WORD -->
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
  <section class="wr-section wr-section--cta">
    <div class="wr-container">
      <div class="wr-cta-panel">
        <div class="wr-cta-panel__head">
          <p class="wr-cta-panel__dates" data-i18n="retreat_wadi_price_dates">22–26.10.2027</p>
          <p class="wr-cta-panel__place" data-i18n="retreat_wadi_price_place">Wadi Rum, Jordan</p>
        </div>
        <div class="wr-cta-panel__rooms" aria-label="Room options">
          <article class="wr-cta-price-card wr-cta-price-card--premium">
            <p class="wr-cta-price-card__line" data-i18n="retreat_wadi_price_bubbles">Bubbles Room — 3,850 ₪</p>
            <p class="wr-cta-price-card__note" data-i18n="retreat_wadi_cta_per_person">per person · double room</p>
          </article>
          <article class="wr-cta-price-card">
            <p class="wr-cta-price-card__line" data-i18n="retreat_wadi_price_panorama">Panorama Room — 3,650 ₪</p>
            <p class="wr-cta-price-card__note" data-i18n="retreat_wadi_cta_per_person">per person · double room</p>
          </article>
        </div>
        <p class="wr-cta-panel__closing" data-i18n="retreat_wadi_final_text3">If, as you read this, you felt: "I need this space"… maybe that is enough of a sign to ask about it.</p>
        <div class="ny-book-actions wr-cta-panel__actions">
          <a href="/register/wadi-rum" class="dahab-includes-cta ny-book-btn-primary wr-cta-panel__btn"><span data-i18n="retreat_wadi_book_now">Submit registration request</span><span aria-hidden="true">→</span></a>
          <div class="ny-book-alt">
            <a href="https://wa.me/972522496366" target="_blank" rel="noopener noreferrer" class="ny-book-wa-link" data-i18n-attr="aria-label:booking_wa_aria">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span data-i18n="booking_wa_or">Or contact us on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>`}
    />
  );
}