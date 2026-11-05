import LegacyPage from '@/components/LegacyPage';
import { PS_INLINE_SCRIPT, PS_PROGRAM_IMAGES } from '@/lib/privateSessionsConfig';
import { BR_RITUAL_NAME } from '@/lib/bridalRitualConfig';

export const metadata = {
  title: 'Private Sessions | Nawal Yoga',
  description:
    'Private yoga, sound healing, ice bath, and bridal yoga with Nawal — for you or as a gift, alone or with up to 10 friends. Date, time and place arranged after you register.',
  openGraph: {
    title: 'Private Sessions | Nawal Yoga',
    description:
      'Private yoga, sound healing, ice bath, and bridal yoga with Nawal — for you or as a gift, alone or with up to 10 friends. Date, time and place arranged after you register.',
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
        <span class="ps-hero__title-line ps-hero__title-line--accent"><span class="italic" data-en="As you need." data-ar="حسب احتياجك.">As you need.</span></span>
      </h1>

      <p class="body-l ps-hero__lead" data-en="Private yoga and wellness with Nawal — just you, or with your friends (up to 10)." data-ar="جلسات يوغا وعافية خاصة مع نوال — لحالك، أو مع صحباتك (لحد ١٠).">Private yoga and wellness with Nawal — just you, or with your friends (up to 10).</p>

      <div class="ps-hero__ctas">
        <a href="#ps-request" class="btn btn--primary" data-en="Book a private session" data-ar="احجزي جلسة خاصة">Book a private session</a>
        <a href="#ps-gift" class="btn btn--ghost btn--ghost-dark" data-en="Give as a gift" data-ar="اهديها كهدية">Give as a gift</a>
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
      <p class="body-l text-muted ps-intro__lead reveal reveal-delay-1" data-en="Alone, with a friend, or with your circle — up to 10. Choose what fits you, or book any experience as a thoughtful gift. Nawal takes care of the rest after you register." data-ar="لحالك، مع صاحباتك، أو مع العائلة — لحد ١٠. اختاري ما يناسب احتياجك، أو احجزي أي تجربة كهدية. نوال بترتب معك الباقي بعد ما تسجّلي.">Alone, with a friend, or with your circle — up to 10. Choose what fits you, or book any experience as a thoughtful gift. Nawal takes care of the rest after you register.</p>
      <div class="ps-intro__meta reveal reveal-delay-2">
        <span data-en="Up to 10" data-ar="لحد ١٠">Up to 10</span>
        <span aria-hidden="true">·</span>
        <span data-en="Personal follow-up" data-ar="متابعة شخصية">Personal follow-up</span>
        <span aria-hidden="true">·</span>
        <span data-en="Date, time & place after signup" data-ar="التاريخ والوقت والمكان بعد التسجيل">Date, time & place after signup</span>
      </div>
    </div>
  </section>

  <!-- ============ GIFT ============ -->
  <section class="section ps-gift" id="ps-gift">
    <div class="container ps-gift__inner reveal">
      <div class="ps-gift__copy">
        <span class="eyebrow" data-en="A gift of presence" data-ar="هدية حضور">A gift of presence</span>
        <h2 class="display-l ps-gift__title"><span data-en="Any session, " data-ar="أي جلسة، ">Any session, </span><span class="italic" data-en="given with heart." data-ar="من القلب.">given with heart.</span></h2>
        <p class="body-l text-muted" data-en="Yoga, sound healing, ice bath, or A Space for the Bride — register for someone you love. Nawal will coordinate date, place, and how you want the surprise delivered." data-ar="يوغا، ساوند هيلينغ، تجربة حمام الثلج، أو ${BR_RITUAL_NAME.ar} — سجّلي لشخص تحبّيه. نوال بترتب معك الموعد والمكان وطريقة إيصال المفاجأة.">Yoga, sound healing, ice bath, or A Space for the Bride — register for someone you love. Nawal will coordinate date, place, and how you want the surprise delivered.</p>
        <button type="button" class="world-cta ps-gift__cta" data-start-gift>
          <span data-en="Start a gift request" data-ar="ابدئي طلب الهدية">Start a gift request</span>
          <span class="arrow" data-en="→" data-ar="←">→</span>
        </button>
      </div>
      <div class="ps-gift__aside" aria-hidden="true">
        <span class="ps-gift__mark" aria-hidden="true"></span>
        <p class="ps-gift__aside-text" data-en="Perfect for birthdays, milestones, or &quot;just because.&quot;" data-ar="لأعياد الميلاد، المحطات، أو &quot;لأنك تستحقين.&quot;">Perfect for birthdays, milestones, or "just because."</p>
      </div>
    </div>
  </section>

  <!-- ============ EXPERIENCES ============ -->
  <section class="section section--bone" id="ps-experiences">
    <div class="container">
      <div class="ps-experiences__head reveal">
        <span class="eyebrow" data-en="Pick an experience" data-ar="اختاري تجربة">Pick an experience</span>
        <h2 class="display-xl"><span data-en="Four experiences " data-ar="أربع تجارب ">Four experiences </span><span class="italic" data-en="to choose from." data-ar="حسب احتياجك.">to choose from.</span></h2>
      </div>

      <div class="ps-programs">

        <article class="ps-program reveal" id="ps-program-yoga" data-session-card="yoga">
          <div class="ps-program__layout">
            <figure class="ps-program__media editorial-image">
              <img src="${PS_PROGRAM_IMAGES.yoga}" alt="" width="1200" height="1500" loading="lazy" decoding="async" data-en-alt="Private Yoga with Nawal Yoga" data-ar-alt="يوغا خاصة مع نوال يوغا">
            </figure>
            <div class="ps-program__main">
              <header class="ps-program__head">
                <span class="ps-program__index" aria-hidden="true">01</span>
                <div class="ps-program__titles">
                  <h3 class="display-m ps-program__title" data-en="Private Yoga Session" data-ar="يوغا خاصة">Private Yoga Session</h3>
                  <p class="ps-program__tagline" data-en="Body, breath, and balance — built around you." data-ar="جسمك، نفسك، وتوازنك — حسب احتياجك.">Body, breath, and balance — built around you.</p>
                </div>
                <span class="ps-program__gift" data-en="Gift option" data-ar="متاحة كهدية">Gift option</span>
              </header>
              <div class="ps-program__panels">
                <section class="ps-program__panel ps-program__panel--wide">
                  <h4 class="ps-program__panel-title" data-en="About the session" data-ar="عن الجلسة">About the session</h4>
                  <p data-en="Your private space — we work on your body, breath, and balance at your level and personal needs." data-ar="مساحة خاصة إلك، نشتغل فيها على جسمك، تنفّسك وتوازنك، حسب مستواك واحتياجاتك الشخصية.">Your private space — we work on your body, breath, and balance at your level and personal needs.</p>
                  <p data-en="Each session is built for you: strength, flexibility, balance, technique, and mind–body connection. Beginner or experienced — individual attention at a pace that suits you." data-ar="كل تدريب بنبنيه خصيصًا إلك، مع التركيز على تقوية العضلات، زيادة المرونة، تحسين التوازن، تطوير تقنيات اليوغا وتعميق التواصل بين الجسم والعقل. سواء كنتِ مبتدئة أو عندك تجربة سابقة، التدريب الخاص بمنحك اهتمام فردي وتوجيه دقيق.">Each session is built for you: strength, flexibility, balance, technique, and mind–body connection. Beginner or experienced — individual attention at a pace that suits you.</p>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Pricing" data-ar="الأسعار">Pricing</h4>
                  <dl class="ps-program__facts">
                    <div><dt data-en="Individual" data-ar="تدريب فردي">Individual</dt><dd>200 ₪</dd></div>
                    <div><dt data-en="Duo (2 people)" data-ar="تدريب ثنائي">Duo (2 people)</dt><dd>300 ₪ <span class="ps-program__fact-note" data-en="total" data-ar="المجموع">total</span></dd></div>
                  </dl>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Good to know" data-ar="معلومات عملية">Good to know</h4>
                  <dl class="ps-program__facts">
                    <div><dt data-en="Levels" data-ar="المستوى">Levels</dt><dd data-en="All — tailored to your goals" data-ar="جميع المستويات — حسب أهدافك">All — tailored to your goals</dd></div>
                    <div><dt data-en="When &amp; where" data-ar="الوقت والمكان">When &amp; where</dt><dd data-en="With Nawal after you register" data-ar="مع نوال بعد التسجيل">With Nawal after you register</dd></div>
                  </dl>
                </section>
              </div>
              <footer class="ps-program__foot">
                <button type="button" class="world-cta ps-program__cta" data-select-session="yoga"><span data-en="I want this" data-ar="بدي هاي">I want this</span> <span class="arrow" data-en="→" data-ar="←">→</span></button>
              </footer>
            </div>
          </div>
        </article>

        <article class="ps-program ps-program--alt reveal" id="ps-program-sound" data-session-card="sound">
          <div class="ps-program__layout">
            <figure class="ps-program__media editorial-image">
              <img src="${PS_PROGRAM_IMAGES.sound}" alt="" width="1200" height="1500" loading="lazy" decoding="async" data-en-alt="Sound Healing with Nawal Yoga" data-ar-alt="ساوند هيلينغ مع نوال يوغا">
            </figure>
            <div class="ps-program__main">
              <header class="ps-program__head">
                <span class="ps-program__index" aria-hidden="true">02</span>
                <div class="ps-program__titles">
                  <h3 class="display-m ps-program__title" data-en="Sound Healing" data-ar="ساوند هيلينغ">Sound Healing</h3>
                  <p class="ps-program__tagline" data-en="Deep rest through sound — 1 hour 15 minutes." data-ar="استرخاء عميق بالصوت — ساعة وربع.">Deep rest through sound — 1 hour 15 minutes.</p>
                </div>
                <span class="ps-program__gift" data-en="Gift option" data-ar="متاحة كهدية">Gift option</span>
              </header>
              <div class="ps-program__panels">
                <section class="ps-program__panel ps-program__panel--wide">
                  <h4 class="ps-program__panel-title" data-en="What it is" data-ar="ما هي التجربة">What it is</h4>
                  <p data-en="Sound Healing is deep relaxation through sound and vibration — space for the body to settle and the mind to quiet." data-ar="الـ Sound Healing تجربة استرخاء عميقة من خلال الصوت والذبذبات، منسمح فيها للجسم يهدى وللعقل يخفّ شوي من الضجة.">Sound Healing is deep relaxation through sound and vibration — space for the body to settle and the mind to quiet.</p>
                  <p data-en="Nothing to &quot;get right&quot; — come as you are, lie down, listen, and receive. Breathwork and meditation are included; Nawal guides intention during the session." data-ar="ما في إشي لازم &quot;تعملوه صح&quot;… تعالو مثل ما إنتو، تتمددو، تسمعو وتستقبلو التجربة. شامل تنفس وتأمل، وبحكي عن النية بالجلسة نفسها.">Nothing to "get right" — come as you are, lie down, listen, and receive. Breathwork and meditation are included; Nawal guides intention during the session.</p>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Pricing" data-ar="التكلفة">Pricing</h4>
                  <dl class="ps-program__facts">
                    <div><dt data-en="Session" data-ar="الجلسة">Session</dt><dd>700 ₪</dd></div>
                    <div><dt data-en="Duration" data-ar="المدة">Duration</dt><dd data-en="1 h 15 min" data-ar="ساعة وربع">1 h 15 min</dd></div>
                  </dl>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Booking" data-ar="تثبيت الحجز">Booking</h4>
                  <dl class="ps-program__facts">
                    <div><dt data-en="Deposit" data-ar="عربون">Deposit</dt><dd>300 ₪</dd></div>
                    <div class="ps-program__fact-span"><dd data-en="Bank transfer or Bit to confirm your place." data-ar="تحويلة بنكية أو بيت لتثبيت الحجز.">Bank transfer or Bit to confirm your place.</dd></div>
                    <div><dt data-en="Balance" data-ar="الباقي">Balance</dt><dd data-en="Cash or transfer on the day" data-ar="كاش أو تحويلة بيوم اللقاء">Cash or transfer on the day</dd></div>
                  </dl>
                </section>
              </div>
              <footer class="ps-program__foot">
                <button type="button" class="world-cta ps-program__cta" data-select-session="sound"><span data-en="I want this" data-ar="بدي هاي">I want this</span> <span class="arrow" data-en="→" data-ar="←">→</span></button>
              </footer>
            </div>
          </div>
        </article>

        <article class="ps-program reveal" id="ps-program-ice" data-session-card="ice">
          <div class="ps-program__layout">
            <figure class="ps-program__media editorial-image">
              <img src="${PS_PROGRAM_IMAGES.ice}" alt="" width="1200" height="1500" loading="lazy" decoding="async" data-en-alt="Ice bath experience with Nawal Yoga" data-ar-alt="تجربة حمام الثلج مع نوال يوغا">
            </figure>
            <div class="ps-program__main">
              <header class="ps-program__head">
                <span class="ps-program__index" aria-hidden="true">03</span>
                <div class="ps-program__titles">
                  <h3 class="display-m ps-program__title" data-en="Ice Bath Experience" data-ar="تجربة حمام الثلج">Ice Bath Experience</h3>
                  <p class="ps-program__tagline" data-en="Two hours — stillness, challenge, then rest." data-ar="ساعتان — من الهدوء للتحدي للراحة.">Two hours — stillness, challenge, then rest.</p>
                </div>
                <span class="ps-program__gift" data-en="Gift option" data-ar="متاحة كهدية">Gift option</span>
              </header>
              <div class="ps-program__panels">
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="The journey" data-ar="مسار الجلسة">The journey</h4>
                  <ol class="ps-program__steps">
                    <li data-en="Breathwork" data-ar="تقنيات تنفّس">Breathwork</li>
                    <li data-en="Sauna with guided meditation" data-ar="ساونا مع تأمل موجه">Sauna with guided meditation</li>
                    <li data-en="Gradual, fully guided ice bath" data-ar="حمام ثلج تدريجي بإرشاد كامل">Gradual, fully guided ice bath</li>
                  </ol>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Why it matters" data-ar="الفكرة">Why it matters</h4>
                  <p data-en="More than a cold plunge — you learn to meet pressure with breath, work with the nervous system instead of fighting it, and find calm in an intense moment." data-ar="مش بس تحدّي للجسم — بتتعلمي تلتقي الضغط بالنفس، تشتغلي مع جسمك بدل ما تقاومي، وتكتشفي قدرة تهدّي حالك حتى بلحظة مش مريحة.">More than a cold plunge — you learn to meet pressure with breath, work with the nervous system instead of fighting it, and find calm in an intense moment.</p>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Includes" data-ar="يشمل">Includes</h4>
                  <ul class="ps-program__bullets">
                    <li data-en="Breathwork" data-ar="تنفّس">Breathwork</li>
                    <li data-en="Mental preparation &amp; meditation" data-ar="تهيئة ذهنية وتأمل">Mental preparation &amp; meditation</li>
                    <li data-en="Guided ice bath" data-ar="حمام ثلج موجه">Guided ice bath</li>
                    <li data-en="Sauna session" data-ar="جلسة ساونا">Sauna session</li>
                  </ul>
                  <p class="ps-program__duration"><span data-en="Duration" data-ar="المدة">Duration</span>: <strong data-en="2 hours" data-ar="ساعتان">2 hours</strong></p>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Pricing" data-ar="الأسعار">Pricing</h4>
                  <dl class="ps-program__facts">
                    <div><dt data-en="1 person" data-ar="شخص واحد">1 person</dt><dd>480 ₪</dd></div>
                    <div><dt data-en="2 people" data-ar="شخصين">2 people</dt><dd>400 ₪ <span class="ps-program__fact-note" data-en="/ person" data-ar="للشخص">/ person</span></dd></div>
                    <div><dt data-en="3+ people" data-ar="٣+ أشخاص">3+ people</dt><dd>350 ₪ <span class="ps-program__fact-note" data-en="/ person" data-ar="للشخص">/ person</span></dd></div>
                  </dl>
                </section>
              </div>
              <footer class="ps-program__foot">
                <button type="button" class="world-cta ps-program__cta" data-select-session="ice"><span data-en="I want this" data-ar="بدي هاي">I want this</span> <span class="arrow" data-en="→" data-ar="←">→</span></button>
              </footer>
            </div>
          </div>
        </article>

        <article class="ps-program ps-program--ritual ps-program--alt reveal" id="ps-program-bride" data-session-card="bride">
          <div class="ps-program__layout">
            <figure class="ps-program__media editorial-image">
              <img src="${PS_PROGRAM_IMAGES.bride}" alt="" width="1200" height="1500" loading="lazy" decoding="async" data-en-alt="${BR_RITUAL_NAME.en}" data-ar-alt="${BR_RITUAL_NAME.ar}">
            </figure>
            <div class="ps-program__main">
              <header class="ps-program__head">
                <span class="ps-program__index" aria-hidden="true">04</span>
                <div class="ps-program__titles">
                  <h3 class="display-m ps-program__title" data-en="${BR_RITUAL_NAME.en}" data-ar="${BR_RITUAL_NAME.ar}">${BR_RITUAL_NAME.en}</h3>
                  <p class="ps-program__tagline" data-en="Your pause before the aisle — not a group class, a space made for the bride." data-ar="وقفة قبل فرحك — مو حصة جماعية، مساحة صُمّمت للعروس.">Your pause before the aisle — not a group class, a space made for the bride.</p>
                </div>
                <span class="ps-program__gift" data-en="Gift option" data-ar="متاحة كهدية">Gift option</span>
              </header>
              <div class="ps-program__panels">
                <section class="ps-program__panel ps-program__panel--wide">
                  <h4 class="ps-program__panel-title" data-en="Why this space" data-ar="ليش هالمساحة">Why this space</h4>
                  <p data-en="Between fittings, lists, and everyone’s opinions, your body holds the stress even when you smile. This is a private invitation to slow down, breathe, and meet yourself again — before the wedding takes the spotlight." data-ar="بين القياسات، القوائم، وآراء الكل، جسمك بيحمل التوتر حتى وإنتِ مبتسمة. هاي دعوة خاصة تبطّئي، تنفّسي، وتلتقي نفسك من جديد — قبل ما يخطف الفرح كل الضوء.">Between fittings, lists, and everyone’s opinions, your body holds the stress even when you smile. This is a private invitation to slow down, breathe, and meet yourself again — before the wedding takes the spotlight.</p>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="Woven into the visit" data-ar="مكونات التجربة">Woven into the visit</h4>
                  <ul class="ps-program__bullets">
                    <li data-en="Gentle private yoga — release tension, reconnect with your body" data-ar="يوغا خاصة لطيفة — تحرّري التوتر وترجعي لجسمك">Gentle private yoga — release tension, reconnect with your body</li>
                    <li data-en="Guided breathwork &amp; meditation — calm the nervous system" data-ar="تنفّس موجّه وتأمل — تهدئة للجهاز العصبي">Guided breathwork &amp; meditation — calm the nervous system</li>
                    <li data-en="Sound Healing — deep rest through sound and vibration" data-ar="ساوند هيلينغ — استرخاء عميق بالصوت والذبذبات">Sound Healing — deep rest through sound and vibration</li>
                    <li data-en="A letter to your future self — a keepsake after the wedding" data-ar="رسالة لذاتك المستقبلية — تذكار تبقى معك بعد الزفاف">A letter to your future self — a keepsake after the wedding</li>
                  </ul>
                </section>
                <section class="ps-program__panel">
                  <h4 class="ps-program__panel-title" data-en="What you leave with" data-ar="شو بتاخذي معك">What you leave with</h4>
                  <ul class="ps-program__bullets">
                    <li data-en="More ease in body and breath before the big day" data-ar="راحة أكثر في الجسم والنفس قبل اليوم الكبير">More ease in body and breath before the big day</li>
                    <li data-en="A grounded, present version of you walking toward the aisle" data-ar="حضور وثبات وأنتِ تقتربين من الممر">A grounded, present version of you walking toward the aisle</li>
                    <li data-en="Optional formats: just you, your circle, or mother &amp; daughter" data-ar="خيارات: لحالك، مع دائرتك، أو أمّك وإنتِ">Optional formats: just you, your circle, or mother &amp; daughter</li>
                  </ul>
                </section>
                <section class="ps-program__panel ps-program__panel--wide ps-program__panel--cta">
                  <p class="ps-program__nudge" data-en="Ready to claim your hour? Explore the full story, then register or message Nawal — date and place are arranged with you personally." data-ar="جاهزة تخصّصي ساعتك؟ اقرئي التجربة كاملة، ثم سجّلي أو راسلي نوال — التاريخ والمكان بترتبهم معكِ شخصياً.">Ready to claim your hour? Explore the full story, then register or message Nawal — date and place are arranged with you personally.</p>
                </section>
              </div>
              <footer class="ps-program__foot ps-program__foot--split">
                <a href="/private-sessions/bridal-ritual" class="world-cta ps-program__cta"><span data-en="Explore the full experience" data-ar="اكتشفي التجربة كاملة">Explore the full experience</span> <span class="arrow" data-en="→" data-ar="←">→</span></a>
                <button type="button" class="world-cta ps-program__cta ps-program__cta--ghost" data-select-session="bride"><span data-en="Register now" data-ar="سجّلي الآن">Register now</span> <span class="arrow" data-en="→" data-ar="←">→</span></button>
              </footer>
            </div>
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
          <h3 class="display-s" data-en="As you need" data-ar="حسب احتياجك">As you need</h3>
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
      <h2 class="display-l italic reveal reveal-delay-2" style="color:var(--accent);" data-en="Up to 10 — one session, as you need." data-ar="لحد ١٠ — جلسة واحدة، حسب احتياجكن.">Up to 10 — one session, as you need.</h2>
    </div>
  </section>

  <!-- ============ REQUEST FORM ============ -->
  <section class="section ps-request" id="ps-request">
    <div class="container ps-request__inner">
      <div class="ps-request__head reveal">
        <span class="eyebrow" data-en="Book with Nawal" data-ar="احجزي مع نوال">Book with Nawal</span>
        <h2 class="display-l"><span data-en="Tell me what you " data-ar="احكيلي شو ">Tell me what you </span><span class="italic" data-en="have in mind." data-ar="عبالك.">have in mind.</span></h2>
        <p class="body-l text-muted" data-en="A few details are enough. Prices for each experience are listed above. Nawal will message you to confirm date, time, place, and payment (including Sound Healing deposit if applicable)." data-ar="شوي تفاصيل بتكفي. أسعار كل تجربة موجودة فوق. نوال رح ترجعلك لتأكيد التاريخ والوقت والمكان والدفع (بما فيها عربون الساوند هيلينغ إذا انطبق).">A few details are enough. Prices for each experience are listed above. Nawal will message you to confirm date, time, place, and payment (including Sound Healing deposit if applicable).</p>
      </div>

      <form
        id="psRequestForm"
        class="ps-form reveal reveal-delay-1"
        novalidate
      >
        <fieldset class="ps-form__field">
          <legend data-en="Who is this for?" data-ar="لمين الجلسة؟">Who is this for?</legend>
          <div class="ps-form__sessions">
            <label class="ps-form__session-option">
              <input type="radio" name="bookingFor" value="self" checked required>
              <span data-en="For me" data-ar="إلي">For me</span>
            </label>
            <label class="ps-form__session-option">
              <input type="radio" name="bookingFor" value="gift" required>
              <span data-en="A gift for someone" data-ar="هدية لشخص">A gift for someone</span>
            </label>
          </div>
          <p class="ps-form__error" data-field="bookingFor" role="alert" hidden></p>
        </fieldset>

        <div class="ps-form__gift-fields" data-gift-fields hidden>
          <div class="ps-form__field">
            <label for="psGiftRecipient" data-en="Who receives the gift?" data-ar="مين المهدى إليه؟">Who receives the gift?</label>
            <input type="text" id="psGiftRecipient" name="giftRecipient" autocomplete="name">
            <p class="ps-form__hint" data-en="The name Nawal should use when she reaches out (if you want a surprise, say so below)." data-ar="الاسم اللي نوال بتستخدمه لما تتواصل (إذا بدك مفاجأة، احكي تحت).">The name Nawal should use when she reaches out (if you want a surprise, say so below).</p>
            <p class="ps-form__error" data-field="giftRecipient" role="alert" hidden></p>
          </div>
        </div>

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
              <span data-en="Ice Bath Experience" data-ar="تجربة حمام الثلج">Ice Bath Experience</span>
            </label>
            <label class="ps-form__session-option">
              <input type="radio" name="sessionType" value="bride" required>
              <span data-en="${BR_RITUAL_NAME.en}" data-ar="${BR_RITUAL_NAME.ar}">${BR_RITUAL_NAME.en}</span>
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