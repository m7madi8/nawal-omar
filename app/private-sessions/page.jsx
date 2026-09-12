import LegacyPage from '@/components/LegacyPage';
import { PS_STYLES, PS_INLINE_SCRIPT } from '@/lib/privateSessionsConfig';

export const metadata = {
  title: 'Private Sessions | Nawal Yoga',
  description:
    'Private yoga, sound healing and ice bath experiences with Nawal Yoga — designed around you, your partner or your small group (1–10 people), in Haifa & Atlit Beach.',
  openGraph: {
    title: 'Private Sessions | Nawal Yoga',
    description:
      'Private yoga, sound healing and ice bath experiences with Nawal Yoga — designed around you, your partner or your small group (1–10 people), in Haifa & Atlit Beach.',
    images: [
      {
        url: '/media/brand/Black White Minimalist Simple Logo.png',
        width: 1200,
        height: 1200,
        alt: 'Nawal Omar — Nawal Yoga',
      },
    ],
  },
};

// IMPORTANT — wire this to your Supabase project before shipping:
// replace SUPABASE_URL / SUPABASE_ANON_KEY below (or better, read them from
// env at build time the same way the rest of the legacy forms do — see
// supabase-setup.md / FEEDBACK_SUPABASE_INLINE for the existing convention).
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const SUPABASE_TABLE = 'private_session_requests';

