import LegacyPage from '@/components/LegacyPage';
import { PS_INLINE_SCRIPT } from '@/lib/privateSessionsConfig';

export const metadata = {
  title: 'Private Sessions | Nawal Yoga',
  description:
    'Private yoga, sound healing and ice bath with Nawal — for you alone or with up to 10 friends. Date, time and place arranged personally after you register.',
  openGraph: {
    title: 'Private Sessions | Nawal Yoga',
    description:
      'Private yoga, sound healing and ice bath with Nawal — for you alone or with up to 10 friends. Date, time and place arranged personally after you register.',
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
const SUPABASE_URL = 'https://xzxyskufrqansbhsbdkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph';
const SUPABASE_TABLE = 'retreat_requests';

export default function PrivateSessionsPage() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={['/css/private-sessions.css']}
      scripts={[{ src: '/legacy/js/retreat-request-submit.js', attrs: '  ' }]}
      inlineScripts={[PS_INLINE_SCRIPT]}
      currentNav="private-sessions"
      html={`<main id="top" class="ps-page">

  <!-- ============ HERO ============ -->
  <section class="ps-hero">
    <div class="ps-hero__media" aria-hidden="true">
      <picture>
        <source media="(min-width: 768px)" srcset="/media/events/nature-chocolate-hero.jpg">
        <img
          src="/media/home/hero-m5.jpg"
          alt=""
          loading="eager"
          decoding="async"
        >
      </picture>
      <div class="ps-hero__scrim"></div>
    </div>

    <div class="container ps-hero__inner">
      <span class="eyebrow eyebrow--dark" data-en="Private Sessions" data-ar="جلسات خاصة">Private Sessions</span>

      <h1 class="display-xl ps-hero__title">
        <span class="ps-hero__title-line"><span data-en="Private Sessions," data-ar="جلسات خاصة،">Private Sessions,</span></span>
        <span class="ps-hero__title-line ps-hero__title-line--accent"><span class="italic" data-en="Your way." data-ar="على كيفك.">Your way.</span></span>
      </h1>

      <p class="body-l ps-hero__lead" data-en="Private yoga and wellness with Nawal — just you, or with your friends (up to 10)." data-ar="جلسات يوغا وعافية خاصة مع نوال — لحالك، أو مع صحباتك (لحد ١٠).">Private yoga and wellness with Nawal — just you, or with your friends (up to 10).</p>

      <div class="ps-hero__ctas">
        <a href="#ps-request" class="btn btn--primary" data-en="Book a private session" data-ar="احجزي جلسة خاصة">Book a private session</a>
        <a href="#ps-experiences" class="btn btn--ghost btn--ghost-dark" data-en="See the experiences" data-ar="شوفي التجارب">See the experiences</a>
      </div>
    </div>
  </section>

  <!-- ============ INTRO ============ -->
  <section class="section" id="ps-intro">
    <div class="container ps-intro">
      <span class="eyebrow" data-en="With Nawal" data-ar="مع نوال">With Nawal</span>
      <h2 class="display-l ps-intro__title reveal">
        <span data-en="A session " data-ar="جلسة ">A session </span><span class="italic" data-en="built around you." data-ar="مبنية حواليك.">built around you.</span>
      </h2>
      <p class="body-l text-muted ps-intro__lead reveal reveal-delay-1" data-en="Alone, with a friend, or with your circle — up to 10. You pick the experience; Nawal takes care of the rest after you register." data-ar="لحالك، مع صاحباتك، أو مع العائلة — لحد ١٠. اختاري التجربة، ونوال بترتب معك الباقي بعد ما تسجّلي.">Alone, with a friend, or with your circle — up to 10. You pick the experience; Nawal takes care of the rest after you register.</p>
      <div class="ps-intro__meta reveal reveal-delay-2">
        <span data-en="Up to 10" data-ar="لحد ١٠">Up to 10</span>
        <span aria-hidden="true">·</span>
        <span data-en="Personal follow-up" data-ar="متابعة شخصية">Personal follow-up</span>
        <span aria-hidden="true">·</span>
        <span data-en="Date, time & place after signup" data-ar="التاريخ والوقت والمكان بعد التسجيل">Date, time & place after signup</span>
      </div>
    </div>
  </section>

  <!-- ============ EXPERIENCES ============ -->
  <section class="section section--bone" id="ps-experiences">
    <div class="container">
      <div class="ps-experiences__head reveal">
        <span class="eyebrow" data-en="Pick an experience" data-ar="اختاري تجربة">Pick an experience</span>
        <h2 class="display-xl"><span data-en="Three ways " data-ar="ثلاث تجارب ">Three ways </span><span class="italic" data-en="to slow down." data-ar="للراحة والهدوء.">to slow down.</span></h2>
      </div>

      <div class="ps-experiences__grid">

        <article class="ps-card reveal" data-session-card="yoga">
          <div class="editorial-image ps-card__media">
            <img src="/media/private-sessions/private-yoga.jpg" alt="Private Yoga with Nawal Yoga" data-en-alt="Private Yoga with Nawal Yoga" data-ar-alt="يوغا خاصة مع نوال يوغا" loading="lazy" decoding="async">
          </div>
          <div class="ps-card__body">
            <span class="eyebrow" data-en="01" data-ar="٠١">01</span>
            <h3 class="display-m ps-card__title" data-en="Private Yoga" data-ar="يوغا خاصة">Private Yoga</h3>
            <p class="body-l ps-card__desc" data-en="Yoga at your pace — Nawal adjusts everything to you and your group." data-ar="يوغا على إيقاعك — نوال بترتب كل شي حسبك وحسب مجموعتك.">Yoga at your pace — Nawal adjusts everything to you and your group.</p>
            <ul class="ps-card__details">
              <li><span data-en="Duration" data-ar="المدة">Duration</span>: <span data-en="About 1 hour" data-ar="حوالي ساعة">About 1 hour</span></li>
              <li><span data-en="Group" data-ar="المجموعة">Group</span>: <span data-en="1–10" data-ar="١–١٠">1–10</span></li>
              <li><span data-en="When & where" data-ar="الوقت والمكان">When & where</span>: <span data-en="Arranged with Nawal after signup" data-ar="بتتفقوا مع نوال بعد التسجيل">Arranged with Nawal after signup</span></li>
            </ul>
            <button type="button" class="world-cta ps-card__cta" data-select-session="yoga">
              <span data-en="I want this" data-ar="بدي هاي">I want this</span>
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
            <p class="body-l ps-card__desc" data-en="Sound, breath, and quiet — a space to land and let go." data-ar="صوت، نفس، وهدوء — مساحة تهدي فيها وتفضي.">Sound, breath, and quiet — a space to land and let go.</p>
            <ul class="ps-card__details">
              <li><span data-en="Duration" data-ar="المدة">Duration</span>: <span data-en="About 1.5 hours" data-ar="حوالي ساعة ونصف">About 1.5 hours</span></li>
              <li><span data-en="Group" data-ar="المجموعة">Group</span>: <span data-en="1–10" data-ar="١–١٠">1–10</span></li>
              <li><span data-en="When & where" data-ar="الوقت والمكان">When & where</span>: <span data-en="Arranged with Nawal after signup" data-ar="بتتفقوا مع نوال بعد التسجيل">Arranged with Nawal after signup</span></li>
            </ul>
            <button type="button" class="world-cta ps-card__cta" data-select-session="sound">
              <span data-en="I want this" data-ar="بدي هاي">I want this</span>
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
            <p class="body-l ps-card__desc" data-en="Ice bath, sauna, and breath — a full reset for body and mind." data-ar="آيس باث، ساونا، وتنفس — رستارت كامل للجسم والراس.">Ice bath, sauna, and breath — a full reset for body and mind.</p>
            <ul class="ps-card__details">
              <li><span data-en="Duration" data-ar="المدة">Duration</span>: <span data-en="About 2 hours" data-ar="حوالي ساعتين">About 2 hours</span></li>
              <li><span data-en="Includes" data-ar="يشمل">Includes</span>: <span data-en="Ice bath + sauna + breathwork" data-ar="آيس باث + ساونا + تنفس">Ice bath + sauna + breathwork</span></li>
              <li><span data-en="Group" data-ar="المجموعة">Group</span>: <span data-en="1–10" data-ar="١–١٠">1–10</span></li>
              <li><span data-en="When & where" data-ar="الوقت والمكان">When & where</span>: <span data-en="Arranged with Nawal after signup" data-ar="بتتفقوا مع نوال بعد التسجيل">Arranged with Nawal after signup</span></li>
            </ul>
            <button type="button" class="world-cta ps-card__cta" data-select-session="ice">
              <span data-en="I want this" data-ar="بدي هاي">I want this</span>
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
          <h3 class="display-s" data-en="Made for you" data-ar="على كيفك">Made for you</h3>
          <p class="body-l text-muted" data-en="No fixed class, no rush — Nawal moves at your pace and your group's." data-ar="ما في حصة جاهزة ولا استعجال — نوال بتمشي على إيقاعك وإيقاع العائلة.">No fixed class, no rush — Nawal moves at your pace and your group's.</p>
        </li>
        <li class="reveal reveal-delay-2">
          <span class="ps-why__num" aria-hidden="true">02</span>
          <h3 class="display-s" data-en="Just you & Nawal" data-ar="إنتِ ونوال">Just you & Nawal</h3>
          <p class="body-l text-muted" data-en="You, a friend, or your girls — Nawal's full attention, no one else's timetable." data-ar="إنتِ، صاحباتك، أو العائلة — تركيز نوال كامل، بدون جدول حدا تاني.">You, a friend, or your girls — Nawal's full attention, no one else's timetable.</p>
        </li>
        <li class="reveal reveal-delay-3">
          <span class="ps-why__num" aria-hidden="true">03</span>
          <h3 class="display-s" data-en="We figure it out together" data-ar="بترتبوا سوا">We figure it out together</h3>
          <p class="body-l text-muted" data-en="Date, time, and place — all sorted personally with Nawal after you send your request." data-ar="التاريخ، الوقت، والمكان — كله بيترتب مع نوال شخصياً بعد ما تبعتيلها الطلب.">Date, time, and place — all sorted personally with Nawal after you send your request.</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- ============ GROUP / PERSONALIZATION STATEMENT ============ -->
  <section class="section section--bone">
    <div class="container statement">
      <h2 class="display-l reveal" data-en="Alone. With a friend. With your girls." data-ar="لحالك. مع صاحباتك. مع العائلة.">Alone. With a friend. With your girls.</h2>
      <h2 class="display-l italic reveal reveal-delay-2" style="color:var(--accent);" data-en="Up to 10 — one session, made for you." data-ar="لحد ١٠ — جلسة واحدة، على كيفكن.">Up to 10 — one session, made for you.</h2>
    </div>
  </section>

  <!-- ============ REQUEST FORM ============ -->
  <section class="section ps-request" id="ps-request">
    <div class="container ps-request__inner">
      <div class="ps-request__head reveal">
        <span class="eyebrow" data-en="Book with Nawal" data-ar="احجزي مع نوال">Book with Nawal</span>
        <h2 class="display-l"><span data-en="Tell me what you " data-ar="احكيلي شو ">Tell me what you </span><span class="italic" data-en="have in mind." data-ar="عبالك.">have in mind.</span></h2>
        <p class="body-l text-muted" data-en="A few details are enough. Nawal will message you to agree on date, time, place, and price." data-ar="شوي تفاصيل بتكفي. نوال رح ترجعلك وترتبوا سوا التاريخ والوقت والمكان والسعر.">A few details are enough. Nawal will message you to agree on date, time, place, and price.</p>
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
          <legend data-en="What do you want?" data-ar="شو بدك؟">What do you want?</legend>
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

        <div class="ps-form__field">
          <label for="psParticipants" data-en="How many of you? (max 10)" data-ar="كم بنت/كم شخص؟ (حد أقصى ١٠)">How many of you? (max 10)</label>
          <input type="number" id="psParticipants" name="participants" min="1" max="10" step="1" inputmode="numeric" placeholder="1–10" required>
          <p class="ps-form__hint" data-en="Type a number from 1 to 10." data-ar="اكتبي رقم بين ١ و١٠.">Type a number from 1 to 10.</p>
          <p class="ps-form__error" data-field="participants" role="alert" hidden></p>
        </div>

        <p class="ps-form__note" data-en="Date, time, and place are agreed personally with Nawal after you register — no need to fill them in here." data-ar="التاريخ والوقت والمكان بتتفقوا عليهم مع نوال شخصياً بعد التسجيل — ما في داعي تكتبيهم هون.">Date, time, and place are agreed personally with Nawal after you register — no need to fill them in here.</p>

        <div class="ps-form__row">
          <div class="ps-form__field">
            <label for="psName" data-en="Your name" data-ar="اسمك">Your name</label>
            <input type="text" id="psName" name="fullName" autocomplete="name" required>
            <p class="ps-form__error" data-field="fullName" role="alert" hidden></p>
          </div>
          <div class="ps-form__field">
            <label for="psPhone" data-en="Mobile / WhatsApp" data-ar="موبايل / واتساب">Mobile / WhatsApp</label>
            <input type="tel" id="psPhone" name="phone" autocomplete="tel" required>
            <p class="ps-form__error" data-field="phone" role="alert" hidden></p>
          </div>
        </div>

        <div class="ps-form__field">
          <label for="psMessage" data-en="Anything else you want to tell Nawal?" data-ar="في شي بدك تحكيلي إياه لنوال؟">Anything else you want to tell Nawal?</label>
          <textarea id="psMessage" name="message" rows="4"></textarea>
        </div>

        <button type="submit" class="btn btn--primary ps-form__submit">
          <span class="ps-form__submit-label" data-en="Send my request" data-ar="ابعتي الطلب">Send my request</span>
        </button>

        <p class="ps-form__status" data-form-status role="status" aria-live="polite" hidden></p>
      </form>

      <div class="ps-form__success" data-form-success hidden>
        <h3 class="display-m" data-en="Got it!" data-ar="وصل الطلب!">Got it!</h3>
        <p class="body-l" data-en="Nawal will message you soon to agree on date, time, place, and everything else." data-ar="نوال رح ترجعلك قريب عشان ترتبوا سوا التاريخ والوقت والمكان وكل التفاصيل.">Nawal will message you soon to agree on date, time, place, and everything else.</p>
      </div>
    </div>
  </section>

</main>`}
    />
  );
}