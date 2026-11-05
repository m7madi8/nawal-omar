import { STR_DEPOSIT_ILS, STR_ROOM_IDS } from './spaceToReturnCommerce.js';
import {
  STR_EARLY_BIRD_DISCOUNT_SOLD_OUT,
  getStrOpenRoomIds,
  isStrRoomSoldOut,
} from './spaceToReturnAvailability.js';
import { STR_IMAGES, STR_TITLE } from './spaceToReturnImages.js';

const STR_COPY = {
  soldOut: { en: 'Sold out', ar: 'مكتمل' },
  onlyOption: { en: 'Only option available', ar: 'الخيار الوحيد المتاح' },
  discountSoldOut: {
    en: '10% off for the first 5 registrations — Sold out',
    ar: 'خصم 10% لأول 5 مشاركات — مكتمل',
  },
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bi(en, ar) {
  return ` data-en="${esc(en)}" data-ar="${esc(ar)}"`;
}

function pBlock(en, ar) {
  return `<p${bi(en, ar)}>${esc(en)}</p>`;
}

function liBlock(en, ar) {
  return `<li${bi(en, ar)}>${esc(en)}</li>`;
}

function priceOfferLine(roomEn, roomAr) {
  if (STR_EARLY_BIRD_DISCOUNT_SOLD_OUT) {
    return STR_COPY.discountSoldOut;
  }
  const discEn = roomEn.discountedPrice || '';
  const discAr = roomAr.discountedPrice || discEn;
  return {
    en: `10% off for the first 5 registrations: ${discEn}`,
    ar: `خصم 10% لأول 5 مشاركات: ${discAr}`,
  };
}

function roomOptionsHtml(content) {
  const openIds = getStrOpenRoomIds();
  const soleOpen = openIds.length === 1 ? openIds[0] : null;

  return STR_ROOM_IDS.map((roomId, i) => {
    const roomEn = content.en.pricing.rooms[i] || {};
    const roomAr = content.ar.pricing.rooms[i] || {};
    const soldOut = isStrRoomSoldOut(roomId);
    const labelEn = `${roomEn.name || roomId} — ${roomEn.originalPrice || ''}`;
    const labelAr = `${roomAr.name || roomId} — ${roomAr.originalPrice || ''}`;
    const inputId = `str-room-${roomId}`;
    const checked = soleOpen === roomId ? ' checked' : '';
    const disabled = soldOut ? ' disabled' : '';
    const noteHtml = soldOut
      ? `<span class="str-room-option__note str-room-option__note--sold"${bi(STR_COPY.soldOut.en, STR_COPY.soldOut.ar)}>${esc(STR_COPY.soldOut.en)}</span>`
      : soleOpen === roomId
        ? `<span class="str-room-option__note str-room-option__note--only"${bi(STR_COPY.onlyOption.en, STR_COPY.onlyOption.ar)}>${esc(STR_COPY.onlyOption.en)}</span>`
        : '';
    return `<label class="str-room-option${soldOut ? ' str-room-option--sold-out' : ''}" for="${inputId}">
      <input type="radio" id="${inputId}" name="roomId" value="${esc(roomId)}"${checked}${disabled}${soldOut ? '' : ' required'}>
      <span class="str-room-option__body">
        <span class="str-room-option__label" data-room-label data-en="${esc(labelEn)}" data-ar="${esc(labelAr)}">${esc(labelEn)}</span>
        ${noteHtml}
      </span>
    </label>`;
  }).join('\n');
}

function imgFigure(src, className, attrs = '', imgClass = '') {
  if (!src) return '';
  const ic = imgClass ? ` class="${imgClass}"` : '';
  return `<figure class="${className}"><img src="${src}" alt=""${ic} ${attrs}></figure>`;
}

export function renderSpaceToReturnHtml(content) {
  const { ar, en } = content;

  const introPs = en.intro.paragraphs
    .map((p, i) => pBlock(p, ar.intro.paragraphs[i] || ''))
    .join('\n');

  const destPs = en.destination.paragraphs
    .map((p, i) => pBlock(p, ar.destination.paragraphs[i] || ''))
    .join('\n');

  const galleryPos = [
    'str-img--pool',
    'str-img--sauna',
    'str-img--dining',
    'str-img--deck',
    'str-img--garden',
    'str-img--lounge',
  ];
  const destGallery = (STR_IMAGES.destinationGallery || [])
    .filter(Boolean)
    .map(
      (src, i) =>
        `<figure class="str-gallery__item str-gallery__item--${i + 1}"><img class="${galleryPos[i] || ''}" src="${src}" alt="" width="1200" height="800" loading="lazy" decoding="async" data-en-alt="Slowness — gallery ${i + 1}" data-ar-alt="Slowness — معرض ${i + 1}"></figure>`,
    )
    .join('\n');

  const journeyDays = en.journey.days
    .map((dayEn, di) => {
      const dayAr = ar.journey.days[di] || { dayLabel: '', dateLabel: '', items: [] };
      const items = dayEn.items
        .map((itemEn, ii) => {
          const itemAr = dayAr.items[ii] || { time: '', title: '', description: '' };
          return `<li class="str-schedule__item">
            <time class="str-schedule__time"${bi(itemEn.time, itemAr.time)}>${esc(itemEn.time)}</time>
            <div class="str-schedule__body">
              <h4 class="str-schedule__title"${bi(itemEn.title, itemAr.title)}>${esc(itemEn.title)}</h4>
              <p class="str-schedule__desc"${bi(itemEn.description, itemAr.description)}>${esc(itemEn.description)}</p>
            </div>
          </li>`;
        })
        .join('');
      return `<article class="str-day reveal">
        <header class="str-day__head">
          <h3 class="str-day__label"${bi(dayEn.dayLabel, dayAr.dayLabel)}>${esc(dayEn.dayLabel)}</h3>
          <p class="str-day__date"${bi(dayEn.dateLabel, dayAr.dateLabel)}>${esc(dayEn.dateLabel)}</p>
        </header>
        <ol class="str-schedule">${items}</ol>
      </article>`;
    })
    .join('\n');

  const includedItems = en.included.items
    .map((item, i) => liBlock(item, ar.included.items[i] || ''))
    .join('\n');

  const openIds = getStrOpenRoomIds();
  const soleOpen = openIds.length === 1 ? openIds[0] : null;

  const pricingRooms = STR_ROOM_IDS.map((roomId, i) => {
      const roomEn = en.pricing.rooms[i] || { name: '', originalPrice: '', discountedPrice: '' };
      const roomAr = ar.pricing.rooms[i] || { name: '', originalPrice: '', discountedPrice: '' };
      const soldOut = isStrRoomSoldOut(roomId);
      const badge =
        soldOut
          ? `<span class="str-sold-badge"${bi(STR_COPY.soldOut.en, STR_COPY.soldOut.ar)}>${esc(STR_COPY.soldOut.en)}</span>`
          : soleOpen === roomId
            ? `<span class="str-sold-badge str-sold-badge--open"${bi(STR_COPY.onlyOption.en, STR_COPY.onlyOption.ar)}>${esc(STR_COPY.onlyOption.en)}</span>`
            : '';
      let offerHtml = '';
      if (!soldOut && !STR_EARLY_BIRD_DISCOUNT_SOLD_OUT) {
        const offer = priceOfferLine(roomEn, roomAr);
        offerHtml = `<p class="str-price-card__offer"${bi(offer.en, offer.ar)}>${esc(offer.en)}</p>`;
      }
      return `<article class="str-price-card${soldOut ? ' str-price-card--sold-out' : ''}">
        ${badge}
        <h3 class="str-price-card__name"${bi(roomEn.name, roomAr.name)}>${esc(roomEn.name)}</h3>
        <p class="str-price-card__now"><span class="str-price-card__amount"${bi(roomEn.originalPrice, roomAr.originalPrice)}>${esc(roomEn.originalPrice)}</span></p>
        ${offerHtml}
      </article>`;
    })
    .join('\n');

  const discountBanner = STR_EARLY_BIRD_DISCOUNT_SOLD_OUT
    ? `<p class="str-pricing__early-bird str-pricing__early-bird--sold-out"${bi(STR_COPY.discountSoldOut.en, STR_COPY.discountSoldOut.ar)}>${esc(STR_COPY.discountSoldOut.en)}</p>`
    : '';

  const regPs = en.registration.paragraphs
    .map((p, i) => pBlock(p, ar.registration.paragraphs[i] || ''))
    .join('\n');

  const heroHasMedia = Boolean(STR_IMAGES.hero);
  const introVisual = imgFigure(
    STR_IMAGES.story,
    'str-intro__visual editorial-image reveal reveal-delay-1',
    'width="1200" height="1500" loading="lazy" decoding="async" data-en-alt="Retreat story" data-ar-alt="قصة الخلوة"',
    'str-img--story',
  );
  const destHeroFig = imgFigure(
    STR_IMAGES.destinationHero,
    'str-destination__hero editorial-image',
    'width="1400" height="900" loading="lazy" decoding="async"',
    'str-img--suite',
  );
  const natureFig = imgFigure(
    STR_IMAGES.nature,
    'editorial-image str-destination__duo-item',
    'width="800" height="1000" loading="lazy" decoding="async" data-en-alt="Nature" data-ar-alt="الطبيعة"',
    'str-img--swing',
  );
  const hotelFig = imgFigure(
    STR_IMAGES.hotel,
    'editorial-image str-destination__duo-item',
    'width="800" height="1000" loading="lazy" decoding="async" data-en-alt="Hotel" data-ar-alt="الفندق"',
    'str-img--garden',
  );
  const journeyImgClasses = ['str-img--yoga-hall', 'str-img--water', 'str-img--ice'];
  const journeyMedia = [STR_IMAGES.yoga, STR_IMAGES.soundHealing, STR_IMAGES.iceFire]
    .filter(Boolean)
    .map((src, i) => {
      const alts = [
        ['Yoga', 'يوغا'],
        ['Sound Healing', 'ساوند هيلينغ'],
        ['Ice and fire', 'الثلج والنار'],
      ][i] || ['', ''];
      return imgFigure(
        src,
        'editorial-image str-journey__figure',
        `width="900" height="1100" loading="lazy" decoding="async" data-en-alt="${alts[0]}" data-ar-alt="${alts[1]}"`,
        journeyImgClasses[i] || '',
      );
    })
    .join('\n');
  const closingFig = imgFigure(
    STR_IMAGES.closing,
    'str-register__visual editorial-image',
    'width="1200" height="900" loading="lazy" decoding="async"',
    'str-img--yoga-studio',
  );
  const interludeHtml = STR_IMAGES.interlude
    ? `<section class="str-interlude reveal" aria-hidden="true">
    <figure class="str-interlude__frame editorial-image">
      <img class="str-img--water-wide" src="${STR_IMAGES.interlude}" alt="" width="1600" height="900" loading="lazy" decoding="async">
    </figure>
  </section>`
    : '';

  return `
<main id="top" class="str-page ny-inner">
  <section class="str-hero${heroHasMedia ? '' : ' str-hero--tone'}" aria-labelledby="str-hero-title">
    ${
      heroHasMedia
        ? `<div class="str-hero__media" aria-hidden="true">
      <img class="str-img--hero" src="${STR_IMAGES.hero}" alt="" width="1600" height="1200" decoding="async" fetchpriority="high"${bi(`${STR_TITLE.en} retreat`, `${STR_TITLE.ar} — خلوة`)}>
    </div>
    <div class="str-hero__scrim" aria-hidden="true"></div>`
        : ''
    }
    <div class="container str-hero__inner">
      <a href="/local-retreats" class="str-back" data-en="Local Retreats" data-ar="خلوات محلية">Local Retreats</a>
      <p class="str-hero__meta"${bi(en.hero.dateDuration, ar.hero.dateDuration)}>${esc(en.hero.dateDuration)}</p>
      <h1 id="str-hero-title" class="display-xl str-hero__title"${bi(STR_TITLE.en, STR_TITLE.ar)}>${STR_TITLE.en}</h1>
      <div class="str-hero__actions">
        <a href="#str-register" class="btn btn--primary" data-en="Register" data-ar="التسجيل">Register</a>
        <a href="#str-journey" class="btn btn--ghost" data-en="View program" data-ar="البرنامج">View program</a>
      </div>
    </div>
  </section>

  <section class="str-intro ny-section${introVisual ? '' : ' str-intro--copy-only'}" aria-labelledby="str-intro-heading">
    <div class="container str-intro__grid">
      <div class="str-intro__copy reveal">
        <span class="eyebrow" data-en="Introduction" data-ar="مقدمة">Introduction</span>
        <h2 id="str-intro-heading" class="display-l str-intro__title"${bi(STR_TITLE.en, STR_TITLE.ar)}>${STR_TITLE.en}</h2>
        <div class="str-prose">${introPs}</div>
      </div>
      ${introVisual}
    </div>
  </section>

  ${interludeHtml}

  <section class="str-destination ny-section" aria-labelledby="str-destination-heading">
    <div class="container">
      <div class="str-destination__head reveal">
        <span class="eyebrow" data-en="Destination" data-ar="المكان">Destination</span>
        <h2 id="str-destination-heading" class="display-l"${bi(en.destination.heading, ar.destination.heading)}>${esc(en.destination.heading)}</h2>
      </div>
      <div class="str-destination__grid reveal${destHeroFig ? '' : ' str-destination__grid--copy-only'}">
        ${destHeroFig}
        <div class="str-prose str-destination__copy">${destPs}</div>
      </div>
      ${destGallery ? `<div class="str-gallery str-gallery--rich str-gallery--scroll reveal" aria-label="Destination gallery">${destGallery}</div>` : ''}
      ${
        natureFig || hotelFig
          ? `<div class="str-destination__duo reveal">${natureFig}${hotelFig}</div>`
          : ''
      }
    </div>
  </section>

  <section class="str-journey ny-section" id="str-journey" aria-labelledby="str-journey-heading">
    <div class="container">
      <header class="reveal">
        <span class="eyebrow" data-en="The retreat journey" data-ar="رحلة الخلوة">The retreat journey</span>
        <h2 id="str-journey-heading" class="display-l" data-en="Retreat program" data-ar="برنامج الخلوة">Retreat program</h2>
      </header>
      <div class="str-days">${journeyDays}</div>
      ${journeyMedia ? `<div class="str-journey__media reveal">${journeyMedia}</div>` : ''}
    </div>
  </section>

  <section class="str-included ny-section" aria-labelledby="str-included-heading">
    <div class="container reveal">
      <h2 id="str-included-heading" class="display-l"${bi(en.included.heading, ar.included.heading)}>${esc(en.included.heading)}</h2>
      <ul class="str-included__list">${includedItems}</ul>
    </div>
  </section>

  <section class="str-pricing ny-section" aria-labelledby="str-pricing-heading">
    <div class="container">
      <header class="reveal">
        <h2 id="str-pricing-heading" class="display-l"${bi(en.pricing.heading, ar.pricing.heading)}>${esc(en.pricing.heading)}</h2>
        <p class="str-pricing__discount body-l"${bi(en.pricing.discountNote, ar.pricing.discountNote)}>${esc(en.pricing.discountNote)}</p>
        ${discountBanner}
      </header>
      <div class="str-pricing__grid reveal">${pricingRooms}</div>
    </div>
  </section>

  <section class="str-policies ny-section" aria-labelledby="str-registration-heading">
    <div class="container str-policies__grid">
      <div class="str-policy reveal">
        <h2 id="str-registration-heading" class="display-m"${bi(en.registration.heading, ar.registration.heading)}>${esc(en.registration.heading)}</h2>
        <div class="str-prose">${regPs}</div>
      </div>
      <div class="str-policy reveal reveal-delay-1">
        <h2 id="str-cancellation-heading" class="display-m"${bi(en.cancellation.heading, ar.cancellation.heading)}>${esc(en.cancellation.heading)}</h2>
        <ul class="str-included__list str-policy__list">${en.cancellation.paragraphs
          .map((p, i) => liBlock(p, ar.cancellation.paragraphs[i] || ''))
          .join('\n')}</ul>
      </div>
    </div>
  </section>

  <section class="str-register ny-section" id="str-register" aria-labelledby="str-register-heading">
    <div class="container">
      <div class="str-register__panel reveal${closingFig ? '' : ' str-register__panel--copy-only'}">
        ${closingFig ? closingFig.replace('<figure', '<figure aria-hidden="true"') : ''}
        <div class="str-register__copy">
          <h2 id="str-register-heading" class="display-l" data-en="Register for the retreat" data-ar="التسجيل للخلوة">Register for the retreat</h2>
          <p class="body-l text-muted" data-en="Choose your room, enter your details, and pay the ${STR_DEPOSIT_ILS} ₪ deposit securely (Hyp — card, Apple Pay, Google Pay, bit). The balance is due by 18 November 2026." data-ar="اختاري نوع الغرفة، عبّي بياناتك، وادفعي عربون ${STR_DEPOSIT_ILS} ₪ بأمان (Hyp — بطاقة، Apple Pay، Google Pay، bit). المبلغ المتبقي حتى 18.11.2026.">Choose your room, enter your details, and pay the ${STR_DEPOSIT_ILS} ₪ deposit securely (Hyp — card, Apple Pay, Google Pay, bit). The balance is due by 18 November 2026.</p>
          <form id="strRegisterForm" class="str-form" novalidate data-str-open-rooms="${esc(openIds.join(','))}">
            <fieldset class="str-form__field str-form__rooms" id="grp-str-room">
              <legend data-en="Room option (required)" data-ar="نوع الغرفة (إلزامي)">Room option (required)</legend>
              <p class="str-form__hint" data-en="Listed price per person for the double room — the only option still available. The 10% early-bird discount for the first five registrations is sold out. Deposit today: ${STR_DEPOSIT_ILS} ₪ (non-refundable)." data-ar="السعر المعروض للشخص في الغرفة الزوجية — الخيار الوحيد المتبقي. خصم 10% لأول 5 مشاركات مكتمل. العربون اليوم: ${STR_DEPOSIT_ILS} ₪ (غير مسترد).">Listed price per person for the double room — the only option still available. The 10% early-bird discount for the first five registrations is sold out. Deposit today: ${STR_DEPOSIT_ILS} ₪ (non-refundable).</p>
              <div class="str-room-options">${roomOptionsHtml(content)}</div>
              <p class="str-form__error" data-field="roomId" role="alert" hidden></p>
            </fieldset>
            <div class="str-form__field">
              <label for="strName" data-en="Full name" data-ar="الاسم الكامل">Full name</label>
              <input type="text" id="strName" name="fullName" required autocomplete="name">
              <p class="str-form__error" data-field="fullName" role="alert" hidden></p>
            </div>
            <div class="str-form__field">
              <label for="strPhone" data-en="Phone (WhatsApp)" data-ar="الهاتف (واتساب)">Phone (WhatsApp)</label>
              <input type="tel" id="strPhone" name="phone" required autocomplete="tel" inputmode="tel" dir="ltr">
              <p class="str-form__error" data-field="phone" role="alert" hidden></p>
            </div>
            <div class="str-form__field">
              <label for="strNote" data-en="Note (optional)" data-ar="ملاحظة (اختياري)">Note (optional)</label>
              <textarea id="strNote" name="message" rows="3"></textarea>
            </div>
            <div id="hypPayMethodsMount" class="hyp-pay-methods-mount str-form__hyp"></div>
            <button type="submit" class="btn btn--primary str-form__submit" data-en="Register &amp; pay ${STR_DEPOSIT_ILS} ₪ deposit securely" data-ar="سجّلي وادفعي عربون ${STR_DEPOSIT_ILS} ₪ بأمان">Register &amp; pay ${STR_DEPOSIT_ILS} ₪ deposit securely</button>
            <p class="str-form__trust body-l text-muted" data-en="Encrypted checkout · single payment for the deposit only" data-ar="دفع مشفّر · دفعة واحدة للعربون فقط">Encrypted checkout · single payment for the deposit only</p>
            <p class="str-form__status" data-form-status hidden role="status"></p>
          </form>
          <p class="str-form__success" data-form-success hidden role="status">
            <span data-en="Thank you — Nawal will be in touch soon." data-ar="شكراً — نوال رح تتواصل معك قريباً.">Thank you — Nawal will be in touch soon.</span>
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="str-final-cta ny-section">
    <div class="container reveal str-final-cta__inner">
      <h2 class="display-l"${bi(STR_TITLE.en, STR_TITLE.ar)}>${STR_TITLE.en}</h2>
      <a href="#str-register" class="btn btn--primary" data-en="Register now" data-ar="سجّلي الآن">Register now</a>
    </div>
  </section>
</main>`;
}