export default function PrivateSessionsPage() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={[]}
      scripts={[]}
      inlineScripts={[PS_INLINE_SCRIPT]}
      currentNav="private-sessions"
      html={`<main id="top" class="ps-page">

  <!-- ============ HERO ============ -->
  <section class="ps-hero">
    <div class="ps-hero__media" aria-hidden="true">
      <img
        src="/media/private-sessions/hero.jpg"
        alt=""
        loading="eager"
        decoding="async"
      >
      <div class="ps-hero__scrim"></div>
    </div>

    <div class="container ps-hero__inner">
      <span class="eyebrow eyebrow--dark" data-en="Private Sessions" data-ar="جلسات خاصة">Private Sessions</span>

      <h1 class="display-xl ps-hero__title">
        <span class="ps-hero__title-line"><span data-en="Private Sessions," data-ar="جلسات خاصة،">Private Sessions,</span></span>
        <span class="ps-hero__title-line ps-hero__title-line--accent"><span class="italic" data-en="Your Way." data-ar="على طريقتكم.">Your Way.</span></span>
      </h1>

      <p class="body-l ps-hero__lead" data-en="Private yoga and wellness experiences designed around you, your group, and your space." data-ar="تجارب يوغا وعافية خاصة، صُممت حولكم وحول المجموعة والمكان.">Private yoga and wellness experiences designed around you, your group, and your space.</p>

      <div class="ps-hero__ctas">
        <a href="#ps-request" class="btn btn--primary" data-en="Book a Private Session" data-ar="احجزوا جلسة خاصة">Book a Private Session</a>
        <a href="#ps-experiences" class="btn btn--ghost btn--ghost-dark" data-en="Explore the Experiences" data-ar="اكتشفوا التجارب">Explore the Experiences</a>
      </div>
    </div>
  </section>

  <!-- ============ INTRO ============ -->
  <section class="section" id="ps-intro">
    <div class="container ps-intro">
      <span class="eyebrow" data-en="What Private Sessions Are" data-ar="ما هي الجلسات الخاصة">What Private Sessions Are</span>
      <h2 class="display-l ps-intro__title reveal">
        <span data-en="A wellness experience " data-ar="تجربة عافية ">A wellness experience </span><span class="italic" data-en="built entirely around you." data-ar="مبنية بالكامل حولكم.">built entirely around you.</span>
      </h2>
      <p class="body-l text-muted ps-intro__lead reveal reveal-delay-1" data-en="Private wellness experiences for individuals, couples, and small groups — up to ten people. You choose the experience; we shape the time, the pace, and the setting around whoever is in the room." data-ar="تجارب عافية خاصة للأفراد والأزواج والمجموعات الصغيرة — حتى عشرة أشخاص. تختارون التجربة، ونحن نصمّم الوقت والإيقاع والمكان حول من يشارك فيها.">Private wellness experiences for individuals, couples, and small groups — up to ten people. You choose the experience; we shape the time, the pace, and the setting around whoever is in the room.</p>
      <div class="ps-intro__meta reveal reveal-delay-2">
        <span data-en="1–10 people" data-ar="١–١٠ أشخاص">1–10 people</span>
        <span aria-hidden="true">·</span>
        <span data-en="Custom quote, no public pricing" data-ar="عرض سعر مخصص، بلا تسعير علني">Custom quote, no public pricing</span>
        <span aria-hidden="true">·</span>
        <span data-en="Haifa & Atlit Beach" data-ar="حيفا وشاطئ عتليت">Haifa & Atlit Beach</span>
      </div>
    </div>
  </section>

  <!-- ============ EXPERIENCES ============ -->
  <section class="section section--bone" id="ps-experiences">
    <div class="container">
      <div class="ps-experiences__head reveal">
        <span class="eyebrow" data-en="Choose an Experience" data-ar="اختاروا تجربة">Choose an Experience</span>
        <h2 class="display-xl"><span data-en="Three ways " data-ar="ثلاث طرق ">Three ways </span><span class="italic" data-en="to slow down." data-ar="للتباطؤ.">to slow down.</span></h2>
      </div>

      <div class="ps-experiences__grid">

        <article class="ps-card reveal" data-session-card="yoga">
          <div class="editorial-image ps-card__media">
            <img src="/media/private-sessions/private-yoga.jpg" alt="Private Yoga with Nawal Yoga" data-en-alt="Private Yoga with Nawal Yoga" data-ar-alt="يوغا خاصة مع نوال يوغا" loading="lazy" decoding="async">
          </div>
          <div class="ps-card__body">
            <span class="eyebrow" data-en="01" data-ar="٠١">01</span>
            <h3 class="display-m ps-card__title" data-en="Private Yoga" data-ar="يوغا خاصة">Private Yoga</h3>
            <p class="body-l ps-card__desc" data-en="A private yoga session tailored to your needs, at the studio or in an outdoor setting." data-ar="جلسة يوغا خاصة ومصممة حسب احتياجاتكم، في الاستوديو أو في مساحة خارجية.">A private yoga session tailored to your needs, at the studio or in an outdoor setting.</p>
            <ul class="ps-card__details">
              <li><span data-en="Duration" data-ar="المدة">Duration</span>: <span data-en="1 hour" data-ar="ساعة واحدة">1 hour</span></li>
              <li><span data-en="Location" data-ar="المكان">Location</span>: <span data-en="Studio or outdoors" data-ar="الاستوديو أو في الخارج">Studio or outdoors</span></li>
              <li><span data-en="Group size" data-ar="عدد المشاركين">Group size</span>: <span data-en="1–10 people" data-ar="١–١٠ أشخاص">1–10 people</span></li>
              <li><span data-en="Area" data-ar="المنطقة">Area</span>: <span data-en="Haifa & Atlit Beach" data-ar="حيفا وشاطئ عتليت">Haifa & Atlit Beach</span></li>
            </ul>
            <button type="button" class="world-cta ps-card__cta" data-select-session="yoga">
              <span data-en="Request this experience" data-ar="اطلبوا هذه التجربة">Request this experience</span>
              <span class="arrow" data-en="→" data-ar="←">→</span>
            </button>
          </div>
        </article>

        <article class="ps-card reveal reveal-delay-1" data-session-card="sound">
          <div class="editorial-image ps-card__media">
            <img src="/media/private-sessions/sound-healing.jpg" alt="Private Sound Healing with Nawal Yoga" data-en-alt="Private Sound Healing with Nawal Yoga" data-ar-alt="ساوند هيلينغ خاص مع نوال يوغا" loading="lazy" decoding="async">
          </div>
          <div class="ps-card__body">
            <span class="eyebrow" data-en="02" data-ar="٠٢">02</span>
            <h3 class="display-m ps-card__title" data-en="Sound Healing" data-ar="ساوند هيلينغ">Sound Healing</h3>
            <p class="body-l ps-card__desc" data-en="A private sound healing experience by the sea, creating space to slow down, relax, and reconnect." data-ar="تجربة ساوند هيلينغ خاصة مقابل البحر، تمنحكم مساحة للهدوء والاسترخاء وإعادة الاتصال بالذات.">A private sound healing experience by the sea, creating space to slow down, relax, and reconnect.</p>
            <ul class="ps-card__details">
              <li><span data-en="Duration" data-ar="المدة">Duration</span>: <span data-en="1.5 hours" data-ar="ساعة ونصف">1.5 hours</span></li>
              <li><span data-en="Location" data-ar="المكان">Location</span>: <span data-en="By the sea" data-ar="مقابل البحر">By the sea</span></li>
              <li><span data-en="Group size" data-ar="عدد المشاركين">Group size</span>: <span data-en="1–10 people" data-ar="١–١٠ أشخاص">1–10 people</span></li>
              <li><span data-en="Area" data-ar="المنطقة">Area</span>: <span data-en="Haifa & Atlit Beach" data-ar="حيفا وشاطئ عتليت">Haifa & Atlit Beach</span></li>
            </ul>
            <button type="button" class="world-cta ps-card__cta" data-select-session="sound">
              <span data-en="Request this experience" data-ar="اطلبوا هذه التجربة">Request this experience</span>
              <span class="arrow" data-en="→" data-ar="←">→</span>
            </button>
          </div>
        </article>

        <article class="ps-card reveal reveal-delay-2" data-session-card="ice">
          <div class="editorial-image ps-card__media">
            <img src="/media/private-sessions/ice-bath.jpg" alt="Private Ice Bath with Nawal Yoga" data-en-alt="Private Ice Bath with Nawal Yoga" data-ar-alt="آيس باث خاص مع نوال يوغا" loading="lazy" decoding="async">
          </div>
          <div class="ps-card__body">
            <span class="eyebrow" data-en="03" data-ar="٠٣">03</span>
            <h3 class="display-m ps-card__title" data-en="Ice Bath" data-ar="آيس باث">Ice Bath</h3>
            <p class="body-l ps-card__desc" data-en="A private ice bath experience combining cold exposure, sauna, and breathwork for a complete mind-body reset." data-ar="تجربة آيس باث خاصة تجمع بين حمام الثلج والساونا وتقنيات التنفس، في تجربة متكاملة للجسم والعقل.">A private ice bath experience combining cold exposure, sauna, and breathwork for a complete mind-body reset.</p>
            <ul class="ps-card__details">
              <li><span data-en="Duration" data-ar="المدة">Duration</span>: <span data-en="2 hours" data-ar="ساعتان">2 hours</span></li>
              <li><span data-en="Location" data-ar="المكان">Location</span>: <span data-en="Ice Guru, Haifa" data-ar="Ice Guru, حيفا">Ice Guru, Haifa</span></li>
              <li><span data-en="Includes" data-ar="يشمل">Includes</span>: <span data-en="Ice Bath + Sauna + Breathwork" data-ar="آيس باث + ساونا + تمارين تنفس">Ice Bath + Sauna + Breathwork</span></li>
              <li><span data-en="Group size" data-ar="عدد المشاركين">Group size</span>: <span data-en="1–10 people" data-ar="١–١٠ أشخاص">1–10 people</span></li>
            </ul>
            <button type="button" class="world-cta ps-card__cta" data-select-session="ice">
              <span data-en="Request this experience" data-ar="اطلبوا هذه التجربة">Request this experience</span>
              <span class="arrow" data-en="→" data-ar="←">→</span>
            </button>
          </div>
        </article>

      </div>
    </div>
  </section>

  <!-- ============ WHY PRIVATE ============ -->
  <section class="section ps-why">
    <div class="container ps-why__grid">
      <div class="ps-why__head reveal">
        <span class="eyebrow" data-en="Why Private" data-ar="لماذا خاصة">Why Private</span>
        <h2 class="display-l"><span data-en="Nothing shared, " data-ar="لا شيء مشترك، ">Nothing shared, </span><span class="italic" data-en="nothing rushed." data-ar="ولا شيء متسرّع.">nothing rushed.</span></h2>
      </div>
      <ul class="ps-why__list">
        <li class="reveal reveal-delay-1">
          <span class="ps-why__num" aria-hidden="true">01</span>
          <h3 class="display-s" data-en="Made for you" data-ar="مصممة لكم">Made for you</h3>
          <p class="body-l text-muted" data-en="No fixed class, no set pace — the session follows your body, your group, and your goals." data-ar="لا حصة ثابتة ولا إيقاع محدد — الجلسة تتبع جسدكم ومجموعتكم وأهدافكم.">No fixed class, no set pace — the session follows your body, your group, and your goals.</p>
        </li>
        <li class="reveal reveal-delay-2">
          <span class="ps-why__num" aria-hidden="true">02</span>
          <h3 class="display-s" data-en="A space of your own" data-ar="مساحة خاصة بكم">A space of your own</h3>
          <p class="body-l text-muted" data-en="Just you, your partner, or your circle — with Nawal's full attention, and nobody else's schedule to work around." data-ar="أنتم فقط، أو مع شريككم، أو مع دائرتكم — مع تركيز نوال الكامل، ودون التقيّد بجدول أحد آخر.">Just you, your partner, or your circle — with Nawal's full attention, and nobody else's schedule to work around.</p>
        </li>
        <li class="reveal reveal-delay-3">
          <span class="ps-why__num" aria-hidden="true">03</span>
          <h3 class="display-s" data-en="Chosen setting" data-ar="مكان تختارونه">Chosen setting</h3>
          <p class="body-l text-muted" data-en="The studio, the beach, or somewhere in between — the setting is part of the experience, not an afterthought." data-ar="الاستوديو، الشاطئ، أو ما بينهما — المكان جزء من التجربة، وليس تفصيلاً ثانوياً.">The studio, the beach, or somewhere in between — the setting is part of the experience, not an afterthought.</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- ============ GROUP / PERSONALIZATION STATEMENT ============ -->
  <section class="section section--bone">
    <div class="container statement">
      <h2 class="display-l reveal" data-en="Alone. As a couple. With your circle." data-ar="وحدكم. مع شريككم. مع دائرتكم.">Alone. As a couple. With your circle.</h2>
      <h2 class="display-l italic reveal reveal-delay-2" style="color:var(--accent);" data-en="Up to ten people — one experience, made for all of you." data-ar="حتى عشرة أشخاص — تجربة واحدة، مصممة لكم جميعاً.">Up to ten people — one experience, made for all of you.</h2>
    </div>
  </section>

  <!-- ============ REQUEST FORM ============ -->
  <section class="section ps-request" id="ps-request">
    <div class="container ps-request__inner">
      <div class="ps-request__head reveal">
        <span class="eyebrow" data-en="Request a Private Session" data-ar="اطلبوا جلسة خاصة">Request a Private Session</span>
        <h2 class="display-l"><span data-en="Tell us what you " data-ar="أخبرونا بما ">Tell us what you </span><span class="italic" data-en="have in mind." data-ar="تفكرون فيه.">have in mind.</span></h2>
        <p class="body-l text-muted" data-en="Share a few details and we'll follow up with a custom quote based on the experience, group size, location and your requirements." data-ar="شاركونا بعض التفاصيل وسنتواصل معكم بعرض سعر مخصص بناءً على التجربة وعدد المشاركين والمكان ومتطلباتكم.">Share a few details and we'll follow up with a custom quote based on the experience, group size, location and your requirements.</p>
      </div>

      <form
        id="psRequestForm"
        class="ps-form reveal reveal-delay-1"
        novalidate
        data-supabase-url="${SUPABASE_URL}"
        data-supabase-anon-key="${SUPABASE_ANON_KEY}"
        data-supabase-table="${SUPABASE_TABLE}"
      >
        <fieldset class="ps-form__field ps-form__field--sessions">
          <legend data-en="Session type" data-ar="نوع الجلسة">Session type</legend>
          <div class="ps-form__sessions">
            <label class="ps-form__session-option">
              <input type="radio" name="sessionType" value="yoga" required>
              <span data-en="Private Yoga" data-ar="يوغا خاصة">Private Yoga</span>
            </label>
            <label class="ps-form__session-option">
              <input type="radio" name="sessionType" value="sound" required>
              <span data-en="Sound Healing" data-ar="ساوند هيلينغ">Sound Healing</span>
            </label>
            <label class="ps-form__session-option">
              <input type="radio" name="sessionType" value="ice" required>
              <span data-en="Ice Bath" data-ar="آيس باث">Ice Bath</span>
            </label>
          </div>
          <p class="ps-form__error" data-field="sessionType" role="alert" hidden></p>
        </fieldset>

        <div class="ps-form__row">
          <div class="ps-form__field">
            <label for="psParticipants" data-en="Number of participants" data-ar="عدد المشاركين">Number of participants</label>
            <select id="psParticipants" name="participants" required>
              <option value="" data-en="Select…" data-ar="اختاروا…">Select…</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <p class="ps-form__error" data-field="participants" role="alert" hidden></p>
          </div>

          <div class="ps-form__field" data-location-field="yoga" hidden>
            <label for="psLocationYoga" data-en="Location" data-ar="المكان">Location</label>
            <select id="psLocationYoga" name="locationYoga">
              <option value="" data-en="Select…" data-ar="اختاروا…">Select…</option>
              <option value="studio" data-en="Studio" data-ar="الاستوديو">Studio</option>
              <option value="outdoors" data-en="Outdoors" data-ar="في الخارج">Outdoors</option>
            </select>
            <p class="ps-form__error" data-field="location" role="alert" hidden></p>
          </div>

          <div class="ps-form__field ps-form__field--static" data-location-field="sound" hidden>
            <span class="ps-form__static-label" data-en="Location" data-ar="المكان">Location</span>
            <span class="ps-form__static-value" data-en="By the sea" data-ar="مقابل البحر">By the sea</span>
          </div>

          <div class="ps-form__field ps-form__field--static" data-location-field="ice" hidden>
            <span class="ps-form__static-label" data-en="Location" data-ar="المكان">Location</span>
            <span class="ps-form__static-value" data-en="Ice Guru, Haifa" data-ar="Ice Guru, حيفا">Ice Guru, Haifa</span>
          </div>
        </div>

        <div class="ps-form__row">
          <div class="ps-form__field">
            <label for="psDate" data-en="Preferred date" data-ar="التاريخ المفضّل">Preferred date</label>
            <input type="date" id="psDate" name="preferredDate" required>
            <p class="ps-form__error" data-field="preferredDate" role="alert" hidden></p>
          </div>
          <div class="ps-form__field">
            <label for="psTime" data-en="Preferred time" data-ar="الوقت المفضّل">Preferred time</label>
            <input type="time" id="psTime" name="preferredTime" required>
            <p class="ps-form__error" data-field="preferredTime" role="alert" hidden></p>
          </div>
        </div>

        <div class="ps-form__row">
          <div class="ps-form__field">
            <label for="psName" data-en="Name" data-ar="الاسم">Name</label>
            <input type="text" id="psName" name="fullName" autocomplete="name" required>
            <p class="ps-form__error" data-field="fullName" role="alert" hidden></p>
          </div>
          <div class="ps-form__field">
            <label for="psPhone" data-en="Phone / WhatsApp" data-ar="الهاتف / واتساب">Phone / WhatsApp</label>
            <input type="tel" id="psPhone" name="phone" autocomplete="tel" required>
            <p class="ps-form__error" data-field="phone" role="alert" hidden></p>
          </div>
        </div>

        <div class="ps-form__field">
          <label for="psEmail" data-en="Email (optional)" data-ar="البريد الإلكتروني (اختياري)">Email (optional)</label>
          <input type="email" id="psEmail" name="email" autocomplete="email">
          <p class="ps-form__error" data-field="email" role="alert" hidden></p>
        </div>

        <div class="ps-form__field">
          <label for="psMessage" data-en="Anything else you'd like us to know?" data-ar="هل هناك شيء آخر تودون مشاركته معنا؟">Anything else you'd like us to know?</label>
          <textarea id="psMessage" name="message" rows="4"></textarea>
        </div>

        <button type="submit" class="btn btn--primary ps-form__submit">
          <span class="ps-form__submit-label" data-en="Send Request" data-ar="إرسال الطلب">Send Request</span>
        </button>

        <p class="ps-form__status" data-form-status role="status" aria-live="polite" hidden></p>
      </form>

      <div class="ps-form__success" data-form-success hidden>
        <h3 class="display-m" data-en="Request Received" data-ar="تم استلام طلبكم">Request Received</h3>
        <p class="body-l" data-en="We'll be in touch soon to coordinate your session and confirm the details." data-ar="سنتواصل معكم قريبًا لتنسيق الجلسة وتأكيد التفاصيل.">We'll be in touch soon to coordinate your session and confirm the details.</p>
      </div>
    </div>
  </section>

  <!-- ============ FINAL CTA ============ -->
  <section class="final-cta">
    <img src="/media/home/hero.jpg" alt="" class="final-cta__image" aria-hidden="true">
    <div class="final-cta__overlay" aria-hidden="true"></div>
    <div class="final-cta__content reveal">
      <h2 class="display-l" data-en="A private session, made entirely for you." data-ar="جلسة خاصة، مصممة بالكامل لكم.">A private session, made entirely for you.</h2>
      <a href="#ps-request" class="btn btn--primary final-cta__cta" data-en="Book a Private Session" data-ar="احجزوا جلسة خاصة">Book a Private Session</a>
    </div>
  </section>

</main>`}
    />
  );
}