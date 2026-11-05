import LegacyPage from '@/components/LegacyPage';
import { BR_INLINE_SCRIPT, BR_RITUAL_NAME } from '@/lib/bridalRitualConfig';
import { PS_PROGRAM_IMAGES } from '@/lib/privateSessionsConfig';

export const metadata = {
  title: 'A Space for the Bride | Nawal Yoga',
  description:
    'Private pre-wedding wellness for the bride: gentle yoga, breathwork, Sound Healing, meditation, and a letter to your future self. Register or message Nawal.',
  openGraph: {
    title: 'A Space for the Bride | Nawal Yoga',
    description:
      'Yoga, breath, sound, and stillness — a private space before your wedding. Alone, with your circle, or with your mother.',
    images: [
      {
        url: '/media/private-sessions/bride.jpg',
        width: 1200,
        height: 1500,
        alt: 'Nawal Yoga — A Space for the Bride',
      },
    ],
  },
};

const html = `
<main id="top" class="br-page">
  <section class="br-hero" aria-labelledby="br-hero-title">
    <div class="br-hero__media" aria-hidden="true">
      <img src="${PS_PROGRAM_IMAGES.bride}" alt="" width="1284" height="1605" decoding="async" fetchpriority="high" data-en-alt="${BR_RITUAL_NAME.en}" data-ar-alt="${BR_RITUAL_NAME.ar}">
    </div>
    <div class="br-hero__scrim" aria-hidden="true"></div>
    <div class="container br-hero__inner">
      <a href="/private-sessions" class="br-back" data-en="Private Sessions" data-ar="جلسات خاصة">Private Sessions</a>
      <p class="br-hero__eyebrow" data-en="${BR_RITUAL_NAME.en}" data-ar="${BR_RITUAL_NAME.ar}">${BR_RITUAL_NAME.en}</p>
      <h1 id="br-hero-title" class="display-xl br-hero__title">
        <span class="br-hero__title-line" data-en="Before the forever," data-ar="قبل كل البدايات،">Before the forever,</span>
        <span class="br-hero__title-line br-hero__title-line--soft" data-en="claim a space that is yours." data-ar="امنحي نفسك مساحة إلك.">claim a space that is yours.</span>
      </h1>
      <p class="body-l br-hero__lead" data-en="Gentle yoga, breathwork, Sound Healing, and quiet presence — woven into one private experience with Nawal. Slow down, release what the preparations stored in your body, and walk toward your day feeling grounded, not emptied." data-ar="يوغا لطيفة، تنفّس، ساوند هيلينغ، وحضور هادئ — تجربة خاصة واحدة مع نوال. تبطّئي، حرّري ما خبّاه التحضير في جسمك، واقتربي من يومك وإنتِ ثابتة مو مرهقة.">Gentle yoga, breathwork, Sound Healing, and quiet presence — woven into one private experience with Nawal. Slow down, release what the preparations stored in your body, and walk toward your day feeling grounded, not emptied.</p>
      <ul class="br-hero__chips" aria-label="Experience highlights">
        <li data-en="Private yoga" data-ar="يوغا خاصة">Private yoga</li>
        <li data-en="Breathwork" data-ar="تنفّس">Breathwork</li>
        <li data-en="Sound Healing" data-ar="ساوند هيلينغ">Sound Healing</li>
        <li data-en="Letter ritual" data-ar="رسالة للمستقبل">Letter ritual</li>
      </ul>
      <div class="br-hero__actions">
        <a href="#" class="btn btn--primary" data-br-wa data-track-cta="whatsapp" data-track-loc="hero" target="_blank" rel="noopener noreferrer" data-en="Message Nawal to reserve" data-ar="راسلي نوال للحجز">Message Nawal to reserve</a>
        <a href="/private-sessions?session=bride#ps-request" class="btn btn--ghost" data-en="Register on the site" data-ar="سجّلي عبر الموقع">Register on the site</a>
      </div>
    </div>
  </section>

  <section class="br-story" id="br-story" aria-labelledby="br-story-title">
    <div class="container br-story__grid">
      <div class="br-story__copy reveal">
        <span class="eyebrow" data-en="Your moment" data-ar="لحظتك">Your moment</span>
        <h2 id="br-story-title" class="display-l br-story__title">
          <span class="br-story__title-line" data-en="The wedding is about two." data-ar="الزفاف يجمع شخصين،">The wedding is about two.</span>
          <span class="br-story__title-line italic" data-en="This hour is about you." data-ar="لكن هذه الساعة إلك.">This hour is about you.</span>
        </h2>
        <div class="br-story__body">
          <p data-en="Everyone asks about the dress, the venue, the guest list. Rarely about your breath, your sleep, the tightness in your shoulders." data-ar="الكل بيسأل عن الفستان، القاعة، قائمة المعازيم. نادراً عن نفسك، نومك، والتوتر اللي بكتافك.">Everyone asks about the dress, the venue, the guest list. Rarely about your breath, your sleep, the tightness in your shoulders.</p>
          <p data-en="${BR_RITUAL_NAME.en} is not another task on your checklist. It is permission to arrive at your wedding as a woman who already feels full — not someone running on empty." data-ar="«${BR_RITUAL_NAME.ar}» مو مهمة زيادة على قائمتك. هي إذن تصلي لفرحك وإنتِ ممتلئة — مو مرهقة.">${BR_RITUAL_NAME.en} is not another task on your checklist. It is permission to arrive at your wedding as a woman who already feels full — not someone running on empty.</p>
          <p data-en="Come alone, with the women who raised you, or with your closest circle. Nawal shapes each visit around you." data-ar="تعالي لحالك، مع اللي ربّوك، أو مع أقرب صحباتك. نوال بتشكّل كل لقاء حواليك.">Come alone, with the women who raised you, or with your closest circle. Nawal shapes each visit around you.</p>
        </div>
      </div>
      <figure class="br-story__visual reveal reveal-delay-1">
        <img src="/media/home/moment-03.jpeg" alt="" width="1200" height="1500" loading="lazy" decoding="async" data-en-alt="Bridal wellness moment" data-ar-alt="لحظة عافية للعروس">
      </figure>
    </div>
  </section>

  <section class="br-benefits" id="br-benefits" aria-labelledby="br-benefits-title">
    <div class="container">
      <header class="br-benefits__head reveal">
        <span class="eyebrow" data-en="Why brides come" data-ar="ليش العروسات بيجوا">Why brides come</span>
        <h2 id="br-benefits-title" class="display-l" data-en="Benefits you can feel" data-ar="فوائد تحسيها">Benefits you can feel</h2>
        <p class="body-l text-muted" data-en="Not performance. Not perfection. Real relief before the noise of the day." data-ar="مو أداء ولا كمال. راحة حقيقية قبل ضجيج اليوم.">Not performance. Not perfection. Real relief before the noise of the day.</p>
      </header>
      <ul class="br-benefits__grid">
        <li class="br-benefit reveal">
          <span class="br-benefit__icon" aria-hidden="true">01</span>
          <h3 class="br-benefit__title" data-en="Calm the nervous system" data-ar="تهدئة الجهاز العصبي">Calm the nervous system</h3>
          <p class="br-benefit__text" data-en="Guided breathwork and meditation help your body shift out of “planning mode” into presence." data-ar="تنفّس موجّه وتأمل يساعدان جسمك يخرج من «وضع التخطيط» إلى حضور حقيقي.">Guided breathwork and meditation help your body shift out of “planning mode” into presence.</p>
        </li>
        <li class="br-benefit reveal reveal-delay-1">
          <span class="br-benefit__icon" aria-hidden="true">02</span>
          <h3 class="br-benefit__title" data-en="Release in the body" data-ar="تحرّر في الجسم">Release in the body</h3>
          <p class="br-benefit__text" data-en="Gentle yoga and mindful movement ease tension you may not even notice you’re carrying." data-ar="يوغا لطيفة وحركة واعية تخفّف التوتر اللي ممكن ما تحسي فيه.">Gentle yoga and mindful movement ease tension you may not even notice you’re carrying.</p>
        </li>
        <li class="br-benefit reveal reveal-delay-2">
          <span class="br-benefit__icon" aria-hidden="true">03</span>
          <h3 class="br-benefit__title" data-en="Deep rest through sound" data-ar="راحة عميقة بالصوت">Deep rest through sound</h3>
          <p class="br-benefit__text" data-en="Sound Healing invites stillness — bowls, vibration, and space for the mind to soften." data-ar="الساوند هيلينغ يدعو للسكون — أوعية، ذبذبات، ومساحة للعقل يهدى.">Sound Healing invites stillness — bowls, vibration, and space for the mind to soften.</p>
        </li>
        <li class="br-benefit reveal reveal-delay-3">
          <span class="br-benefit__icon" aria-hidden="true">04</span>
          <h3 class="br-benefit__title" data-en="A memory that stays" data-ar="ذاكرة تبقى">A memory that stays</h3>
          <p class="br-benefit__text" data-en="You leave with a letter to your future self — something to open again after the wedding." data-ar="بتخرجي برسالة لذاتك المستقبلية — تفتحيها من جديد بعد الزفاف.">You leave with a letter to your future self — something to open again after the wedding.</p>
        </li>
      </ul>
    </div>
  </section>

  <section class="br-includes" aria-labelledby="br-includes-title">
    <div class="container reveal">
      <h2 id="br-includes-title" class="br-includes__title" data-en="Everything woven into your visit" data-ar="كل ما يدخل في زيارتك">Everything woven into your visit</h2>
      <ul class="br-includes__list">
        <li data-en="Gentle private yoga" data-ar="يوغا خاصة لطيفة">Gentle private yoga</li>
        <li data-en="Breathwork &amp; meditation" data-ar="تنفّس وتأمل">Breathwork &amp; meditation</li>
        <li data-en="Sound Healing session" data-ar="جلسة ساوند هيلينغ">Sound Healing session</li>
        <li data-en="Guided intention &amp; stillness" data-ar="نية موجّهة وسكون">Guided intention &amp; stillness</li>
        <li data-en="Letter to your future self" data-ar="رسالة لذاتك المستقبلية">Letter to your future self</li>
      </ul>
      <p class="br-includes__note body-l text-muted" data-en="Each element is paced for you — nothing to perform, nothing to get “right.”" data-ar="كل جزء بإيقاع يناسبك — ما في شي تقدّميه، ولا شي لازم «تعمليه صح».">Each element is paced for you — nothing to perform, nothing to get “right.”</p>
    </div>
  </section>

  <section class="br-journey" id="br-journey" aria-labelledby="br-journey-heading">
    <div class="container">
      <header class="br-journey__head reveal">
        <span class="eyebrow" data-en="How it unfolds" data-ar="كيف تمشي التجربة">How it unfolds</span>
        <h2 id="br-journey-heading" class="display-l" data-en="Four gentle stages" data-ar="أربع محطات بلطف">Four gentle stages</h2>
        <p class="body-l text-muted" data-en="A guided flow with Nawal — yoga, breath, sound, and a closing ritual shaped to you." data-ar="مسار موجّه مع نوال — يوغا، تنفّس، صوت، وختام يُشكَّل على مقاسك.">A guided flow with Nawal — yoga, breath, sound, and a closing ritual shaped to you.</p>
      </header>
      <ol class="br-journey__list">
        <li class="br-stage reveal">
          <span class="br-stage__num">01</span>
          <h3 class="br-stage__title" data-en="Arrive &amp; unwind" data-ar="اتركي الضجيج خلفك">Arrive &amp; unwind</h3>
          <p class="br-stage__text" data-en="Warm welcome, soft atmosphere, and time to land in your body before anything begins." data-ar="استقبال دافئ، أجواء ناعمة، ووقت ترسو فيه في جسمك قبل ما يبدأ أي شي.">Warm welcome, soft atmosphere, and time to land in your body before anything begins.</p>
          <div class="br-stage__media" aria-hidden="true"><img src="/media/home/hero-m5.jpg" alt="" loading="lazy" decoding="async"></div>
        </li>
        <li class="br-stage reveal reveal-delay-1">
          <span class="br-stage__num">02</span>
          <h3 class="br-stage__title" data-en="Move &amp; release" data-ar="تحرّري بالحركة">Move &amp; release</h3>
          <p class="br-stage__text" data-en="Private yoga and mindful stretching — strength without strain, movement that listens to you." data-ar="يوغا خاصة وتمدد واعٍ — قوة بدون إجهاد، حركة تسمعك.">Private yoga and mindful stretching — strength without strain, movement that listens to you.</p>
          <div class="br-stage__media" aria-hidden="true"><img src="/media/home/1w.jpeg" alt="" loading="lazy" decoding="async"></div>
        </li>
        <li class="br-stage reveal reveal-delay-2">
          <span class="br-stage__num">03</span>
          <h3 class="br-stage__title" data-en="Breath, sound &amp; deep rest" data-ar="تنفّس، صوت، وراحة">Breath, sound &amp; deep rest</h3>
          <p class="br-stage__text" data-en="Guided breathing and Sound Healing — bowls and vibration that let the mind exhale what it’s been holding." data-ar="تنفّس موجّه وساوند هيلينغ — أوعية وذبذبات تسمح للعقل يزفر ما كان يحمله.">Guided breathing and Sound Healing — bowls and vibration that let the mind exhale what it’s been holding.</p>
          <div class="br-stage__media" aria-hidden="true"><img src="/media/events/sound-healing-01.jpg" alt="" loading="lazy" decoding="async"></div>
        </li>
        <li class="br-stage reveal reveal-delay-3">
          <span class="br-stage__num">04</span>
          <h3 class="br-stage__title" data-en="Letter to my future self" data-ar="رسالة إلى نفسي القادمة">Letter to my future self</h3>
          <p class="br-stage__text" data-en="A quiet closing: you write to the woman you’ll be after the wedding — words to keep, open, and remember." data-ar="ختام هادئ: تكتبي للمرأة اللي رح تكونينها بعد الزفاف — كلمات تحتفظين فيها، تفتحيها، وتتذكّري.">A quiet closing: you write to the woman you’ll be after the wedding — words to keep, open, and remember.</p>
          <div class="br-stage__media" aria-hidden="true"><img src="/media/home/moment-06.jpeg" alt="" loading="lazy" decoding="async"></div>
        </li>
      </ol>
      <div class="br-journey__cta-wrap reveal">
        <a href="/private-sessions?session=bride#ps-request" class="btn btn--primary" data-en="Register your space" data-ar="سجّلي مساحتك">Register your space</a>
        <a href="#" class="btn btn--ghost br-journey__wa" data-br-wa data-track-cta="whatsapp" data-track-loc="journey" target="_blank" rel="noopener noreferrer" data-en="Or ask on WhatsApp" data-ar="أو اسألي على واتساب">Or ask on WhatsApp</a>
      </div>
    </div>
  </section>

  <section class="br-options" id="br-options" aria-labelledby="br-options-title">
    <div class="container">
      <header class="reveal">
        <span class="eyebrow" data-en="Choose your shape" data-ar="اختاري شكل تجربتك">Choose your shape</span>
        <h2 id="br-options-title" class="display-l" data-en="Three ways to share the experience" data-ar="ثلاث طرق لتعيشي التجربة">Three ways to share the experience</h2>
        <p class="body-l text-muted br-options__lead" data-en="Same heart — yoga, breath, and sound — in the company that feels right for you." data-ar="نفس الروح — يوغا، تنفّس، وصوت — مع من تحبّين تشاركيهم.">Same heart — yoga, breath, and sound — in the company that feels right for you.</p>
      </header>
      <div class="br-options__grid">
        <article class="br-option reveal">
          <div class="br-option__media"><img src="${PS_PROGRAM_IMAGES.bride}" alt="" loading="lazy" decoding="async"></div>
          <div class="br-option__body">
            <h3 class="br-option__title" data-en="The Bride" data-ar="العروس">The Bride</h3>
            <p class="br-option__desc" data-en="Just you and Nawal — one private hour to breathe, move, receive sound, and write your letter." data-ar="إنتِ ونوال — ساعة خاصة تنفّسي، تتحرّكي، تستقبلي الصوت، وتكتبي رسالتك.">Just you and Nawal — one private hour to breathe, move, receive sound, and write your letter.</p>
            <a href="#" class="world-cta br-option__cta" data-br-wa data-br-wa-option="bride" data-track-cta="whatsapp" data-track-loc="option-bride" target="_blank" rel="noopener noreferrer"><span data-en="Reserve this format" data-ar="احجزي هذا الخيار">Reserve this format</span> <span class="arrow" data-en="→" data-ar="←">→</span></a>
          </div>
        </article>
        <article class="br-option reveal reveal-delay-1">
          <div class="br-option__media"><img src="/media/home/moment-04.jpeg" alt="" loading="lazy" decoding="async"></div>
          <div class="br-option__body">
            <h3 class="br-option__title" data-en="Bride &amp; her circle" data-ar="العروس ودائرتها">Bride &amp; her circle</h3>
            <p class="br-option__desc" data-en="Your closest women share the space — laughter, tears, yoga, and sound together before the big day." data-ar="أقرب النساء حواليك يشاركن المساحة — ضحك، دموع، يوغا، وصوت سوا قبل اليوم الكبير.">Your closest women share the space — laughter, tears, yoga, and sound together before the big day.</p>
            <a href="#" class="world-cta br-option__cta" data-br-wa data-br-wa-option="circle" data-track-cta="whatsapp" data-track-loc="option-circle" target="_blank" rel="noopener noreferrer"><span data-en="Reserve this format" data-ar="احجزي هذا الخيار">Reserve this format</span> <span class="arrow" data-en="→" data-ar="←">→</span></a>
          </div>
        </article>
        <article class="br-option reveal reveal-delay-2">
          <div class="br-option__media"><img src="/media/home/trainer.jpg" alt="" loading="lazy" decoding="async"></div>
          <div class="br-option__body">
            <h3 class="br-option__title" data-en="Mother &amp; bride" data-ar="الأم والعروس">Mother &amp; bride</h3>
            <p class="br-option__desc" data-en="A tender hour for mother and daughter — breath, touch, memory, and presence before the aisle." data-ar="ساعة حنونة للأم والابنة — نفس، لمسة، ذاكرة، وحضور قبل الممر.">A tender hour for mother and daughter — breath, touch, memory, and presence before the aisle.</p>
            <a href="#" class="world-cta br-option__cta" data-br-wa data-br-wa-option="mother" data-track-cta="whatsapp" data-track-loc="option-mother" target="_blank" rel="noopener noreferrer"><span data-en="Reserve this format" data-ar="احجزي هذا الخيار">Reserve this format</span> <span class="arrow" data-en="→" data-ar="←">→</span></a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="br-closing" id="br-closing" aria-labelledby="br-closing-title">
    <div class="container reveal">
      <span class="eyebrow" data-en="Before the aisle" data-ar="قبل الممر">Before the aisle</span>
      <h2 id="br-closing-title" class="display-l br-closing__title">
        <span data-en="You’ve planned every detail." data-ar="خطّطتي كل التفاصيل.">You’ve planned every detail.</span>
        <span class="italic" data-en="Now plan how you want to feel." data-ar="هلّق خطّطي كيف بدك تحسي.">Now plan how you want to feel.</span>
      </h2>
      <p class="br-closing__text" data-en="Register in a minute, or message Nawal — she’ll confirm date, place, and the format that fits you. You can also gift this space to a bride you love." data-ar="سجّلي بدقيقة، أو راسلي نوال — بتأكد معك التاريخ، المكان، والشكل اللي يناسبك. وفي إمكانية تهدي المساحة لعروس تحبّيها.">Register in a minute, or message Nawal — she’ll confirm date, place, and the format that fits you. You can also gift this space to a bride you love.</p>
      <div class="br-closing__actions">
        <a href="/private-sessions?session=bride#ps-request" class="btn btn--primary" data-en="Start registration" data-ar="ابدئي التسجيل">Start registration</a>
        <a href="#" class="btn btn--ghost" data-br-wa data-track-cta="whatsapp" data-track-loc="closing" target="_blank" rel="noopener noreferrer" data-en="WhatsApp Nawal" data-ar="واتساب نوال">WhatsApp Nawal</a>
      </div>
    </div>
  </section>

  <section class="br-form-bridge container reveal" aria-labelledby="br-form-bridge-title">
    <p id="br-form-bridge-title" data-en="Already on the private sessions page?" data-ar="إنتِ أصلاً بصفحة الجلسات الخاصة؟">Already on the private sessions page?</p>
    <a href="/private-sessions?session=bride#ps-request" class="world-cta" data-track-cta="form_bridge" data-track-loc="footer"><span data-en="Jump to the registration form" data-ar="روحي مباشرة لنموذج التسجيل">Jump to the registration form</span> <span class="arrow" data-en="→" data-ar="←">→</span></a>
  </section>

  <div class="br-sticky" data-br-sticky hidden>
    <a href="/private-sessions?session=bride#ps-request" class="btn btn--primary br-sticky__form" data-en="Register" data-ar="سجّلي">Register</a>
    <a href="#" class="btn btn--ghost br-sticky__wa" data-br-wa data-track-cta="whatsapp" data-track-loc="sticky" target="_blank" rel="noopener noreferrer" data-en="WhatsApp" data-ar="واتساب">WhatsApp</a>
  </div>
</main>
`;

export default function BridalRitualPage() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={['/css/bridal-ritual.css']}
      scripts={[]}
      inlineScripts={[BR_INLINE_SCRIPT]}
      html={html}
      currentNav="private-sessions"
    />
  );
}
