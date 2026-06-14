/**
 * i18n: English & Arabic for Nawal Yoga site
 * Usage: data-i18n="key" for text, data-i18n-attr="title:key" for attributes
 */
(function () {
  var STORAGE_KEY = 'nawal-lang';

  var translations = {
    en: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_video: 'Video',
      nav_workshops: 'Workshops',
      nav_al_tira: 'Al-Tira Yoga',
      nav_jiva: 'Haifa Yoga',
      nav_retreat: 'Retreat',
      seo_title: 'Nawal Omar',
      seo_description:
        'Certified yoga instructor Nawal Omar in Haifa, Israel: Vinyasa, Yin, Hatha & meditation. Private and group classes, Al-Tira & Haifa workshops, and international retreats. Book yoga in Israel.',
      menu_label: 'Menu',
      menu_close: 'Close menu',
      lang_toggle: 'Change language',
      menu_social_title: 'Connect',
      social_whatsapp_label: 'WhatsApp',
      social_instagram_label: 'Instagram',
      social_whatsapp_aria: 'WhatsApp',
      social_instagram_aria: 'Instagram',
      footer_tagline: 'Where yoga meets calm and quality',
      copyright: 'All rights reserved.',
      back: 'Back',
      lang_ar: 'العربية',
      lang_en: 'English',
      lang_btn_ar: 'العربية',
      lang_btn_en: 'الانجليزية',

      hero_tagline: 'Yoga · Mindfulness · Retreat',
      hero_title1: 'Change begins',
      hero_title2: 'here',
      hero_cta_book: 'Explore workshops',
      hero_cta_discover: 'Discover more',
      hero_bottom: 'Private · group · retreats',
      page_loader_aria: 'Loading page',
      dashboard_label: 'Practice dashboard',
      dashboard_title: 'Everything you need in one clear view',
      dashboard_intro: 'A focused overview of programs, intensity levels, and easiest ways to book. Built for mobile first so every detail stays clear and easy to act on.',
      dashboard_card1_title: 'Quick practice stats',
      dashboard_metric_1_value: '500+',
      dashboard_metric_1_label: 'Students',
      dashboard_metric_2_value: '5+ years',
      dashboard_metric_2_label: 'Teaching',
      dashboard_metric_3_value: '4 styles',
      dashboard_metric_3_label: 'Yoga methods',
      dashboard_metric_4_value: '2 cities',
      dashboard_metric_4_label: 'Weekly presence',
      dashboard_card2_title: 'What fits you best',
      dashboard_card2_item1: 'Private sessions: 1:1 care for flexibility, posture, and confidence.',
      dashboard_card2_item2: 'Group classes: balanced flow with mindful community energy.',
      dashboard_card2_item3: 'Workshops: focused themes for faster progress and deeper technique.',
      dashboard_card2_item4: 'Retreats: full reset with movement, breathwork, and nature.',
      dashboard_card3_title: 'Book in 3 easy steps',
      dashboard_card3_item1: '1) Choose your preferred format: class, workshop, or retreat.',
      dashboard_card3_item2: '2) Message on WhatsApp with your name, level, and preferred day.',
      dashboard_card3_item3: '3) Receive confirmation and your session details quickly.',
      dashboard_action_1: 'View workshops',
      dashboard_action_2: 'Book on WhatsApp',

      about_label: 'About Nawal',
      about_title: 'Yoga Instructor',
      about_subtitle: 'A journey of awareness, breath and movement',
      about_name: 'Nawal Omar',
      about_cert: 'Certified yoga instructor • Vinyasa, Yin, Hatha, meditation',
      about_bio: 'Certified yoga instructor with over five years of practice. Vinyasa, Yin, Hatha & meditation—for beginners and advanced. Reconnect with your body, breath, and inner calm in the studio or in nature.',
      about_point1: 'Certified (RYT 200+) — private & group sessions',
      about_point2: 'Workshops and retreats in nature',
      stat_trainees: 'Trainees',
      stat_years: 'Years',
      stat_styles: 'Yoga styles',

      video_label: 'Practice & presence',
      video_title: 'A moment of calm',
      video_muted: 'Muted',
      video_unmute: 'Unmute video',
      video_live: 'Live audio',
      video_caption: 'Nawal Omar · Yoga & mindfulness',
      story_label: 'My story',
      story_text1: "I'm a certified yoga instructor with over five years of practice and teaching. What started as my personal search for calm and flexibility became a path to share yoga with others—Vinyasa, Yin, Hatha, and guided meditation.",
      story_text2: 'Whether in the studio or in nature, I design every session to help you reconnect with your body, breath, and inner stillness. I believe yoga is for everyone: gentle movement, mindful breath, and moments of silence that bring you back to yourself.',

      moments_label: 'Images & moments',
      moments_title: 'Glimpses of practice & calm',
      gallery_prev: 'Previous image',
      gallery_next: 'Next image',
      gallery_swipe: 'Swipe or drag to browse',

      workshops_label: 'Workshops',
      workshops_heading: 'Haifa · Retreat',
      al_tira_title: 'Al-Tira Yoga',
      al_tira_desc: 'Experience freedom in the air. Suspension-based practice for strength, flexibility and playfulness—suitable for all levels.',
      al_tira_cta: 'Discover more',
      jiva_title: 'Haifa Yoga',
      jiva_desc: 'Connect body, breath and mind. A holistic approach blending movement, meditation and mindfulness in a supportive space.',
      jiva_cta: 'Learn more',
      retreat_title: 'Retreat',
      retreat_desc: 'Step away from the everyday. Multi-day yoga retreats in nature—deep practice, rest and connection with like-minded souls.',
      retreat_cta: 'Explore retreats',
      retreats_page_label: 'Retreat Collection',
      retreats_page_title: 'Retreats',
      retreats_page_intro: 'Choose your next wellness journey.',
      retreats_upcoming_title: 'Upcoming retreats',
      retreats_past_title: 'Past Retreats',
      retreat_status_badge: 'Completed',
      retreat_registration_closed_note: 'Registration is currently closed.',
      retreat_cta_completed: 'Retreat Completed',
      retreat_dahab_booking_unavailable: 'Booking closed',
      retreats_zanzibar_title: 'Zanzibar Retreat',
      retreats_zanzibar_desc: '8 days | 7 nights of yoga, sound healing, nature, and deep restoration.',
      retreats_dahab_title: 'Dahab Retreat',
      retreats_dahab_desc: 'Women\'s Dahab retreat 19–23 Aug 2026 — yoga, sound healing, nature, and deep restoration by the Red Sea.',
      retreats_wadi_title: 'Wadi Rum Retreat',
      retreats_wadi_desc: 'A moonlit women retreat in Wadi Rum with yoga, breathwork, healing circles, and desert rituals.',
      retreats_view_details: 'View retreat details',
      retreats_form_tag: 'Registration',
      retreats_form_title: 'Health Declaration Form',
      retreats_form_desc: 'A calm multi-step registration form to complete your retreat booking details.',
      retreats_form_cta: 'Open registration form',
      retreat_wadi_meta_desc: 'Wadi Rum women retreat with Nawal Omar. Desert yoga, sound healing, breathwork, and inner reset under the stars.',
      retreat_wadi_page_label: 'Wadi Rum Women Retreat',
      retreat_wadi_page_title: 'Moonlit Wadi Rum Retreat',
      retreat_wadi_page_intro: 'A journey into the depth of the soul, where the desert meets the sky. 17.6 - 21.6',
      retreat_wadi_page_intro2: '5 days | 4 nights. This is not just travel, this is an inner transition in a safe feminine space.',
      retreat_wadi_about_title: 'Who am I?',
      retreat_wadi_about_nawal_name: 'Nawal Omar',
      retreat_wadi_about_nawal_role: 'Nurse and Vinyasa Yoga Teacher',
      retreat_wadi_about_nawal_text: 'I blend science with body awareness and spiritual practice, creating safe spaces for women to return to their bodies, heal the pelvis, calm the nervous system, and release old patterns that no longer serve them. This retreat is a natural extension of my message.',
      retreat_wadi_about_isra_name: 'Isra Tayeh',
      retreat_wadi_about_isra_role: 'Psychotherapist and content creator specializing in nervous system awareness, relational dynamics, and emotional wound healing.',
      retreat_wadi_about_isra_text: 'I walk alongside individuals, couples, and mothers on their path toward psychological balance, emotional regulation, and a safer relationship with self and others.',
      retreat_wadi_gallery_title: 'Moments from Wadi Rum',
      retreat_wadi_gallery_alt1: 'Wadi Rum moment',
      retreat_wadi_gallery_alt2: 'Wadi Rum dunes',
      retreat_wadi_gallery_alt3: 'Desert sunrise',
      retreat_wadi_gallery_alt4: 'Women circle in retreat',
      retreat_wadi_gallery_alt5: 'Night stars in desert',
      retreat_wadi_gallery_alt6: 'Wadi Rum panorama',
      retreat_wadi_gallery_alt7: 'Desert tent camp',
      retreat_wadi_gallery_alt8: 'Desert camp',
      retreat_wadi_gallery_alt9: 'Wadi Rum portrait moment',
      retreat_wadi_gallery_alt10: 'Night bivouac in Wadi Rum',
      retreat_wadi_reels_title: 'Reels from the retreat',
      retreat_wadi_reels_hint: 'Swipe sideways and tap play.',
      retreat_wadi_reels_label: 'Wadi Rum retreat reels',
      retreat_wadi_reel_play: 'Play reel',
      retreat_wadi_reel_aria_1: 'Wadi Rum retreat reel 1',
      retreat_wadi_reel_aria_2: 'Wadi Rum retreat reel 2',
      retreat_wadi_reel_aria_3: 'Wadi Rum retreat reel 3',
      retreat_wadi_reel_aria_4: 'Wadi Rum retreat reel 4',
      zanzibar_reels_kicker: 'Reels',
      zanzibar_reels_title: 'Videos (reels) from Zanzibar',
      zanzibar_reels_hint: 'Swipe sideways and tap play.',
      zanzibar_reels_label: 'Zanzibar retreat reels',
      zanzibar_reel_play: 'Play reel',
      zanzibar_reel_aria_1: 'Zanzibar reel 1',
      zanzibar_reel_aria_2: 'Zanzibar reel 2',
      zanzibar_reel_aria_3: 'Zanzibar reel 3',
      zanzibar_reel_aria_4: 'Zanzibar reel 4',
      zanzibar_sold_out: 'Sold out',
      zanzibar_dates_soon: 'New dates coming soon',
      zanzibar_form_closed: 'Registration is closed — new dates coming soon',
      retreat_wadi_why_title: 'Why this retreat is different?',
      retreat_wadi_why_1_title: '1) The desert returns you to yourself',
      retreat_wadi_why_1_text: 'Desert silence calms overthinking and brings you back to your roots and grounding.',
      retreat_wadi_why_2_title: '2) The women circle heals',
      retreat_wadi_why_2_text: 'A space without judgment or comparison. Women supporting women with awareness and love.',
      retreat_wadi_why_3_title: '3) The body is released',
      retreat_wadi_why_3_text: 'Daily yoga, deep breathwork, and sound healing to restore inner balance.',
      retreat_wadi_why_4_title: '4) A true release ritual',
      retreat_wadi_why_4_text: 'Under Wadi Rum stars, we release old patterns and return lighter, clearer, and more aligned.',
      retreat_wadi_program_title: 'Full program',
      retreat_wadi_day1_chip: 'Day 01',
      retreat_wadi_day1_title: 'Arrival & intention setting',
      retreat_wadi_day1_b1: 'Meet at Beit Shean crossing and transfer to Wadi Rum.',
      retreat_wadi_day1_b2: 'Warm Bedouin welcome and traditional dinner.',
      retreat_wadi_day1_b3: 'Deep introductions and intention workshop.',
      retreat_wadi_day1_b4: 'Light breath session and calm night under stars.',
      retreat_wadi_day2_chip: 'Day 02',
      retreat_wadi_day2_title: 'Desert power day',
      retreat_wadi_day2_b1: 'Sunrise yoga focused on root and pelvis.',
      retreat_wadi_day2_b2: 'Breathwork, healthy breakfast, and a deep workshop session.',
      retreat_wadi_day2_b3: 'Silent reflection + journaling and sound healing session.',
      retreat_wadi_day2_b4: 'Star meditation and telescope workshop.',
      retreat_wadi_day3_chip: 'Day 03',
      retreat_wadi_day3_title: 'Inner and outer journey',
      retreat_wadi_day3_b1: 'Heart-opening yoga + guided meditation.',
      retreat_wadi_day3_b2: 'Power cards and emotional writing.',
      retreat_wadi_day3_b3: 'Jeep desert tour in Wadi Rum.',
      retreat_wadi_day3_b4: 'Sunset yoga with light acro for trust and balance.',
      retreat_wadi_day4_chip: 'Day 04',
      retreat_wadi_day4_title: 'Integration and transformation',
      retreat_wadi_day4_b1: 'Deep morning yoga to integrate feminine energy.',
      retreat_wadi_day4_b2: 'Second workshop session and personal rest time.',
      retreat_wadi_day4_b3: 'Camel ride and deep closing sound healing.',
      retreat_wadi_day4_b4: 'Light celebration and retreat closing circle.',
      retreat_wadi_day5_chip: 'Day 05',
      retreat_wadi_day5_title: 'Farewell and anchoring',
      retreat_wadi_day5_b1: 'Closing breakfast and intention anchoring circle.',
      retreat_wadi_day5_b2: 'Desert farewell and return with renewed energy.',
      retreat_wadi_accommodation_kicker: 'Wadi Rum Retreat',
      retreat_wadi_accommodation_title: 'Accommodation options',
      retreat_wadi_stay1_title: 'Bubbles room',
      retreat_wadi_stay1_b1: 'Luxury under-the-stars circular room.',
      retreat_wadi_stay1_b2: 'AC + private bathroom + full privacy.',
      retreat_wadi_stay1_b3: 'Very comfortable beds + private outdoor sitting area.',
      retreat_wadi_stay1_price: 'Price: 3600 ILS per person (double room)',
      retreat_wadi_stay2_title: 'Panorama room',
      retreat_wadi_stay2_b1: 'Spacious room with open desert view.',
      retreat_wadi_stay2_b2: 'AC + private bathroom + very comfortable beds.',
      retreat_wadi_stay2_b3: 'Premium comfort with panoramic atmosphere.',
      retreat_wadi_stay2_price: 'Price: 3200 ILS per person (double room)',
      retreat_wadi_includes_title: 'Price includes',
      retreat_wadi_inc1: '5 days and 4 nights accommodation.',
      retreat_wadi_inc2: 'Daily breakfast + dinner and 3 lunches.',
      retreat_wadi_inc3: 'Transfers to/from the border crossing.',
      retreat_wadi_inc4: 'Jeep tour + camel ride + telescope workshop.',
      retreat_wadi_inc5: 'Daily yoga + breathwork + meditation.',
      retreat_wadi_inc6: '2 deep workshops + sound healing + emotional support + professional photography.',
      retreat_wadi_payment_title: 'Payment and cancellation policy',
      retreat_wadi_policy_1: 'A non-refundable first deposit of 400 ILS confirms booking.',
      retreat_wadi_policy_2: 'Remaining amount is due by 10.6.',
      retreat_wadi_policy_3: 'Available methods: bank transfer or Bit.',
      retreat_wadi_policy_4: 'Please send transfer proof image to confirm your booking.',
      retreat_wadi_policy_5: 'Seats are limited and priority is for first confirmed bookings.',
      retreat_wadi_policy_6: 'Cancellation within 14 days of retreat date is non-refundable.',
      retreat_wadi_policy_7: 'No-show is non-refundable. Booking transfer is allowed if you find a replacement.',
      retreat_wadi_price_label: 'Start from',
      retreat_wadi_price_value: '3600 ILS',
      retreat_wadi_price_note: 'Desert retreat, women circle, and deep reset.',
      retreat_wadi_book_now: 'Book Wadi Rum retreat',
      retreat_dahab_page_label: 'Dahab Women\'s Retreat 2026',
      retreat_dahab_meta_title: 'Dahab Women\'s Retreat 2026 | Nawal Omar',
      retreat_dahab_meta_desc:
        'Women\'s Dahab retreat 19–23 Aug 2026 with Nawal Omar. Yoga, sound healing, ice bath, Blue Hole journey, and renewal at Nour Boutique Hotel.',
      retreat_dahab_page_title: 'Dahab Women\'s Retreat 2026',
      retreat_dahab_page_intro: '19.8 – 23.8 · A journey back to the body, the sea, and the strength within.',
      retreat_dahab_hero_identity: 'Nurse · Yoga teacher · Women\'s health advocate',
      retreat_dahab_hero_badge: 'Women only · 20 places',
      retreat_dahab_hero_stat1: '7 international retreats led',
      retreat_dahab_hero_stat2: '2000+ women on this path',
      retreat_dahab_hero_stat3: '5 days · Dahab · Sinai',
      retreat_dahab_hero_host: 'Your host',
      retreat_dahab_hero_dates_aria: 'Retreat dates: 19 to 23 August 2026, Dahab Sinai',
      retreat_dahab_hero_dates_range: '19 – 23',
      retreat_dahab_hero_dates_month: 'August 2026',
      retreat_dahab_hero_dates_place: 'Dahab, Sinai',
      retreat_dahab26_story_kicker: 'In Nawal\'s words',
      retreat_dahab_cv_badge: 'Limited places',
      retreat_dahab_cv_subtitle: 'Five days of full disconnect — yoga, sea, and deep calm with Nawal Omar.',
      retreat_dahab_cv_price: '3500₪',
      retreat_dahab_cv_price_old: '3300₪',
      retreat_dahab_cv_price_unit: '/ per person',
      retreat_dahab_cv_btn_register: 'Register now',
      retreat_dahab_cv_btn_program: 'See the program',
      retreat_dahab_cv_trust: '7 international retreats · 2000+ women · secure booking',
      retreat_dahab_cv_proof_label: 'From our last retreat',
      retreat_dahab_cv_participant: '(Participant)',
      retreat_dahab_cv_t1_name: 'Samar Al-Rashed',
      retreat_dahab_cv_t1_country: 'Haifa',
      retreat_dahab_cv_t1_quote: 'The retreat is for anyone who wants to find themselves — not a picnic or an ordinary trip. Some think it is just a change of scenery, but it is completely different: stepping away from your phone, facing yourself and your fears calmly, and reaching inner peace. It is for people who truly need that. Personally, I went to a retreat and I would go back again — twice, ten times over.',
      retreat_dahab_cv_t2_name: 'Ronza Hayek',
      retreat_dahab_cv_t2_country: 'Nazareth',
      retreat_dahab_cv_t2_quote: 'My dears 🥰\nIt was a wonderful, deep experience. I met special people who touched each of us in their own way, and I learned things from you that I will carry with me for a long time.\nI am grateful for everything on this journey—the challenges, the depth, listening and acceptance from everyone, and of course all the laughter and joy that never stopped. Your energy is fire 😂\nHuge thanks to Nawal — more than wonderful 🥰\nI was so honoured to meet you all. Thank you for everything, and hopefully we will meet again 💖💖',
      retreat_dahab_cv_t3_name: 'Aola',
      retreat_dahab_cv_t3_country: 'Jaffa',
      retreat_dahab_cv_t3_quote: 'I want to say that I love you all so much 🫂🤍\nEach one of you sat and was planted in my heart.\nThank you for every light that came from you and everything I learned from you about myself and about life 🫂\nIt was a great honour to meet you and to have you become part of my life 🤍 and part of this beautiful life journey 🙏🏼\nThank you for your love for yourselves, for your sweet hearts, your embrace, your laughter, your wisdom 🥹🙏🏼🙏🏼\nNawal, I love you as big as the universe 🤍\nPraise God for the blessing of your presence in this life — wherever you go you leave a drop of love and light that keeps growing and expanding 🥹 May God protect you and light your path 🤍',
      retreat_dahab_cv_t4_name: 'Jehan Sawaed',
      retreat_dahab_cv_t4_quote: 'How are you, girls? ❤️\nI want to tell you that each one of you is special in her own way, and I am grateful from the bottom of my heart that I had the chance to know you and be with you in this experience ❤️\nI have been in several groups before and never once felt such harmony and positive feelings between the people in the group ❤️ The support between us, the sharing, encouragement and giving from the heart are not things I take for granted at all — honestly you surprised me and I did not expect it, especially in such a large group ❤️ Nawal — you gave from your heart and had a deep impact on me from within ❤️ Every experience with you makes me say to myself: I want another one ❤️ Girls, I hope we stay in touch and can meet again, because I want souls like yours in my life ❤️ You are beautiful 🥰',
      retreat_dahab_cv_t5_name: 'Abeer Helhel',
      retreat_dahab_cv_t5_quote: 'My dears ❤️🦋🤍\nThere are places we only reach when we are ready to break and rebuild ourselves anew...\nWadi Rum was one of those places.\nFive days away from everything we know... away from the noise of life, yet so close to the deepest thing within us.\nBetween silence, our breath, and the wide earth that held us...\nspaces opened inside us that we may be hearing honestly for the first time.\nEach of us arrived carrying a story... pain... longing... or even emptiness... and together we created a safe space, without judgment, without masks... just hearts drying each other.\nI came to this retreat not myself... carrying the loss of my sister, and a weight that had no words...\nI left stronger... calmer... and closer to myself. Not because the pain disappeared... but because I learned to carry it with love, not fear.\nAnd in the midst of it all...\nthere was an embrace that was especially warm...\nThank you, Nawal 🤍',
      retreat_dahab_cv_includes_title: 'Everything included',
      retreat_dahab_cv_includes_sub: 'From the moment you arrive to your last breath',
      retreat_dahab_cv_inc1_title: 'Full stay',
      retreat_dahab_cv_inc1_desc: '4 nights at Nour Boutique Hotel by the sea.',
      retreat_dahab_cv_inc2_title: 'Healthy meals',
      retreat_dahab_cv_inc2_desc: 'Daily breakfast and dinner at the hotel.',
      retreat_dahab_cv_inc3_title: 'Yoga sessions',
      retreat_dahab_cv_inc3_desc: 'Daily morning yoga with expert guide Nawal Omar.',
      retreat_dahab_cv_inc4_title: 'Sea journeys',
      retreat_dahab_cv_inc4_desc: 'Blue Hole, Abu Galum & Blue Lagoon trip.',
      retreat_dahab_cv_inc5_title: 'Breath workshops',
      retreat_dahab_cv_inc5_desc: 'Pranayama, meditation & sound healing.',
      retreat_dahab_cv_inc6_title: 'Private circle',
      retreat_dahab_cv_inc6_desc: 'Safe women\'s group & follow-up after the retreat.',
      retreat_dahab_cv_cd_days: 'Days',
      retreat_dahab_cv_cd_hours: 'Hours',
      retreat_dahab_cv_cd_minutes: 'Minutes',
      retreat_dahab_cv_cd_seconds: 'Seconds',
      retreat_dahab_cv_spots_label: 'Available spots',
      retreat_dahab_cv_spots_count: 'Limited places',
      retreat_dahab_cv_urgency_note: 'Our last retreat sold out one month before the date.',
      retreat_dahab_cv_final_h2: 'Ready to begin your journey?',
      retreat_dahab_cv_final_p: 'Five days away from noise, back to your body and the sea. A rare chance to slow down, breathe, and remember your strength — with women who understand you.',
      retreat_dahab_cv_final_price_label: 'Full price',
      retreat_dahab_cv_final_price: '3500₪',
      retreat_dahab_cv_final_price_note: 'Includes stay, meals & all activities',
      retreat_dahab_cv_final_b1: 'Deposit confirms your spot',
      retreat_dahab_cv_final_b2: 'Phone call before final confirmation',
      retreat_dahab_cv_final_b3: 'Direct contact with Nawal Omar',
      retreat_dahab_cv_final_btn: 'Reserve your spot now',
      retreat_dahab_cv_final_whatsapp: 'Or contact us on WhatsApp',
      retreat_dahab_book: 'Book',
      retreat_dahab_datetime_label: 'Place & Time',
      retreat_dahab_datetime_value: 'May 07, 2026, 10:00 AM – May 12, 2026, 8:00 PM',
      retreat_dahab_location_value: 'Sinai Peninsula, Sinai Peninsula, Taba, South Sinai Governorate 8781001, Egypt',
      retreat_dahab_goal_label: 'Goal',
      retreat_dahab_goal_headline: 'Retreat "Voice of the mountain"',
      retreat_dahab_goal_text: 'A mindful mountain and sea journey that combines challenge, grounding, and calm.',
      retreat_dahab_goal_image_alt: 'Saint Catherine mountains',
      retreat_dahab_goal_chip_date: '07.05.2026 - 12.05.2026',
      retreat_dahab_goal_chip_country: 'Egypt',
      retreat_dahab_stat_difficulty_value: 'Medium',
      retreat_dahab_stat_difficulty_label: 'Difficulty',
      retreat_dahab_stat_distance_value: '18 km',
      retreat_dahab_stat_distance_label: 'Distance',
      retreat_dahab_stat_days_value: '6 Days',
      retreat_dahab_stat_days_label: 'Trail duration',
      retreat_dahab_stat_peak_value: '2641 m',
      retreat_dahab_stat_peak_label: 'Highest point',
      retreat_dahab_share_label: 'Share Event',
      retreat_dahab_image_alt: 'Dahab Retreat',
      retreat_dahab_itinerary_title: 'Day-by-day itinerary',
      retreat_dahab_day1_chip: 'Day 01',
      retreat_dahab_day1_title: 'Transfer and arrival to Saint Catherine',
      retreat_dahab_day1_meta: 'Day 1 (07.05.2026) - Arrival and preparation for the trail',
      retreat_dahab_day1_p1: 'We begin our journey by departing at night on 06.05 around 00:00 by bus toward the Taba border crossing. After crossing the border, we continue toward Saint Catherine, where the ride takes around two and a half hours to reach the camp.',
      retreat_dahab_day1_p2: 'We are expected to arrive on the morning of 07.05 around 10:00, to begin our experience calmly among Sinai mountains, with time for rest, introductions, and preparation for the trail start.',
      retreat_dahab_day1_p3: 'Our Sinai journey starts with a calm arrival to Saint Catherine. This small desert town, surrounded by high granite peaks, is our gateway to the spiritual and natural wonders of Sinai mountains. We check in to a local Bedouin camp to rest after travel, enjoy mountain air and a warm meal. This day is for meeting guides and the group, preparing gear, and mental readiness for tomorrow\'s hike.',
      retreat_dahab_day2_chip: 'Day 02',
      retreat_dahab_day2_title: 'Wadi El-Arbaeen -> Mount Saint Catherine -> Dahab',
      retreat_dahab_day2_meta: 'Day 2 (08.05.2026) - Summit ascent and transfer to Dahab',
      retreat_dahab_day2_p1: 'We leave camp early and walk through Wadi El-Arbaeen toward Shaq Mousa. The route passes dramatic granite cliffs until we reach Um Sella, then continue ascending to Mount Saint Catherine summit, the highest mountain in Egypt. From the peak, we witness an endless panorama of mountains and silent valleys. We have lunch at the summit, descend, then continue about two hours to Dahab for overnight at the retreat accommodation.',
      retreat_dahab_day2_stat1: '18 km',
      retreat_dahab_day2_stat2: 'Ascent 1,048 m',
      retreat_dahab_day2_stat3: 'Descent 1,061 m',
      retreat_dahab_day2_stat4: 'Highest point 2,641 m',
      retreat_dahab_day3_chip: 'Day 03',
      retreat_dahab_day3_title: 'Retreat day in Dahab',
      retreat_dahab_day3_meta: 'Day 3 (09.05.2026) - Retreat begins in Dahab',
      retreat_dahab_day3_p1: 'We start the first retreat day in Dahab with an integrated session with Nawal including morning yoga, meditation, sound healing, and breathing techniques to calm the nervous system after the mountain experience, reconnect with the body, and open inner stillness. Later, Hanan leads a sharing circle. The program is guided until noon, then free time for swimming, walking, or rest, followed by an evening sound healing session focused on emotional release with guided visualization.',
      retreat_dahab_day4_chip: 'Day 04',
      retreat_dahab_day4_title: 'Retreat day in Dahab',
      retreat_dahab_day4_meta: 'Day 4 (10.05.2026) - Sea day and inner liberation',
      retreat_dahab_day4_p1: 'Morning starts with Mindfulness + Yoga, then after breakfast we head to Blue Hole from 10:00 to 17:00 for swimming, relaxing, and enjoying sea and nature. After returning, Nawal leads a deep group process titled "The game of power and the ghost of weakness" to extract each woman\'s personal strength, deepen freedom, prepare the "ghost of weakness" for the final fire ritual, and connect desert symbolism with inner freedom.',
      retreat_dahab_day5_chip: 'Day 05',
      retreat_dahab_day5_title: 'Integration and closing day',
      retreat_dahab_day5_meta: 'Day 5 (11.05.2026)',
      retreat_dahab_day5_morning: 'Morning',
      retreat_dahab_day5_morning_text: 'Session with Nawal includes:',
      retreat_dahab_day5_b1: 'Morning yoga',
      retreat_dahab_day5_b2: 'Guided visualization',
      retreat_dahab_day5_b3: 'Acro Yoga: an interactive joyful practice that supports:',
      retreat_dahab_day5_b4: 'Building trust between participants',
      retreat_dahab_day5_b5: 'Strengthening communication',
      retreat_dahab_day5_b6: 'Adding play and joy to the experience',
      retreat_dahab_day5_evening: 'Evening',
      retreat_dahab_day5_p1: 'A closing ceremony around fire in an open space.',
      retreat_dahab_day5_p2: 'Participants wear white as a symbol of a new beginning.',
      retreat_dahab_day5_p3: 'The ceremony includes:',
      retreat_dahab_day5_e1: 'Burning ritual of the "ghost of weakness"',
      retreat_dahab_day5_e2: 'Sharing each participant\'s personal journey',
      retreat_dahab_day5_e3: 'Anchoring new life intentions after the retreat',
      retreat_dahab_day5_p4: '(An additional special Dahab activity can be added later based on your final concept.)',
      retreat_dahab_day6_chip: 'Day 06',
      retreat_dahab_day6_title: 'Departure',
      retreat_dahab_day6_meta: 'Day 6 (12.05.2026)',
      retreat_dahab_day6_p1: 'In the morning: a calm breakfast with the group.',
      retreat_dahab_day6_p2: 'Then:',
      retreat_dahab_day6_b1: 'Pack belongings',
      retreat_dahab_day6_b2: 'Farewell moment',
      retreat_dahab_day6_b3: 'Return according to travel arrangements',
      retreat_dahab_day6_p3: 'We leave Dahab carrying mountain calm, desert strength, and sea lightness.',
      retreat_dahab_trainers_title: 'Your trainers',
      retreat_dahab_trainer1_name: 'Nawal Omar',
      retreat_dahab_trainer1_role: 'Yoga & mindfulness guide',
      retreat_dahab_trainer2_name: 'Hanan',
      retreat_dahab_trainer2_role: 'Mountain trail leader in the Dahab retreat.',
      retreat_dahab_gallery_title: 'Journey moments',
      retreat_dahab_gallery_alt1: 'Dahab sea',
      retreat_dahab_gallery_alt2: 'Retreat view',
      retreat_dahab_gallery_alt3: 'Nature moment',
      retreat_dahab_gallery_alt4: 'Group energy',
      retreat_dahab_gallery_alt5: 'Sea and cliffs',
      retreat_dahab_gallery_alt6: 'Calm sunset',
      retreat_dahab_gallery_alt7: 'Dahab journey',
      retreat_dahab_gallery_alt8: 'Dahab journey',
      retreat_dahab_gallery_alt9: 'Dahab journey',
      retreat_dahab_gallery_alt10: 'Dahab journey',
      retreat_dahab_gallery_alt11: 'Dahab journey',
      retreat_dahab_gallery_alt12: 'Dahab journey',
      retreat_dahab_gallery_more: 'Show more photos',
      retreat_dahab_gallery_less: 'Show fewer photos',
      retreat_dahab_soul_kicker: 'This is your place',
      retreat_dahab_expect_title: 'What can I expect from the Dahab retreat?',
      retreat_dahab_soul_not_tourism: 'This retreat is not an ordinary holiday.',
      retreat_dahab_soul_invite: 'It is a safe space for you to slow down, step away from daily pressure, and hear yourself again.',
      retreat_dahab_expect_lead: 'Over five days, we will work on:',
      retreat_dahab_expect_1: 'Calming the nervous system and easing stress and pressure.',
      retreat_dahab_expect_2: 'Returning to the body through yoga, breath, and conscious movement.',
      retreat_dahab_expect_3: 'Building genuine connections with women who share your values and awareness.',
      retreat_dahab_expect_4: 'Restoring energy and vitality away from the noise of everyday life.',
      retreat_dahab_expect_5: 'Discovering new spaces of inner strength and confidence.',
      retreat_dahab_expect_6: 'Creating memories and experiences that stay with you long after the retreat ends.',
      retreat_dahab_why_dahab_title: 'Why Dahab?',
      retreat_dahab_why_dahab_lead: 'Because Dahab is different.',
      retreat_dahab_why_dahab_p1: 'In it, there is something hard to put into words.',
      retreat_dahab_why_dahab_p2: 'The sea, the mountains, the simplicity, the people, and the calm energy there all create an ideal environment for healing, meditation, and renewal.',
      retreat_dahab_why_dahab_p3: 'It is no coincidence that thousands of people around the world choose Dahab every year as a place to return to themselves.',
      retreat_dahab_why_this_title: 'Why this retreat in particular?',
      retreat_dahab_why_this_lead: 'Because it is built with great care.',
      retreat_dahab_why_this_p1: 'It is not just yoga or separate activities.',
      retreat_dahab_journey_earth: 'Earth & grounding',
      retreat_dahab_journey_water: 'Water & flow',
      retreat_dahab_journey_presence: 'Full presence with yourself',
      retreat_dahab_why_this_p2: 'Each day connects to the one before — a complete journey. Every session, workshop, and sharing space is chosen to create a real, safe, and meaningful experience.',
      retreat_dahab_spots_title: 'Limited places',
      retreat_dahab_spots_count: '20 women only',
      retreat_dahab_spots_text: 'To protect privacy and the quality of the experience, participation is limited to 20 women.',
      retreat_dahab_spots_note: 'I believe small groups allow deeper connection, safer sharing spaces, and personal attention for every participant.',
      retreat_dahab_booking_title: 'How is booking confirmed?',
      retreat_dahab_booking_p1: 'After completing the registration form, each participant will be contacted by phone to get acquainted, answer all questions, and confirm that the retreat is right for her.',
      retreat_dahab_booking_p2: 'Booking is confirmed only after the phone call and transfer of the deposit.',
      retreat_dahab_for_title: 'Who is this retreat for?',
      retreat_dahab_for_1: 'For the woman who feels she needs a real rest.',
      retreat_dahab_for_2: 'For the woman who wants a new experience outside her comfort zone.',
      retreat_dahab_for_3: 'For the woman seeking balance between body, mind, and emotions.',
      retreat_dahab_for_4: 'For the woman who wants to meet inspiring women and a supportive community.',
      retreat_dahab_for_5: 'For the woman who wants to give herself the time she deserves.',
      retreat_dahab_not_for_title: 'Who is this retreat not for?',
      retreat_dahab_not_for_1: 'For those looking only for a fast-paced tourist trip full of activities.',
      retreat_dahab_not_for_2: 'For those who do not wish to participate in a women-only group.',
      retreat_dahab_not_for_3: 'For those with a health condition that prevents physical activity without consulting their doctor.',
      retreat_dahab_not_for_4: 'For those expecting instant or magical results within a few days.',
      retreat_dahab_faq_title: 'Frequently asked questions',
      retreat_dahab_faq_q1: 'Can I join if I am coming alone?',
      retreat_dahab_faq_a1: 'Absolutely. In fact, most participants in previous retreats joined alone. One of the most beautiful things that happens is women who start as strangers and leave as friends.',
      retreat_dahab_faq_q2: 'Do I need previous yoga experience?',
      retreat_dahab_faq_a2: 'Not at all. All sessions are suitable for beginners and advanced practitioners, with modifications for every level.',
      retreat_dahab_faq_q3: 'Can I share a room with a friend?',
      retreat_dahab_faq_a3: 'Yes, and this can be arranged in advance when registering.',
      retreat_dahab_faq_q4: 'What should I bring?',
      retreat_dahab_faq_a4: 'A full list of details and essentials will be sent to each participant before the retreat date.',
      retreat_dahab_cancel_title: 'Payment and cancellation policy',
      retreat_dahab_payment_deposit: 'Booking is confirmed with a non-refundable deposit of 400 ILS.',
      retreat_dahab_payment_balance: 'The remaining amount must be paid by 10.8 at the latest.',
      retreat_dahab_cancel_subtitle: 'Cancellation policy',
      retreat_dahab_cancel_1: 'The deposit is non-refundable after booking is confirmed.',
      retreat_dahab_cancel_2: 'If cancellation occurs up to 30 days before the retreat, the amount paid can be transferred to a future retreat or event.',
      retreat_dahab_cancel_3: 'If cancellation occurs less than 30 days before the retreat, no refund is possible due to prior commitments with the hotel and service providers.',
      retreat_dahab_cancel_4: 'If a replacement participant is found, the booking can be transferred to her after prior coordination.',
      retreat_dahab_cancel_note: 'Please register only when you are sure you can commit to participating.',
      retreat_dahab26_title: 'Dahab Retreat 2026',
      retreat_dahab26_with: 'with Nawal Omar',
      retreat_dahab26_quote: '"Sometimes all we need is to step away a little… to return to ourselves."',
      retreat_dahab26_story_1: 'I am Nawal Omar — a nurse specializing in women\'s health, a yoga teacher, and a daughter of the Palestinian community in Israel. I carry a message that began long before any retreat, project, or journey.',
      retreat_dahab26_story_2: 'Since the beginning of my nursing path, my goal has been to raise health awareness in the Arab community and be part of the real change women and families deserve. I believed knowledge is power, and that every woman deserves support, awareness, and tools for a healthier, more balanced life.',
      retreat_dahab26_story_3: 'Later I found in yoga an additional language of giving — one that goes beyond words and helps women return to their bodies, their breath, and their inner voice. From there I began building safe spaces that unite movement, awareness, and physical and emotional wellbeing.',
      retreat_dahab26_story_4: 'My life has held difficult and painful experiences, among the hardest the loss of my father — the person who taught me giving, responsibility, and belonging. These experiences did not change my message; they deepened it, and taught me that pain can become strength, and that we can turn our hardest chapters into a truer, deeper way of serving others.',
      retreat_dahab26_story_5: 'In recent years I have walked alongside more than 2,000 women across the country through workshops, lectures, programs, and women\'s retreats. This Dahab retreat is the seventh international retreat I lead.',
      retreat_dahab26_story_6: 'I believe one woman\'s success does not diminish another\'s, and that the strongest communities are built on cooperation, not competition. I always seek partnerships with inspiring women professionals, because true feminine power shows when we hold each other\'s hands and walk together.',
      retreat_dahab26_story_7: 'It is an honor to share this journey with you. I hope it becomes more than travel or vacation — a space where we return to ourselves and discover how much strength, light, and life still lives within us.',
      retreat_dahab26_yoga_alt: 'Yoga moment',
      retreat_dahab26_yoga_caption: 'Yoga moment',
      retreat_dahab26_guide_kicker: 'Dahab Retreat Guide 2026',
      retreat_dahab26_guide_subtitle: 'with Nawal Omar · A journey of rest, liberation, and return to the body',
      retreat_dahab26_name: 'Women\'s Dahab Retreat',
      retreat_dahab26_dates: '19.8 – 23.8',
      retreat_dahab26_tagline: 'A journey back to the body, the sea, and the strength within',
      retreat_dahab26_place: 'In one of Sinai\'s most beautiful places, between mountains, sea, and calm energy, we meet for a deep women\'s retreat in Dahab — at Nour Boutique Hotel, a seaside boutique hotel with a quiet spirit, ideal for retreats, meditation, yoga, and return to self.',
      retreat_dahab26_hotel_link: 'nourboutiquehotel.com ↗',
      retreat_dahab26_arc: 'The retreat is built as a complete journey: from earth… to water… to body… to senses… to heart.',
      retreat_dahab26_d1_chip: 'Day 1 · 19.8',
      retreat_dahab26_d1_title: 'Arrival & Opening',
      retreat_dahab26_d1_s1: '10:00 — Arrival in Dahab. Rest, room check-in, quiet time to breathe and settle into the place.',
      retreat_dahab26_d1_s2: '15:00 — Opening Ceremony. Opening the retreat, setting the intention, ice-breaking, meeting the women, and creating a safe space to begin together.',
      retreat_dahab26_d1_s3: '19:00 — Dinner. After dinner: a light mountain evening, calm, connection, and immersion in Dahab\'s atmosphere.',
      retreat_dahab26_d2_chip: 'Day 2 · 20.8',
      retreat_dahab26_d2_title: 'Earth Element · Grounding & Roots',
      retreat_dahab26_d2_s1: '07:30 — Morning yoga. Meditation, breathing techniques, and a yoga session focused on earth: stability, safety, roots, and return to the body.',
      retreat_dahab26_d2_s2: '09:00 — Breakfast.',
      retreat_dahab26_d2_s3: '10:00 — Trip to Blue Hole – Abu Galum – Blue Lagoon. A magical day between sea and mountains. Blue Hole is one of Dahab\'s most famous and beautiful areas — deep blue waters, coral reefs, and rare natural energy. Then Abu Galum and Blue Lagoon, among Sinai\'s calmest and most beautiful spots, ideal for stepping away from noise and returning to simplicity.',
      retreat_dahab26_d2_s4: 'At Blue Lagoon we work with power cards: each woman chooses a card, a message, and an intention to carry for the rest of the journey.',
      retreat_dahab26_d2_s5: '19:00 — Dinner. Free time to walk, rest, or sit with the sea.',
      retreat_dahab26_d3_chip: 'Day 3 · 21.8',
      retreat_dahab26_d3_title: 'Water Element · Liberation & Flow',
      retreat_dahab26_d3_s1: '07:30 — Morning yoga. Breathing techniques and yoga focused on water: flow, flexibility, emotions, and release from tension.',
      retreat_dahab26_d3_s2: '09:00 — Breakfast.',
      retreat_dahab26_d3_s3: '10:00 – 17:00 — The most important and beautiful day of the retreat. A special day for the body and nervous system: ice bath + sauna + lunch.',
      retreat_dahab26_d3_s4: 'The ice bath is not just a powerful experience — it is deep training in breath, presence, and nervous system regulation. It helps the body release stress, build resilience, activate circulation, and bring a high sense of clarity and inner strength. With the sauna, the body moves between heat and cold, contraction and relaxation, challenge and rest.',
      retreat_dahab26_d3_s5: 'This day will be one of the retreat\'s strongest moments — a day when we feel how intelligent, strong, and capable the body truly is.',
      retreat_dahab26_d3_s6: '19:00 — Dinner. Free time and rest.',
      retreat_dahab26_d4_chip: 'Day 4 · 22.8',
      retreat_dahab26_d4_title: 'The Senses · Presence & Connection',
      retreat_dahab26_d4_s1: '07:30 — Morning yoga. Meditation and deep work on the senses: how we hear, feel, touch, breathe, and return to the present moment.',
      retreat_dahab26_d4_s2: '09:00 — Breakfast.',
      retreat_dahab26_d4_s3: '17:30 — Sound Healing + Acro Yoga. A deep sound healing session to calm the nervous system, followed by Acro Yoga to strengthen trust, play, communication, and support among the women.',
      retreat_dahab26_d4_s4: '20:00 — Closing Circle. Closing the retreat circle: sharing, gratitude, intentions for returning home, and a gentle farewell ritual.',
      retreat_dahab26_d5_chip: 'Day 5 · 23.8',
      retreat_dahab26_d5_title: 'Departure',
      retreat_dahab26_d5_s1: 'Breakfast, packing, farewell to Dahab, and return home with renewed energy.',
      retreat_dahab26_includes_title: 'Included in the program',
      retreat_dahab26_inc1: 'Stay at Nour Boutique Hotel',
      retreat_dahab26_inc2: 'Daily breakfast and dinner',
      retreat_dahab26_inc3: 'All yoga, meditation, and breathwork sessions',
      retreat_dahab26_inc4: 'Sound Healing',
      retreat_dahab26_inc5: 'Acro Yoga',
      retreat_dahab26_inc6: 'Blue Hole – Abu Galum – Blue Lagoon trip',
      retreat_dahab26_inc7: 'Nature reserve entry fees',
      retreat_dahab26_inc8: 'Ice bath and sauna',
      retreat_dahab26_inc9: 'Transportation to and from Eilat and Dahab, round trip',
      retreat_dahab26_price_title: 'Cost',
      retreat_dahab26_price_early: 'First 5 participants: 3300₪ — full',
      retreat_dahab26_price_regular: 'Next registrations: 3500₪',
      retreat_dahab26_price_note: 'Price includes transportation, accommodation, breakfast and dinner, workshops, and nature reserve entry.',
      retreat_dahab26_closing: 'Dahab is not just travel… Dahab is a space where we return to ourselves.',
      retreat_dahab_final_title: '✨ What does the Dahab retreat include? ✨',
      retreat_dahab_final_intro: '5 days and 4 nights in one of Dahab\'s most beautiful hotels.',
      retreat_dahab_final_lead: 'The retreat includes:',
      retreat_dahab_final_inc1: 'Stay at Nour Boutique Hotel.',
      retreat_dahab_final_inc2: 'Daily breakfast and dinner.',
      retreat_dahab_final_inc3: 'Daily morning yoga by the sea.',
      retreat_dahab_final_inc4: 'Breathing techniques and guided meditations.',
      retreat_dahab_final_inc5: 'Trip to Blue Hole – Abu Galum – Blue Lagoon.',
      retreat_dahab_final_inc6: 'Power cards, reflection exercises, and writing.',
      retreat_dahab_final_inc7: 'Sound Healing.',
      retreat_dahab_final_inc8: 'Acro Yoga.',
      retreat_dahab_final_inc9: 'Sharing sessions and a safe women\'s circle.',
      retreat_dahab_final_inc10: 'Nature reserve entry fees.',
      retreat_dahab_final_inc11: 'Round-trip transportation from Eilat to Dahab.',
      retreat_dahab_final_highlight_title: '⭐️ The standout experience: Ice Bath & Sauna day ⭐️',
      retreat_dahab_final_highlight_lead: 'A full day dedicated to the body and nervous system, including:',
      retreat_dahab_final_ice: '❄️ Ice bath',
      retreat_dahab_final_sauna: '🔥 Sauna',
      retreat_dahab_final_lunch: '🥗 Lunch',
      retreat_dahab_final_ice_p1: 'The ice bath is not just a physical challenge — it is a deep experience of learning to control the breath under stress, calming the nervous system, building inner strength, and growing self-confidence.',
      retreat_dahab_final_ice_p2: 'Many women discover through this experience that they are far stronger than they ever believed.',
      retreat_dahab_final_ice_p3: 'Between the heat of the sauna and the cold of the water, the body lives a unique experience that helps activate circulation, raise energy levels, and bring a deep sense of mental clarity.',
      retreat_dahab_final_ice_p4: 'For me, this day is the heart of the retreat — one of the most impactful and transformative days of the entire experience. 🤍',
      retreat_dahab_includes_kicker: 'Dahab Retreat',
      retreat_dahab_includes_title: 'What does the trip include?',
      retreat_dahab_includes_yes_title: 'Included',
      retreat_dahab_includes_no_title: 'Not included',
      retreat_dahab_inc1: 'Bus to/from the Egyptian border crossing',
      retreat_dahab_inc2: 'Professional guidance: certified local guide',
      retreat_dahab_inc3: 'Retreat lead / yoga instructor',
      retreat_dahab_inc4: 'Daily meals as per program: breakfast + lunch + dinner',
      retreat_dahab_inc5: 'Transfer from Taba to Dahab',
      retreat_dahab_inc6: 'Local transfers within Dahab',
      retreat_dahab_inc7: 'Yoga space rental',
      retreat_dahab_exc1: 'Travel insurance',
      retreat_dahab_exc2: 'Drinks and personal purchases',
      retreat_dahab_exc3: 'Egypt entry visa',
      retreat_dahab_price_label: 'Cost',
      retreat_dahab_price_value: '3800 ILS',
      retreat_dahab_price_note: 'A non-refundable first deposit of 500 ILS is required to confirm booking.',
      retreat_dahab_book_now: 'Book now',
      retreat_dahab_policy_title: '💳 Payment method',
      retreat_dahab_policy_1: 'The booking is confirmed with a non-refundable first deposit of 500 ILS.',
      retreat_dahab_policy_2: 'The remaining amount must be paid by 20.4 at the latest.',
      retreat_dahab_policy_3: 'Available payment methods:',
      retreat_dahab_policy_4: '✔️ העברה בנקאית (bank transfer)',
      retreat_dahab_policy_5: '✔️ Bit',
      retreat_dahab_policy_6: 'After sending the payment, please share a transfer receipt image to confirm your booking officially.',
      retreat_dahab_policy_7: 'A seat is reserved only after the first deposit is transferred.',
      retreat_dahab_policy_8: 'Seats are limited, and priority is given to participants who confirm first.',
      retreat_dahab_policy_9: '⚖️ Cancellation policy',
      retreat_dahab_policy_10: '• If cancellation happens within 14 days before the retreat date, no amount is refunded.',
      retreat_dahab_policy_11: '• If you do not attend for any reason, there is no refund.',
      retreat_dahab_policy_12: '• You may transfer your booking to another participant if you find a replacement yourself.',
      retreat_dahab_policy_13: '• Booking confirmation is done with a non-refundable first deposit.',
      dahab_book_form_title: 'Book Dahab Retreat',
      dahab_book_name: 'Full name',
      dahab_book_phone: 'Phone (WhatsApp preferred)',
      dahab_book_confirm: 'Confirm booking',

      audio_question: 'Would you like to enable sound for videos on this device?',
      audio_later: 'Later',
      audio_enable: 'Enable sound',

      retreat_page_label: 'Zanzibar Retreat with Nawal Omar',
      retreat_page_title: '8 Days | 7 Nights',
      retreat_page_intro: `7/7/2026 - 14/7/2026
Yoga and sound healing retreat with a Zanzibar Island exploration.`,
      retreat_from: 'A journey designed to help you pause, breathe, and return to your body',
      retreat_bio1: 'A journey designed for women who need to pause, breathe, return to the body, and restore inner balance amid the beauty of Zanzibar.',
      retreat_bio2: 'This retreat is not just a vacation; it is a real space for rest, transformation, calm, and a deep connection with yourself through yoga, breathwork, sound healing, and nature.',
      retreat_heading_why: 'Why this retreat is different?',
      retreat_heading_included: 'What is included?',
      retreat_heading_experience: 'What you will experience',
      retreat_heading_daily_journey: 'Daily journey',
      retreat_heading_accommodation: 'Accommodation & food',
      retreat_heading_booking_policy: 'Booking & cancellation policy',
      retreat_heading_for_whom: 'Who is this retreat for?',
      retreat_heading_closing: 'Final message',
      retreat_scroll_down: 'Scroll',
      retreat_cta_title: 'Ready to begin your journey?',
      retreat_cta_subtitle: 'Step into calm, practice with presence, and return to yourself in Zanzibar.',
      retreat_cta_button: 'Reserve your spot',
      retreat_whatsapp_button: 'WhatsApp',
      retreat_form_name_label: 'Name',
      retreat_form_phone_label: 'Phone',
      retreat_form_notes_label: 'Notes',
      retreat_form_submit: 'Send',
      retreat_form_success: 'Thank you! Your request was sent successfully. We will contact you shortly.',
      retreat_form_error: 'Sorry, your request could not be sent. Please try again.',
      retreat_share_title: 'Retreat Details',
      retreat_share1: `Why this retreat is different?
• A balanced program between movement and rest, plus sea activities and nature.
• One distinguished hotel in Zanzibar, chosen for comfort, nature, and a calm retreat-friendly atmosphere.
• Daily breakfast and dinner to reduce logistical load.
• Two Sound Healing sessions with a specialist who brings the equipment to the hotel.
• A blend of the travel experience and a deep inner process led by Nawal.
• The option to join according to each participant's needs.

What is included?
• Round-trip direct flight ticket with Arkia
• Baggage up to 20 kg
• Carry-on bag
• All ground transfers within Zanzibar
• 7 nights in carefully selected accommodation in one distinguished hotel in Zanzibar
• Meals:
  o Daily breakfast
  o Daily dinner
• Two Sound Healing sessions with a specialist arriving with equipment to the hotel
• Visit to Salaam Cave
• Safari Blue boat trip
• Visit to Jozani Forest
• Visit to the Spice Farm
• Mnemba snorkeling trip
• Visit to Prison Island
• Tour of Stone Town

Selected accommodation details
• 7 nights in carefully selected accommodation in one distinguished hotel in Zanzibar, bringing together comfort, nature, and a calm atmosphere suited to the retreat experience.
• Final hotel details are shared after booking confirmation.

Booking & cancellation policy
• If cancellation happens less than one month before retreat date, no amount is refunded.
• In case of no-show for any reason, no refund is provided.
• Booking can be transferred to another participant only if you find a replacement yourself.
• Booking confirmation is based on a non-refundable first deposit.`,
      retreat_share2: `Final daily itinerary
The days were reorganized according to logistical notes, to make the sequence more comfortable and logical in terms of transfers, cost, and overall energy for the group.

Tuesday 7/7/2026 - Arrival in Zanzibar
After meeting Nawal at Ben Gurion Airport, the group departs on a direct Arkia flight to Zanzibar. Upon arrival, a comfortable bus will be waiting to transfer you to the hotel in the south of the island.
Time / Details	Details
Arrival & transfers	Transfer from the airport to the hotel in the south.
Dinner	A light dinner coordinated in advance with the hotel, to avoid long waits after the trip.
First meet	Very short introductions with the group, then rest and sleep.
✨ Value of this day
The goal of this day is to settle after travel, reduce stress, and enter the retreat atmosphere gradually—without pressure.
Useful links related to this day: Accommodation details are shared after booking confirmation

Wednesday 8/7/2026 - Return to the root
The morning starts with sunrise yoga on the beach, plus an opening ceremony for the retreat intention. Then a group breakfast, followed by a visit to Salaam Cave. Instead of making lunch inside The Rock the default option (due to higher prices), we’ll do a free photo stop near the restaurant area and have a more affordable lunch nearby.
Time / Details	Details
07:00	Sunrise yoga + pranayama + meditation on the sound of the sea.
08:30	Group breakfast at the hotel.
11:00	Visit Salaam Cave + deep breath experience inside the cave.
14:00	Photo stop near The Rock + free lunch at a more affordable place.
19:30	Dinner at the hotel.
20:30	A short evening sharing about the day.
✨ Value of this day
This day matters for breaking the ice between participants, creating a feeling of safety, and setting a personal intention for each participant about what she wants to release or receive.
Useful links related to this day: Salaam Cave

Thursday 9/7/2026 - Sea day - Safari Blue
A full sea day blending fun and presence. After a light morning practice and breakfast, the group is transferred to the departure point of the private Safari Blue boat trip.
Time / Details	Details
07:30	Short breathwork + gentle morning yoga to wake up the senses.
08:15	Breakfast.
09:00	Departure to the boat location.
10:00 - 17:00	Safari Blue trip: traditional boat, snorkeling, a sandy island, and a sea lunch on the island.
During the trip	Meditation on water, focusing on the sound of the sea, breathing, and inner expansion.
20:00	Dinner at the hotel + short evening sharing.
✨ Value of this day
The value here is releasing tension from the body, expanding inner sensation, and letting the sea return the group to a calm, flexible rhythm.
Useful links related to this day: Safari Blue

Friday 10/7/2026 - Nature & culture
A day for Jozani Forest, the Spice Farm, and a gentle rhythm back at the hotel—all while staying in the same accommodation.
Time / Details	Details
07:00	Light morning yoga
08:00	Breakfast
09:30	Visit Jozani Forest: mindful walk in nature + observation of Red Colobus monkeys
12:00	Visit Spice Farm: getting to know cinnamon, vanilla, cloves, nutmeg, and how aromas affect the nervous system
Afternoon	Return to the hotel for rest and relaxation
18:30	Soft sunset yoga
19:30	First Sound Healing session
✨ Value of this day
Nature, culture, and sensory discovery—with space to rest at the hotel before evening practice and sound.
Useful links related to this day: Jozani Forest - Spice Farm

Saturday 11/7/2026 - Quiet day & integration in Kiwengwa
After four full days of movement, sea, and nature, this day becomes a calmer space for integration, digestion, and enjoying the beauty of the new place—without rushing.
Time / Details	Details
07:30	Relaxed breakfast.
Morning	Free time for the sea / rest / spa—according to each participant.
17:30	Acro Yoga session based on trust and teamwork.
18:30	Second Sound Healing session.
19:30	Dinner.
20:30	Meditative journaling: what changed inside you since the start of the retreat?
✨ Value of this day
This day creates space to integrate everything that came before, and gives the body a chance to catch its breath before the final phase of the journey.
Useful links related to this day: Accommodation details are shared after booking confirmation

Sunday 12/7/2026 - Mnemba Island + horse-riding option
A new sea day at one of Zanzibar’s most beautiful snorkeling spots.
Time / Details	Details
07:00	Morning yoga + breathing.
08:15	Breakfast.
09:00	Transfer to the activity.
10:00 - 14:00	Mnemba trip: snorkeling, coral reef viewing, and possible dolphin sightings depending on sea conditions.
Evening	Play/workshop: strength vs. the ghost of weakness, plus writing down what each participant is ready to release for the closing day.
✨ Value of this day
The core value is restoring a sense of childhood, emotional openness, and connecting with natural beauty from a joyful and colorful place.
Useful links related to this day: Mnemba Island

Monday 13/7/2026 - Inner closing day
We soften this day so it feels more balanced and less crowded, with greater focus on inner closing instead of logistical “filler”.
Time / Details	Details
07:00	Last yoga session including editorial writing, deep meditation, and a guided visualization.
After breakfast	Free time for the sea, rest, massage/spa.
Before sunset	Personal prep for the closing ceremony—white outfit.
From sunset to night	Closing ceremony: shared circle, new intentions, and burning pages of "the ghost of weakness" under the open sky.
✨ Value of this day
We end the night the way we began: with clear structure, an open heart, and a real inner sense that something has truly released.
Useful links related to this day: Accommodation details are shared after booking confirmation

Tuesday 14/7/2026 - Stone Town & return to Israel
The last day is planned to gather quiet morning time, then visit Prison Island and tour Stone Town before heading back to the airport.
Time / Details	Details
Morning	Free time until midday for swimming, relaxing, or taking final photos.
12:00	Check-out and transfer toward Stone Town.
13:30	Trip to Prison Island to see the giant tortoises + visit the historic island.
15:45	Free time for lunch in Stone Town.
17:00	Tour of Stone Town: old alleys, local art, markets, and gifts.
19:00	Transfer to the airport.
21:25	Return to Israel.
✨ Value of this day
With this sequence, participants get a beautiful and practical closing—without extra pressure the night before.
Useful links related to this day: Prison Island - Stone Town`,
      retreat_share3: `Who is this retreat for?
• For those who want to travel with meaning—not only as a tourist trip.
• For those who feel they need a safe space to return to her body, her breath, and inner calm.
• For those seeking an experience that combines sea, movement, femininity, rest, and a supportive group.
• For those who want to experience Zanzibar through both outer beauty and inner healing.

Final message
This retreat is not only a trip to a beautiful place; it is a real invitation to return to yourself: to your body, to your breath, and to the inner sea that calms when it finds the right space. Zanzibar here is not just a destination—it is a complete experience guided carefully by Nawal, with a deep feminine touch that makes each participant feel part of something living, soft, and transformative.`,
      retreat_questions: 'For questions or inquiries:',
      retreat_submit: 'Submit request',

      al_tira_page_label: 'Al-Tira',
      al_tira_page_title: 'Al-Tira Yoga',
      al_tira_page_intro: 'Experience freedom in the air. Suspension-based practice for strength, flexibility and playfulness—suitable for all levels.',
      al_tira_heading: 'Suspension yoga for every body',
      al_tira_p1: 'Al-Tira Yoga brings the mat into the air. Using soft suspension, we build strength, release tension, and explore movement in a supportive, playful way. Whether you are new or experienced, the practice meets you where you are.',
      al_tira_p2: 'Join the Al-Tira community to stay updated on sessions, share with fellow practitioners, and connect with Nawal and the team.',
      al_tira_join_title: 'Join the Al-Tira Yoga group',
      al_tira_join_text: 'Get schedules, updates, and connect with others in the Al-Tira Yoga community on WhatsApp.',
      al_tira_join_btn: 'Join Al-Tira Yoga WhatsApp group',

      jiva_page_label: 'Haifa Yoga',
      jiva_page_title: 'Haifa Yoga',
      jiva_page_body:
        'Vinyasa yoga is a dynamic practice that connects movement and breath, so each shape flows into the next with rhythm and awareness.',
      jiva_page_body_2:
        'This style strengthens the body, builds flexibility, calms the mind, and deepens breath–body coordination—making class a grounded experience of presence and inner balance.',
      jiva_page_whatsapp:
        'Join the Haifa Yoga community on WhatsApp for class updates, inspiration, and connection with fellow practitioners.',
      jiva_moments_kicker: 'Reels & photos',
      jiva_moments_title: 'From the mat & the sea',
      jiva_moments_reels_label: 'Short video reels',
      jiva_moments_swipe_hint: 'Swipe sideways to see more.',
      jiva_reel_aria_1: 'Haifa yoga — short reel',
      jiva_reel_aria_2: 'Haifa yoga — second short reel',
      jiva_reel_play: 'Play video',
      jiva_photo_alt_1: 'Haifa yoga — practice by the sea',
      jiva_photo_alt_2: 'Haifa yoga — moment',
      jiva_pricing_greeting: 'Hello friends',
      jiva_pricing_title: 'Pricing',
      jiva_card_trial_title: 'Trial class',
      jiva_card_pack4_title: '4-class package',
      jiva_card_single_title: 'Single class',
      jiva_price_trial: '65 ILS',
      jiva_price_pack4: '260 ILS',
      jiva_price_single: '75 ILS',
      jiva_card_register: 'Register now',
      jiva_private_gift_badge: 'Gift card',
      jiva_private_title: 'Private lesson for one or two girls',
      jiva_private_subtitle: 'Yoga with guided meditation',
      jiva_private_price_1: 'One girl: 200 ILS',
      jiva_private_price_2: 'Two girls: 300 ILS',
      jiva_private_gift_note: 'Available as a gift certificate — message us on WhatsApp for date & details.',
      jiva_private_btn_1: 'Register — 1 girl (200)',
      jiva_private_btn_2: 'Register — 2 girls (300)',
      jiva_private_btn_gift: 'Gift card',
      jiva_payment_title: 'Payment',
      jiva_payment_methods: '🎟️ Payment via Bit or העברה בנקאית',
      jiva_policy_title: 'Cancellation policy',
      jiva_cancel_rule: 'Class cancellation is allowed only up to 12 hours before.',
      jiva_meeting_title: 'Class time',
      jiva_schedule_slot1: 'Tuesday · Naeem Studio · 19:20',
      jiva_schedule_slot2: 'Saturday · by the sea · 18:30',
      jiva_join_eyebrow: 'Community',
      jiva_join_title: 'Join the Haifa Yoga group',
      jiva_join_text: 'Get schedules, updates, and connect with others in the Haifa Yoga community on WhatsApp.',
      jiva_join_btn: 'Join Haifa Yoga WhatsApp group',
      haifa_register_title: 'Confirm your registration',
      haifa_register_selected_label: 'Selected class:',
      haifa_register_name: 'Full name',
      haifa_register_phone: 'Phone (WhatsApp preferred)',
      haifa_register_confirm: 'Confirm registration',
      haifa_register_success: 'Thank you! Registration completed successfully. We will contact you shortly.',
      haifa_register_error: 'Sorry, registration failed. Please try again.',
      haifa_pkg_trial: 'Trial class (65 ILS)',
      haifa_pkg_pack4: '4-class package (260 ILS)',
      haifa_pkg_single: 'Single class (75 ILS)',
      haifa_pkg_private1: 'Private lesson - one girl (200 ILS)',
      haifa_pkg_private2: 'Private lesson - two girls (300 ILS)',
      haifa_pkg_gift: 'Gift card',

      nawal_loader: 'Breathe',
      nawal_tagline: 'A quiet space for your inner light',
      nawal_register: 'Register for Retreat',
      nawal_quote: '"Inhale the future, exhale the past."',
      nawal_connect: 'Connect with presence',
      nawal_footer: 'Mindfulness · Yoga · Calm',
      nawal_haifa: 'Haifa Yoga'
    },
    ar: {
      nav_home: 'الرئيسية',
      nav_about: 'من أنا',
      nav_video: 'فيديو',
      nav_workshops: 'ورش العمل',
      nav_al_tira: 'الطيرة يوغا',
      nav_jiva: 'حيفا يوغا',
      nav_retreat: 'ريتريت',
      seo_title: 'نوال عمر',
      seo_description:
        'مدربة يوغا معتمدة نوال عمر في حيفا وإسرائيل: فينيسا، يين، هاثا وتأمل. حصص خاصة وجماعية، ورش الطيرة وحيفا، وريتريت دولية. يوغا في إسرائيل.',
      menu_label: 'القائمة',
      menu_close: 'إغلاق القائمة',
      lang_toggle: 'تغيير اللغة',
      menu_social_title: 'تواصل',
      social_whatsapp_label: 'واتساب',
      social_instagram_label: 'إنستغرام',
      social_whatsapp_aria: 'واتساب',
      social_instagram_aria: 'إنستغرام',
      footer_tagline: 'حيث تلتقي اليوغا بالهدوء والجودة',
      copyright: 'جميع الحقوق محفوظة.',
      back: 'رجوع',
      lang_ar: 'العربية',
      lang_en: 'English',
      lang_btn_ar: 'العربية',
      lang_btn_en: 'الانجليزية',

      hero_tagline: 'يوغا · وعي · راحة',
      hero_title1: 'التغيير يبدأ',
      hero_title2: 'هنا',
      hero_cta_book: 'استكشفي الورشات',
      hero_cta_discover: 'اكتشفي المزيد',
      hero_bottom: 'خاص · جماعي · رحلات راحة',
      page_loader_aria: 'جاري تحميل الصفحة',
      dashboard_label: 'لوحة الممارسة',
      dashboard_title: 'كل ما تحتاجينه في عرض واحد واضح',
      dashboard_intro: 'نظرة مركزة على البرامج، مستوى الشدة، وأسهل طرق الحجز. مصممة بأسلوب Mobile First ليبقى كل شيء واضحًا وسهل التنفيذ على الهاتف.',
      dashboard_card1_title: 'إحصائيات سريعة',
      dashboard_metric_1_value: '+500',
      dashboard_metric_1_label: 'متدرّب/ة',
      dashboard_metric_2_value: '+5 سنوات',
      dashboard_metric_2_label: 'خبرة تدريب',
      dashboard_metric_3_value: '4 أساليب',
      dashboard_metric_3_label: 'أنماط يوغا',
      dashboard_metric_4_value: 'مدينتان',
      dashboard_metric_4_label: 'تواجد أسبوعي',
      dashboard_card2_title: 'ما الأنسب لك؟',
      dashboard_card2_item1: 'جلسات خاصة: متابعة فردية للمرونة، الوضعية، والثقة.',
      dashboard_card2_item2: 'حصص جماعية: تدفق متوازن بطاقة جماعية واعية.',
      dashboard_card2_item3: 'ورش عمل: محاور مركزة لتقدم أسرع وتقنية أعمق.',
      dashboard_card2_item4: 'ريتريت: إعادة ضبط كاملة مع حركة، تنفس، وطبيعة.',
      dashboard_card3_title: 'احجزي خلال 3 خطوات',
      dashboard_card3_item1: '1) اختاري النوع المناسب: حصة، ورشة، أو ريتريت.',
      dashboard_card3_item2: '2) أرسلي عبر واتساب: الاسم، المستوى، واليوم المناسب.',
      dashboard_card3_item3: '3) يصلك تأكيد سريع مع كل تفاصيل الجلسة.',
      dashboard_action_1: 'عرض الورشات',
      dashboard_action_2: 'الحجز عبر واتساب',

      about_label: 'عن نوال',
      about_title: 'مدربة يوغا',
      about_subtitle: 'رحلة وعي ونفس وحركة',
      about_name: 'نوال عمر',
      about_cert: 'مدربة يوغا معتمدة • فينيسا، يين، هاثا، تأمل',
      about_bio: 'مدربة يوغا معتمدة مع أكثر من خمس سنوات من الممارسة والتعليم. فينيسا، يين، هاثا والتأمل—للمبتدئين والمتقدمين. إعادة الاتصال بجسدك ونفسك والهدوء الداخلي في الاستوديو أو في الطبيعة.',
      about_point1: 'معتمدة (RYT 200+) — جلسات خاصة وجماعية',
      about_point2: 'ورش عمل ورحلات راحة في الطبيعة',
      stat_trainees: 'متدرب',
      stat_years: 'سنوات',
      stat_styles: 'أنماط يوغا',

      video_label: 'ممارسة وحضور',
      video_title: 'لحظة هدوء',
      video_muted: 'صامت',
      video_unmute: 'تشغيل الصوت',
      video_live: 'صوت مباشر',
      video_caption: 'نوال عمر · يوغا ووعي',
      story_label: 'قصتي',
      story_text1: 'أنا مدربة يوغا معتمدة مع أكثر من خمس سنوات من الممارسة والتعليم. ما بدأ كبحث شخصي عن الهدوء والمرونة أصبح طريقاً لمشاركة اليوغا مع الآخرين—فينيسا، يين، هاثا، وتأمل موجّه.',
      story_text2: 'سواء في الاستوديو أو في الطبيعة، أصمم كل جلسة لمساعدتك على إعادة الاتصال بجسدك ونفسك وسكونك الداخلي. أؤمن أن اليوغا للجميع: حركة لطيفة، نفس واعٍ، ولحظات صمت تعيدك إلى ذاتك.',

      moments_label: 'صور ولحظات',
      moments_title: 'لمحات من الممارسة والهدوء',
      gallery_prev: 'الصورة السابقة',
      gallery_next: 'الصورة التالية',
      gallery_swipe: 'اسحبي أو اسحب للتصفح',

      workshops_label: 'ورش العمل',
      workshops_heading: 'حيفا · ريتريت',
      al_tira_title: 'الطيرة يوغا',
      al_tira_desc: 'اختبري الحرية في الهواء. ممارسة معلقة للقوة والمرونة والمرح—مناسبة لجميع المستويات.',
      al_tira_cta: 'اكتشفي المزيد',
      jiva_title: 'حيفا يوغا',
      jiva_desc: 'ربط الجسد والنفس والعقل. نهج شامل يدمج الحركة والتأمل والوعي في فضاء داعم.',
      jiva_cta: 'اعرفي المزيد',
      retreat_title: 'ريتريت',
      retreat_desc: 'ابتعدي عن اليومي. رحلات يوغا متعددة الأيام في الطبيعة—ممارسة عميقة وراحة واتصال بأرواح متشابهة.',
      retreat_cta: 'استكشفي ريتريت',
      retreats_page_label: 'مجموعة الريتريت',
      retreats_page_title: 'الريتريتات',
      retreats_page_intro: 'اختاري رحلتك القادمة للهدوء والتجدد.',
      retreats_upcoming_title: 'ريتريتات قادمة',
      retreats_past_title: 'ريتريتات سابقة',
      retreat_status_badge: 'مكتمل',
      retreat_registration_closed_note: 'التسجيل مغلق حالياً.',
      retreat_cta_completed: 'اكتمل الريتريت',
      retreat_dahab_booking_unavailable: 'الحجز مغلق',
      retreats_zanzibar_title: 'ريتريت زنجبار',
      retreats_zanzibar_desc: '8 أيام | 7 ليالٍ من اليوغا، الساوند هيلينغ، الطبيعة، والتجدد العميق.',
      retreats_dahab_title: 'ريتريت دهب',
      retreats_dahab_desc: 'خلوة دهب النسائية 19–23 آب 2026 — يوغا، ساوند هيلينغ، طبيعة، وتجدد عميق على البحر الأحمر.',
      retreats_wadi_title: 'ريتريت وادي رم',
      retreats_wadi_desc: 'ريتريت نسائي قمري في وادي رم يجمع اليوغا، التنفس، الدائرة النسائية، وطقوس التحرر في الصحراء.',
      retreats_view_details: 'عرض تفاصيل الريتريت',
      retreats_form_tag: 'التسجيل',
      retreats_form_title: 'استمارة صحية',
      retreats_form_desc: 'فورم تسجيل هادئ ومتعدد الخطوات لإكمال بيانات الحجز للريتريت.',
      retreats_form_cta: 'فتح فورم التسجيل',
      retreat_wadi_meta_desc: 'ريتريت نسائي في وادي رم مع نوال عمر. يوغا الصحراء، ساوند هيلينغ، تنفّس عميق، وعودة للذات تحت النجوم.',
      retreat_wadi_page_label: 'ريتريت وادي رم للنساء',
      retreat_wadi_page_title: 'ريتريت وادي رم ضوء القمر',
      retreat_wadi_page_intro: 'رحلة إلى عمق الروح حيث تلتقي الصحراء بالسما. 17.6 - 21.6',
      retreat_wadi_page_intro2: '5 أيام | 4 ليالي. هذا ليس مجرد سفر، هذا انتقال داخلي في مساحة أنثوية آمنة.',
      retreat_wadi_about_title: 'من أنا؟',
      retreat_wadi_about_nawal_name: 'نوال عمر',
      retreat_wadi_about_nawal_role: 'ممرضة ومعلمة يوغا ڤينياسا',
      retreat_wadi_about_nawal_text: 'أدمج بين العلم والوعي الجسدي والروحاني. أخلق مساحات آمنة للنساء للعودة إلى أجسادهن، لشفاء الحوض، لتهدئة الجهاز العصبي، وللتحرر من أنماط قديمة لا تخدمهن. هذا الريتريت هو امتداد طبيعي لرسالتي.',
      retreat_wadi_about_isra_name: 'اسراء تايه',
      retreat_wadi_about_isra_role: 'معالجة نفسية وصانعة محتوى متخصصة في فهم الجهاز العصبي، ديناميكيات العلاقات، وتشافي الجروح العاطفية.',
      retreat_wadi_about_isra_text: 'أرافق الأفراد، الأزواج، والأمهات في رحلتهم نحو التوازن النفسي، تنظيم المشاعر، وبناء علاقة أكثر أمانًا مع الذات والآخر.',
      retreat_wadi_gallery_title: 'لحظات من ريتريت وادي رم',
      retreat_wadi_gallery_alt1: 'لحظة من وادي رم',
      retreat_wadi_gallery_alt2: 'رمال وادي رم',
      retreat_wadi_gallery_alt3: 'شروق في الصحراء',
      retreat_wadi_gallery_alt4: 'دائرة نسائية في الريتريت',
      retreat_wadi_gallery_alt5: 'نجوم الليل في الصحراء',
      retreat_wadi_gallery_alt6: 'بانوراما وادي رم',
      retreat_wadi_gallery_alt7: 'مخيم خيام في الصحراء',
      retreat_wadi_gallery_alt8: 'مخيم صحراوي',
      retreat_wadi_gallery_alt9: 'لحظة بورتريه في وادي رم',
      retreat_wadi_gallery_alt10: 'مبيت ليلي في وادي رم',
      retreat_wadi_reels_title: 'قسم الفيديوهات (الريلز)',
      retreat_wadi_reels_hint: 'مرري أفقيًا واضغطي تشغيل.',
      retreat_wadi_reels_label: 'ريلز ريتريت وادي رم',
      retreat_wadi_reel_play: 'تشغيل الريل',
      retreat_wadi_reel_aria_1: 'ريل وادي رم 1',
      retreat_wadi_reel_aria_2: 'ريل وادي رم 2',
      retreat_wadi_reel_aria_3: 'ريل وادي رم 3',
      retreat_wadi_reel_aria_4: 'ريل وادي رم 4',
      zanzibar_reels_kicker: 'ريلز',
      zanzibar_reels_title: 'فيديوهات (ريلز) عن زنجبار',
      zanzibar_reels_hint: 'مرّري أفقيًا واضغطي تشغيل.',
      zanzibar_reels_label: 'ريلز زنجبار',
      zanzibar_reel_play: 'تشغيل الريل',
      zanzibar_reel_aria_1: 'ريل زنجبار 1',
      zanzibar_reel_aria_2: 'ريل زنجبار 2',
      zanzibar_reel_aria_3: 'ريل زنجبار 3',
      zanzibar_reel_aria_4: 'ريل زنجبار 4',
      zanzibar_sold_out: 'Sold out',
      zanzibar_dates_soon: 'تواريخ جديدة قريباً',
      zanzibar_form_closed: 'التسجيل مغلق — تواريخ جديدة قريباً',
      retreat_wadi_why_title: 'لماذا هذا الريتريت مختلف؟',
      retreat_wadi_why_1_title: '1) الصحراء تردّكِ لنفسك',
      retreat_wadi_why_1_text: 'صمت الصحراء يهدّئ التفكير الزائد ويعيدكِ للجذر والثبات.',
      retreat_wadi_why_2_title: '2) الدائرة النسائية تشفي',
      retreat_wadi_why_2_text: 'مساحة بلا حكم وبلا مقارنة. نساء يدعمن بعضهن بوعي ومحبة.',
      retreat_wadi_why_3_title: '3) الجسد يتحرر',
      retreat_wadi_why_3_text: 'يوغا يومية، تنفّس عميق، وساوند هيلينغ لإعادة التوازن الداخلي.',
      retreat_wadi_why_4_title: '4) طقس تحرر حقيقي',
      retreat_wadi_why_4_text: 'تحت نجوم وادي رم نترك الأنماط القديمة ونرجع أخفّ وأنقى وأوضح.',
      retreat_wadi_program_title: 'البرنامج الكامل',
      retreat_wadi_day1_chip: 'اليوم 01',
      retreat_wadi_day1_title: 'الوصول وبناء النية',
      retreat_wadi_day1_b1: 'لقاء عند معبر بيت شان والانطلاق نحو وادي رم.',
      retreat_wadi_day1_b2: 'استقبال بدوي دافئ + عشاء صحراوي تقليدي.',
      retreat_wadi_day1_b3: 'ورشة تعارف عميقة وبناء نوايا.',
      retreat_wadi_day1_b4: 'جلسة تنفس خفيفة + سهرة هادئة تحت النجوم.',
      retreat_wadi_day2_chip: 'اليوم 02',
      retreat_wadi_day2_title: 'قوة الصحراء',
      retreat_wadi_day2_b1: 'يوغا الشروق بتركيز على الجذر والحوض.',
      retreat_wadi_day2_b2: 'تمارين تنفّس + إفطار صحي + ورشة عميقة.',
      retreat_wadi_day2_b3: 'تأمل صامت + كتابة داخلية + ساوند هيلينغ.',
      retreat_wadi_day2_b4: 'تأمل نجوم + ورشة تلسكوب.',
      retreat_wadi_day3_chip: 'اليوم 03',
      retreat_wadi_day3_title: 'رحلة الداخل والخارج',
      retreat_wadi_day3_b1: 'يوغا فتح القلب والحوض + تأمل موجه.',
      retreat_wadi_day3_b2: 'بطاقات القوة + كتابة عاطفية.',
      retreat_wadi_day3_b3: 'جولة جيبات في صحراء وادي رم.',
      retreat_wadi_day3_b4: 'يوغا الغروب + أكرو يوغا خفيفة للتوازن والثقة.',
      retreat_wadi_day4_chip: 'اليوم 04',
      retreat_wadi_day4_title: 'الاندماج والتحوّل',
      retreat_wadi_day4_b1: 'يوغا صباحية عميقة لدمج الطاقة الأنثوية.',
      retreat_wadi_day4_b2: 'ورشة ثانية + وقت شخصي للراحة.',
      retreat_wadi_day4_b3: 'ركوب جمال + ساوند هيلينغ عميق لإغلاق الدوائر.',
      retreat_wadi_day4_b4: 'حفلة خفيفة + إغلاق دائرة الريتريت.',
      retreat_wadi_day5_chip: 'اليوم 05',
      retreat_wadi_day5_title: 'وداع وتثبيت التحوّل',
      retreat_wadi_day5_b1: 'فطور الختام + دائرة تثبيت النوايا.',
      retreat_wadi_day5_b2: 'وداع الصحراء والرجوع بطاقة جديدة.',
      retreat_wadi_accommodation_kicker: 'ريتريت وادي رم',
      retreat_wadi_accommodation_title: 'خيارات الإقامة',
      retreat_wadi_stay1_title: 'غرفة بابلز',
      retreat_wadi_stay1_b1: 'تجربة فاخرة تحت النجوم في غرفة دائرية.',
      retreat_wadi_stay1_b2: 'مكيّف + حمام خاص + خصوصية كاملة.',
      retreat_wadi_stay1_b3: 'أسرّة مريحة جدًا + جلسة خارجية خاصة.',
      retreat_wadi_stay1_price: 'السعر: 3600 شيكل للشخص (غرفة زوجية)',
      retreat_wadi_stay2_title: 'غرفة بانوراما',
      retreat_wadi_stay2_b1: 'غرفة واسعة بإطلالة مفتوحة على الصحراء.',
      retreat_wadi_stay2_b2: 'مكيّفة بالكامل + حمام خاص + أسرّة مريحة جدًا.',
      retreat_wadi_stay2_b3: 'راحة عالية وتجربة بانورامية هادئة.',
      retreat_wadi_stay2_price: 'السعر: 3200 شيكل للشخص (غرفة زوجية)',
      retreat_wadi_includes_title: 'يشمل السعر',
      retreat_wadi_inc1: '5 أيام و4 ليالي إقامة.',
      retreat_wadi_inc2: 'فطور + عشاء يوميًا و3 وجبات غداء.',
      retreat_wadi_inc3: 'مواصلات من/إلى المعبر.',
      retreat_wadi_inc4: 'جولة جيبات + ركوب جمال + ورشة تلسكوب.',
      retreat_wadi_inc5: 'يوغا يومية + تنفّس + تأمل.',
      retreat_wadi_inc6: 'ورشتيّن عميقتين + ساوند هيلينغ + مرافقة نفسية + تصوير احترافي.',
      retreat_wadi_payment_title: 'الدفع وسياسة الإلغاء',
      retreat_wadi_policy_1: 'يتم تثبيت الحجز بدفعة أولى غير مستردة بقيمة 400 شيكل.',
      retreat_wadi_policy_2: 'المبلغ المتبقي يُدفع حتى موعد أقصاه 10.6.',
      retreat_wadi_policy_3: 'طرق الدفع المتاحة: تحويل بنكي أو Bit.',
      retreat_wadi_policy_4: 'يرجى إرسال صورة التحويل لتأكيد الحجز رسميًا.',
      retreat_wadi_policy_5: 'عدد الأماكن محدود والأولوية لأول من يثبت حجزه.',
      retreat_wadi_policy_6: 'في حال الإلغاء قبل 14 يوم من موعد الريتريت لا يتم استرجاع أي مبلغ.',
      retreat_wadi_policy_7: 'في حال عدم الحضور لا يوجد استرجاع. يمكن تحويل الحجز لمشاركة أخرى عند إيجاد بديلة.',
      retreat_wadi_price_label: 'الأسعار تبدأ من',
      retreat_wadi_price_value: '3600 شيكل',
      retreat_wadi_price_note: 'ريتريت صحراوي + دائرة نسائية + إعادة ضبط داخلية عميقة.',
      retreat_wadi_book_now: 'احجزي ريتريت وادي رم',
      retreat_dahab_page_label: 'خلوة دهب النسائية 2026',
      retreat_dahab_meta_title: 'خلوة دهب النسائية 2026 | نوال عمر',
      retreat_dahab_meta_desc:
        'خلوة دهب النسائية 19–23 آب 2026 مع نوال عمر. يوغا، ساوند هيلينغ، حمام ثلج، رحلة Blue Hole، وتجدد في Nour Boutique Hotel.',
      retreat_dahab_page_title: 'خلوة دهب 2026',
      retreat_dahab_page_intro: '19.8 – 23.8 · رحلة للعودة للجسد، للبحر، وللقوة اللي جوانا',
      retreat_dahab_hero_identity: 'ممرضة · مدربة يوغا · ناشطة صحة المرأة',
      retreat_dahab_hero_badge: 'نساء فقط · 20 مقعد',
      retreat_dahab_hero_stat1: '7 خلوات دولية',
      retreat_dahab_hero_stat2: 'أكثر من 2000 امرأة',
      retreat_dahab_hero_stat3: '5 أيام · دهب · سيناء',
      retreat_dahab_hero_host: 'مضيفتكم',
      retreat_dahab_hero_dates_aria: 'تواريخ الخلوة: 19 إلى 23 أغسطس 2026، دهب سيناء',
      retreat_dahab_hero_dates_range: '19 – 23',
      retreat_dahab_hero_dates_month: 'أغسطس 2026',
      retreat_dahab_hero_dates_place: 'دهب · سيناء',
      retreat_dahab26_story_kicker: 'كلمات من نوال',
      retreat_dahab_cv_badge: 'الأماكن محدودة',
      retreat_dahab_cv_subtitle: 'أيام انفصال كامل — يوغا، بحر، وسكينة عميقة مع نوال عمر.',
      retreat_dahab_cv_price: '3500₪',
      retreat_dahab_cv_price_old: '3300₪',
      retreat_dahab_cv_price_unit: '/ للشخص',
      retreat_dahab_cv_btn_register: 'سجّل الآن',
      retreat_dahab_cv_btn_program: 'شوف البرنامج',
      retreat_dahab_cv_trust: '٧ خلوات دولية · أكثر من 2000 امرأة · حجز آمن',
      retreat_dahab_cv_proof_label: 'من آخر خلوة',
      retreat_dahab_cv_participant: '(مشاركة)',
      retreat_dahab_cv_t1_name: 'سمر الراشد',
      retreat_dahab_cv_t1_country: 'حيفا',
      retreat_dahab_cv_t1_quote: 'الريتريت لكل شخص حابب يلاقي نفسه .. مش نزهه ولا رحله عاديه .. في ناس بتفكر يلا بطلع بغير جو والاشي مختلف تماماً .. انك تبعدي عن التلفون وتواجهي نفسك وخوفك بهدوء وتصلي للسلام النفسي فهو للاشخاص الي عنجد بحاجه لهيك اشي ... شخصياً كنت بريتريت وبرجع بعيد مره ومرتين وعشره',
      retreat_dahab_cv_t2_name: 'رونزا حايك',
      retreat_dahab_cv_t2_country: 'الناصرة',
      retreat_dahab_cv_t2_quote: 'حبيباتي 🥰\nكانت تجربة رائعة وعميقة، فيها تعرفت عأشخاص مميزين، أثرو في كتير كل وحدة بطريقتها، وتعلمت منكو شغلات اللي رح اخدها معي لبعيد\nممتنة لكل اشي صار بهاي الرحلة، الصعوبات والتحديات، العمق والاصغاء والتقبل اللي كان عند الجميع، وطبعاً لكل الضحك والمتعة اللي ما وقفتش، طاقاتكو ناااار 😂\nشكر كبير كتيييير لنوال — أكثر من رائعة 🥰\nكتير تشرفت بمعرفتكو صبايا، شكراً عكل اشي جميعاً وانشالله منضل نلتقي 💖💖',
      retreat_dahab_cv_t3_name: 'أولا',
      retreat_dahab_cv_t3_country: 'يافا',
      retreat_dahab_cv_t3_quote: 'انا بدي اقول اني بحبكو كتير🫂🤍\nكل وحده فيكو قعدت واتربعت بقلبي\nشكرا لكل نور طلع منكو وكل اشي اتعلمته منكو عن حالي وعن الدنيا🫂\nكانلي شرف عظيم اتعرف عليكو وتكونو جزء من حياتي🤍 وجزء من رحلة الحياة الحلوه هاي🙏🏼\nشكرا عمحبتكو لنفسكو ، على قلوبكو الحلوه، على حضنكو، على ضحكتكو، على حكمتكو🥹🙏🏼🙏🏼\nنوال بحبك قد الكون🤍\nالحمدلله على نعمة وجودك بهاي الحياة، كميات حب ونور وين ما تروحي بتحطي منها قطرة وبتبدا تكبر وتكبر وتتوسع🥹 الله يحميكي وينور طريقك🤍',
      retreat_dahab_cv_t4_name: 'جهان صواعد',
      retreat_dahab_cv_t4_quote: 'كيفكو صبايا؟ ❤️\nبدي أقلكو انه عنجد كل وحدة فيكو مميزة بطريقتها، وإني ممتنة من كل قلبي انه صرلي فرصة اعرفكو واكون معكو بهاي التجربة ❤️\nكنت بعدة مجموعات قبل وولا مرة حسيت بهيك هارموني ومشاعر إيجابية بين الاشخاص اللي بالمجموعة ❤️ الدعم اللي كان بينا والمشاركات والتشجيع والعطاء من القلب مش أشياء مفهومة ضمنا بالمرة وبصراحة فاجئوني ومكنتش متوقعتهن خاصة بمجموعة كبيرة ❤️ نوال، أعطيتِ من قلبك وكان لكِ تأثير كبير عليّ من جوا ❤️ كل تجربة معك بتخليني أقول لحالي بدي أخرى تجربة ❤️ صبايا بتمنى نضل عتواصل ونغدر نلتقي لانه بدي أرواح زيكو بحياتي ❤️ ماحلاكو 🥰',
      retreat_dahab_cv_t5_name: 'عبير حلحل',
      retreat_dahab_cv_t5_quote: 'حبيبات قلبي ❤️🦋🤍\nفي أماكن... ما بنوصلها إلا لما نكون مستعدين ننكسر ونرجع نركب حالنا من جديد...\nووادي رام كانت واحدة من هالأماكن.\n5 أيام بعيد عن كل شي نعرفه... بعيد عن ضجيج الحياه بس قريبين جدًا من أعمق إشي جوانا.\nبين الصمت، وبين أنفاسنا، وبين الأرض الواسعة اللي حضنتنا...\nانفتحت مساحات جواتنا يمكن أول مرة نسمعها بصدق.\nكل وحدة فينا إجت وهي شايلة قصة... وجع... حنين... أو حتى فراغ... ومع هيك، خلقنا سوا مساحة أمان، بدون حكم، بدون أقنعة... بس قلوب عم تنشاف لبعضها.\nأنا إجيت على هالرتريت وأنا مش أنا... شايلة فقدان أختي، وثقل كبير ما كان له كلمات...\nروحت وأنا أقوى... أهدى... وأقرب لحالي. مش لأنه الوجع اختفى... بس لأنه تعلمت كيف أحمله بحب، مش بخوف.\nوبين كل هالتجربة...\nفي حضن كان دافي بشكل خاص...\nشكرًا لنوال 🤍',
      retreat_dahab_cv_includes_title: 'كل شي مشمول',
      retreat_dahab_cv_includes_sub: 'من لحظة وصولك لآخر نَفَس',
      retreat_dahab_cv_inc1_title: 'إقامة كاملة',
      retreat_dahab_cv_inc1_desc: '٤ ليالٍ في Nour Boutique Hotel على البحر.',
      retreat_dahab_cv_inc2_title: 'وجبات صحية',
      retreat_dahab_cv_inc2_desc: 'فطور وعشاء يومياً في الفندق.',
      retreat_dahab_cv_inc3_title: 'جلسات يوغا',
      retreat_dahab_cv_inc3_desc: 'يوغا صباحية يومية مع نوال عمر.',
      retreat_dahab_cv_inc4_title: 'رحلات بحرية',
      retreat_dahab_cv_inc4_desc: 'Blue Hole · Abu Galum · Blue Lagoon.',
      retreat_dahab_cv_inc5_title: 'ورش تنفس',
      retreat_dahab_cv_inc5_desc: 'برانياما، تأمل، وساوند هيلينغ.',
      retreat_dahab_cv_inc6_title: 'مجموعة خاصة',
      retreat_dahab_cv_inc6_desc: 'دائرة نسائية آمنة ومتابعة بعد الخلوة.',
      retreat_dahab_cv_cd_days: 'أيام',
      retreat_dahab_cv_cd_hours: 'ساعات',
      retreat_dahab_cv_cd_minutes: 'دقائق',
      retreat_dahab_cv_cd_seconds: 'ثواني',
      retreat_dahab_cv_spots_label: 'الأماكن المتاحة',
      retreat_dahab_cv_spots_count: 'الأماكن محدودة',
      retreat_dahab_cv_urgency_note: 'آخر خلوة نفد الحجز قبل الموعد بشهر.',
      retreat_dahab_cv_final_h2: 'مستعدة تبدئي رحلتك؟',
      retreat_dahab_cv_final_p: 'خمسة أيام بعيداً عن الضجيج، للعودة لجسدك وللبحر. فرصة نادرة تبطّئين فيها، تتنفسين، وتتذكّرين قوتك — بين نساء يفهمنك.',
      retreat_dahab_cv_final_price_label: 'السعر الكامل',
      retreat_dahab_cv_final_price: '3500₪',
      retreat_dahab_cv_final_price_note: 'شامل الإقامة والوجبات والأنشطة',
      retreat_dahab_cv_final_b1: 'العربون يثبّت مقعدك',
      retreat_dahab_cv_final_b2: 'مكالمة هاتفية قبل التأكيد النهائي',
      retreat_dahab_cv_final_b3: 'تواصل مباشر مع نوال عمر',
      retreat_dahab_cv_final_btn: 'احجزي مقعدك الآن',
      retreat_dahab_cv_final_whatsapp: 'أو تواصلي على واتساب',
      retreat_dahab_book: 'حجز',
      retreat_dahab_datetime_label: 'المكان والزمان',
      retreat_dahab_datetime_value: 'May 07, 2026, 10:00 AM – May 12, 2026, 8:00 PM',
      retreat_dahab_location_value: 'Sinai Peninsula, Sinai Peninsula, Taba, South Sinai Governorate 8781001, Egypt',
      retreat_dahab_goal_label: 'الهدف',
      retreat_dahab_goal_headline: 'ريتريت «صوت الجبل»',
      retreat_dahab_goal_text: 'رحلة بين الجبل والبحر تجمع التحدي، الحضور، والهدوء الداخلي.',
      retreat_dahab_goal_image_alt: 'جبال سانت كاثرين',
      retreat_dahab_goal_chip_date: '07.05.2026 - 12.05.2026',
      retreat_dahab_goal_chip_country: 'مصر',
      retreat_dahab_stat_difficulty_value: 'متوسط',
      retreat_dahab_stat_difficulty_label: 'الصعوبة',
      retreat_dahab_stat_distance_value: '18 كم',
      retreat_dahab_stat_distance_label: 'المسافة',
      retreat_dahab_stat_days_value: '6 أيام',
      retreat_dahab_stat_days_label: 'مدة المسار',
      retreat_dahab_stat_peak_value: 'م2641',
      retreat_dahab_stat_peak_label: 'أعلى ارتفاع',
      retreat_dahab_share_label: 'شارك الحدث',
      retreat_dahab_image_alt: 'ريتريت دهب',
      retreat_dahab_itinerary_title: 'تفاصيل المسار يوماً بيوم',
      retreat_dahab_day1_chip: 'اليوم 01',
      retreat_dahab_day1_title: 'الانتقال والوصول إلى سانت كاترين',
      retreat_dahab_day1_meta: 'اليوم 1 (07.05.2026) - الوصول والاستعداد للمسار',
      retreat_dahab_day1_p1: 'نبدأ رحلتنا بالانطلاق ليلًا بتاريخ 06.05 حوالي الساعة 00:00 بواسطة باص باتجاه معبر طابا. بعد عبور الحدود، نتابع الطريق نحو سانت كاترين، حيث تستغرق الرحلة حوالي ساعتين ونصف للوصول إلى المخيم.',
      retreat_dahab_day1_p2: 'من المتوقع أن نصل صباح يوم 07.05 حوالي الساعة 10:00، لنبدأ تجربتنا بهدوء بين جبال سيناء، مع وقت للراحة، التعارف، والاستعداد لبداية المسار.',
      retreat_dahab_day1_p3: 'تبدأ رحلتنا في سيناء بوصول هادئ إلى مدينة سانت كاترين. هذه البلدة الصحراوية الصغيرة، المحاطة بقمم الجرانيت الشاهقة، ستكون بوابتنا لعجائب جبال سيناء الروحية والطبيعية. سنسجّل دخولنا إلى مخيم بدوي محلي للراحة بعد السفر، والاستمتاع بهواء الجبل، ووجبة دافئة. نستخدم اليوم للتعارف مع المرشدين والفريق، تجهيز المعدات، والاستعداد الذهني للمسير الذي يبدأ صباح الغد.',
      retreat_dahab_day2_chip: 'اليوم 02',
      retreat_dahab_day2_title: 'وادي الأربعين ← جبل سانت كاثرين ← دهب',
      retreat_dahab_day2_meta: 'اليوم 2 (08.05.2026) - صعود القمة والانتقال إلى دهب',
      retreat_dahab_day2_p1: 'نغادر المخيم باكرًا ونسير عبر وادي الأربعين باتجاه شق موسى. يقودنا المسار بين جروف جرانيتية شاهقة حتى نصل إلى أم سِلّة، ثم نتابع الصعود نحو قمة جبل سانت كاثرين—أعلى جبل في مصر. من القمة نشاهد بانوراما لا نهائية من الجبال والحواف الحادة والوديان الصحراوية الصامتة. نتناول الغداء على القمة، ثم نبدأ النزول، وبعدها ننطلق في رحلة تستغرق حوالي ساعتين باتجاه دهب، حيث يكون المبيت في مكان الإقامة الخاص بالريتريت.',
      retreat_dahab_day2_stat1: '18 كم',
      retreat_dahab_day2_stat2: 'صعود 1,048م',
      retreat_dahab_day2_stat3: 'نزول 1,061م',
      retreat_dahab_day2_stat4: 'أعلى نقطة 2,641م',
      retreat_dahab_day3_chip: 'اليوم 03',
      retreat_dahab_day3_title: 'ريتريت في دهب',
      retreat_dahab_day3_meta: 'اليوم 3 (09.05.2026) - بداية الريتريت في دهب',
      retreat_dahab_day3_p1: 'نبدأ أول أيام الريتريت في دهب بجلسة متكاملة مع نوال تشمل يوغا صباحية، تأمل، Sound Healing وتقنيات تنفس لتهدئة الجهاز العصبي بعد تجربة الجبل، إعادة الاتصال بالجسد وفتح مساحة للهدوء الداخلي. بعد الجلسة، تقود حنان دائرة مشاركة لفتح التعبير العاطفي وإفساح المجال للصوت الداخلي. من الصباح حتى الظهر يكون البرنامج موجّهًا، وبعده وقت حر للسباحة، المشي في دهب أو الاسترخاء، ثم في المساء جلسة Sound Healing مركّزة على تحرير المشاعر المخزّنة في الجسد مع تخيّل موجّه.',
      retreat_dahab_day4_chip: 'اليوم 04',
      retreat_dahab_day4_title: 'ريتريت في دهب',
      retreat_dahab_day4_meta: 'اليوم 4 (10.05.2026) - يوم البحر والتحرر الداخلي',
      retreat_dahab_day4_p1: 'نبدأ الصباح بجلسة Mindfulness + Yoga تجمع بين التأمل الواعي وحركة يوغا لطيفة، ثم بعد الإفطار نخرج إلى Blue Hole من 10:00 حتى 17:00 للسباحة، الاسترخاء والاستمتاع بالبحر والطبيعة. بعد العودة، تقود نوال تجربة عميقة للمجموعة تحمل عنوان "لعبة القوة وشبح الضعف" لاستخراج القوة الشخصية لكل امرأة، تثبيت مفهوم الحرية والتحرر، وتجهيز "شبح الضعف" لطقس الحرق النهائي، مع ربط الصحراء بمعنى الحرية الداخلية ومواجهة المخاوف واكتشاف القوة الذاتية.',
      retreat_dahab_day5_chip: 'اليوم 05',
      retreat_dahab_day5_title: 'يوم التكامل والختام',
      retreat_dahab_day5_meta: 'اليوم 5 (11.05.2026)',
      retreat_dahab_day5_morning: 'الصباح',
      retreat_dahab_day5_morning_text: 'جلسة مع نوال تشمل:',
      retreat_dahab_day5_b1: 'يوغا صباحية',
      retreat_dahab_day5_b2: 'تخيل موجه (Guided Visualization)',
      retreat_dahab_day5_b3: 'Acro Yoga وهي تجربة تفاعلية ممتعة تساعد على:',
      retreat_dahab_day5_b4: 'بناء الثقة بين المشاركات',
      retreat_dahab_day5_b5: 'تقوية التواصل',
      retreat_dahab_day5_b6: 'إدخال عنصر اللعب والفرح في التجربة',
      retreat_dahab_day5_evening: 'المساء',
      retreat_dahab_day5_p1: 'Ceremony ختامية تقام حول النار في مكان مفتوح.',
      retreat_dahab_day5_p2: 'ترتدي المشاركات اللباس الأبيض كرمز للبداية الجديدة.',
      retreat_dahab_day5_p3: 'تتضمن الجلسة:',
      retreat_dahab_day5_e1: 'طقس حرق "شبح الضعف"',
      retreat_dahab_day5_e2: 'مشاركة التجربة الشخصية لكل مشاركة',
      retreat_dahab_day5_e3: 'تثبيت النوايا الجديدة للحياة بعد الريتريت',
      retreat_dahab_day5_p4: '(يمكن إضافة نشاط أو تجربة خاصة في دهب حسب الفكرة التي ستختارينها لاحقًا).',
      retreat_dahab_day6_chip: 'اليوم 06',
      retreat_dahab_day6_title: 'المغادرة',
      retreat_dahab_day6_meta: 'اليوم 6 (12.05.2026)',
      retreat_dahab_day6_p1: 'في الصباح: فطور هادئ مع المجموعة.',
      retreat_dahab_day6_p2: 'ثم:',
      retreat_dahab_day6_b1: 'جمع الأغراض',
      retreat_dahab_day6_b2: 'لحظة وداع',
      retreat_dahab_day6_b3: 'العودة حسب ترتيبات السفر',
      retreat_dahab_day6_p3: 'نغادر دهب وقد حملنا معنا: هدوء الجبل، قوة الصحراء، وخفة البحر.',
      retreat_dahab_trainers_title: 'المدربات',
      retreat_dahab_trainer1_name: 'نوال عمر',
      retreat_dahab_trainer1_role: 'مدربة يوغا ووعي',
      retreat_dahab_trainer2_name: 'حنان',
      retreat_dahab_trainer2_role: 'قائد مسار الجبل',
      retreat_dahab_gallery_title: 'صور من الرحلة',
      retreat_dahab_gallery_alt1: 'بحر دهب',
      retreat_dahab_gallery_alt2: 'إطلالة من الرحلة',
      retreat_dahab_gallery_alt3: 'لحظة في الطبيعة',
      retreat_dahab_gallery_alt4: 'طاقة المجموعة',
      retreat_dahab_gallery_alt5: 'البحر والجبال',
      retreat_dahab_gallery_alt6: 'غروب هادئ',
      retreat_dahab_gallery_alt7: 'من رحلة دهب',
      retreat_dahab_gallery_alt8: 'من رحلة دهب',
      retreat_dahab_gallery_alt9: 'من رحلة دهب',
      retreat_dahab_gallery_alt10: 'من رحلة دهب',
      retreat_dahab_gallery_alt11: 'من رحلة دهب',
      retreat_dahab_gallery_alt12: 'من رحلة دهب',
      retreat_dahab_gallery_more: 'عرض مزيد من الصور',
      retreat_dahab_gallery_less: 'عرض صور أقل',
      retreat_dahab_soul_kicker: 'هذا مكانكم',
      retreat_dahab_expect_title: 'ماذا أتوقع من خلوة دهب؟',
      retreat_dahab_soul_not_tourism: 'هاي الخلوة مش رحلة سياحية عادية.',
      retreat_dahab_soul_invite: 'هي مساحة آمنة للمرأة إنها تبطّئ شوي، تبعد عن ضغط الحياة اليومية، وترجع تسمع حالها من جديد.',
      retreat_dahab_expect_lead: 'خلال الخمسة أيام رح نشتغل على:',
      retreat_dahab_expect_1: 'تهدئة الجهاز العصبي والتخفيف من التوتر والضغط.',
      retreat_dahab_expect_2: 'العودة للجسد من خلال اليوغا والتنفس والحركة الواعية.',
      retreat_dahab_expect_3: 'بناء علاقات حقيقية مع نساء يشبهنك بالقيم والوعي.',
      retreat_dahab_expect_4: 'استعادة الطاقة والحيوية بعيداً عن ضجيج الحياة اليومية.',
      retreat_dahab_expect_5: 'اكتشاف مساحات جديدة من القوة والثقة الداخلية.',
      retreat_dahab_expect_6: 'خلق ذكريات وتجارب تبقى معك لفترة طويلة بعد انتهاء الخلوة.',
      retreat_dahab_why_dahab_title: 'لماذا دهب؟',
      retreat_dahab_why_dahab_lead: 'لأن دهب مختلفة.',
      retreat_dahab_why_dahab_p1: 'فيها شيء صعب يوصف بالكلمات.',
      retreat_dahab_why_dahab_p2: 'البحر، الجبال، البساطة، الناس، والطاقة الهادئة الموجودة فيها، كلها بتخلق بيئة مثالية للشفاء، التأمل، وإعادة الشحن.',
      retreat_dahab_why_dahab_p3: 'مش صدفة إنه آلاف الأشخاص حول العالم بيختاروا دهب كل سنة كوجهة للعودة لأنفسهم.',
      retreat_dahab_why_this_title: 'لماذا هذه الخلوة بالذات؟',
      retreat_dahab_why_this_lead: 'لأنها مبنية بعناية كبيرة.',
      retreat_dahab_why_this_p1: 'مش مجرد يوغا أو نشاطات منفصلة.',
      retreat_dahab_journey_earth: 'الأرض والثبات',
      retreat_dahab_journey_water: 'الماء والانسياب',
      retreat_dahab_journey_presence: 'الحضور الكامل مع النفس',
      retreat_dahab_why_this_p2: 'كل يوم بالبرنامج مرتبط باليوم اللي قبله، وكأنه رحلة متكاملة. كل فعالية، كل ورشة، وكل مساحة مشاركة تم اختيارها بهدف خلق تجربة حقيقية وآمنة ومؤثرة.',
      retreat_dahab_spots_title: 'عدد الأماكن محدود',
      retreat_dahab_spots_count: '20 امرأة فقط',
      retreat_dahab_spots_text: 'حرصاً على الخصوصية وجودة التجربة، عدد المشاركات محدود لـ 20 امرأة فقط.',
      retreat_dahab_spots_note: 'أنا أؤمن أن المجموعات الصغيرة تسمح بعمق أكبر، مساحات مشاركة أكثر أماناً، واهتمام شخصي بكل مشاركة.',
      retreat_dahab_booking_title: 'كيف يتم تثبيت الحجز؟',
      retreat_dahab_booking_p1: 'بعد تعبئة نموذج التسجيل سيتم التواصل هاتفياً مع كل مشاركة للتعارف والإجابة على جميع الأسئلة والتأكد أن الخلوة مناسبة لها.',
      retreat_dahab_booking_p2: 'يتم تثبيت الحجز فقط بعد المكالمة الهاتفية وتحويل العربون.',
      retreat_dahab_for_title: 'لمن هذه الخلوة؟',
      retreat_dahab_for_1: 'للمرأة التي تشعر أنها بحاجة لاستراحة حقيقية.',
      retreat_dahab_for_2: 'للمرأة التي تريد تجربة جديدة خارج منطقة الراحة.',
      retreat_dahab_for_3: 'للمرأة التي تبحث عن التوازن بين الجسد والعقل والمشاعر.',
      retreat_dahab_for_4: 'للمرأة التي ترغب بالتعرف على نساء ملهمات ومجتمع داعم.',
      retreat_dahab_for_5: 'للمرأة التي تريد أن تمنح نفسها وقتاً تستحقه.',
      retreat_dahab_not_for_title: 'لمن هذه الخلوة غير مناسبة؟',
      retreat_dahab_not_for_1: 'لمن تبحث عن رحلة سياحية مليئة بالفعاليات السريعة فقط.',
      retreat_dahab_not_for_2: 'لمن لا ترغب بالمشاركة ضمن مجموعة نسائية.',
      retreat_dahab_not_for_3: 'لمن تعاني من حالة صحية تمنع ممارسة النشاطات البدنية دون استشارة طبيبها.',
      retreat_dahab_not_for_4: 'لمن تبحث عن نتائج أو تغييرات فورية وسحرية خلال عدة أيام.',
      retreat_dahab_faq_title: 'أسئلة متكررة',
      retreat_dahab_faq_q1: 'هل أستطيع المشاركة إذا كنت قادمة لوحدي؟',
      retreat_dahab_faq_a1: 'طبعاً. في الواقع أغلب المشاركات في الخلوات السابقة انضممن لوحدهن. ومن أجمل الأشياء التي تحدث في الريتريت أن النساء يبدأن الرحلة كغريبات ويغادرن كصديقات.',
      retreat_dahab_faq_q2: 'هل أحتاج خبرة سابقة باليوغا؟',
      retreat_dahab_faq_a2: 'أبداً. جميع الحصص مناسبة للمبتدئات والمتقدمات مع إعطاء تعديلات تناسب كل مستوى.',
      retreat_dahab_faq_q3: 'هل أستطيع مشاركة الغرفة مع صديقة؟',
      retreat_dahab_faq_a3: 'نعم، ويمكن تنسيق ذلك مسبقاً عند التسجيل.',
      retreat_dahab_faq_q4: 'ماذا أحضر معي؟',
      retreat_dahab_faq_a4: 'سيتم إرسال قائمة كاملة بجميع التفاصيل والمستلزمات لكل مشاركة قبل موعد الخلوة.',
      retreat_dahab_cancel_title: 'الدفع وسياسة الإلغاء',
      retreat_dahab_payment_deposit: 'تثبيت الحجز: 400 شيكل غير مستردة.',
      retreat_dahab_payment_balance: 'المبلغ المتبقي يُدفع حتى موعد أقصاه 10.8.',
      retreat_dahab_cancel_subtitle: 'سياسة الإلغاء',
      retreat_dahab_cancel_1: 'العربون غير قابل للاسترجاع بعد تثبيت الحجز.',
      retreat_dahab_cancel_2: 'في حال الإلغاء حتى 30 يوماً قبل موعد الخلوة يمكن تحويل المبلغ المدفوع لخلوة أو فعالية مستقبلية.',
      retreat_dahab_cancel_3: 'في حال الإلغاء قبل أقل من 30 يوماً لا يمكن استرجاع المبلغ بسبب الالتزامات المسبقة مع الفندق ومزودي الخدمات.',
      retreat_dahab_cancel_4: 'في حال إيجاد مشاركة بديلة يمكن نقل الحجز إليها بعد التنسيق المسبق.',
      retreat_dahab_cancel_note: 'نرجو التسجيل فقط عند التأكد من القدرة على الالتزام بالمشاركة.',
      retreat_dahab26_title: 'خلوة دهب 2026',
      retreat_dahab26_with: 'مع نوال عمر',
      retreat_dahab26_quote: '"أحيانًا كل ما نحتاجه هو أن نبتعد قليلًا... لنعود إلى أنفسنا."',
      retreat_dahab26_story_1: 'أنا نوال عمر، ممرضة مختصة بصحة المرأة، معلمة يوغا، وابنة للمجتمع الفلسطيني في الداخل، أحمل رسالة بدأت قبل سنوات طويلة من أي خلوة أو مشروع أو رحلة.',
      retreat_dahab26_story_2: 'منذ بداياتي في عالم التمريض، كان هدفي أن أساهم في رفع الوعي الصحي داخل المجتمع العربي، وأن أكون جزءًا من التغيير الحقيقي الذي تستحقه النساء والعائلات من حولي. كنت أؤمن أن المعرفة قوة، وأن كل امرأة تستحق أن تحصل على الدعم، الوعي، والأدوات التي تساعدها تعيش حياة صحية ومتوازنة أكثر.',
      retreat_dahab26_story_3: 'لاحقًا وجدت في اليوغا لغة إضافية للعطاء. لغة تتجاوز الكلمات، وتساعد النساء على العودة لأجسادهن، لنفسهن، ولصوتهن الداخلي. ومن هنا بدأت رحلتي في بناء مساحات آمنة تجمع بين الحركة، الوعي، والصحة الجسدية والنفسية.',
      retreat_dahab26_story_4: 'مرت حياتي بتجارب صعبة ومؤلمة، وكان من أصعبها فقدان والدي، الإنسان الذي علّمني معنى العطاء والمسؤولية والانتماء. لكن هذه التجارب لم تغيّر رسالتي، بل عمّقتها أكثر، وجعلتني أؤمن أن الألم يمكن أن يتحول إلى قوة، وأن الإنسان يستطيع أن يصنع من أصعب محطاته سببًا ليخدم الآخرين بشكل أصدق وأعمق.',
      retreat_dahab26_story_5: 'خلال السنوات الأخيرة رافقت أكثر من 2000 امرأة من مختلف أنحاء البلاد من خلال ورشات، محاضرات، برامج وخلوات نسائية، وهذه الخلوة هي الريتريت السابع الذي أقوده خارج البلاد.',
      retreat_dahab26_story_6: 'أؤمن أن نجاح امرأة لا ينتقص من نجاح أخرى، وأن أقوى المجتمعات هي التي تُبنى على التعاون لا المنافسة. لذلك أحرص دائمًا على بناء شراكات مع نساء ملهمات ومهنيات، لأنني أؤمن أن القوة النسائية الحقيقية تظهر عندما نمسك بأيدي بعض ونمشي سويًا.',
      retreat_dahab26_story_7: 'يشرفني أن أشارككن هذه الرحلة، وأتمنى أن تكون أكثر من مجرد سفر أو إجازة، بل مساحة نعود فيها لأنفسنا، ونكتشف فيها كم من القوة، النور، والحياة ما زال يسكن داخلنا.',
      retreat_dahab26_yoga_alt: 'لحظة يوغا',
      retreat_dahab26_yoga_caption: 'لحظة يوغا',
      retreat_dahab26_guide_kicker: 'دليل خلوة دهب 2026',
      retreat_dahab26_guide_subtitle: 'مع نوال عمر | رحلة للراحة، التحرر، والعودة للجسد',
      retreat_dahab26_name: 'خلوة دهب النسائية',
      retreat_dahab26_dates: '19.8 – 23.8',
      retreat_dahab26_tagline: 'رحلة للعودة للجسد، للبحر، وللقوة اللي جوانا',
      retreat_dahab26_place: 'في واحدة من أجمل بقاع سيناء، بين الجبال والبحر والطاقة الهادية، بنلتقي بخلوة نسائية عميقة في دهب، داخل واحد من أفخم وأجمل فنادق دهب: Nour Boutique Hotel — أوتيل على البحر، بروح هادئة ومناسب جداً للخلوات، التأمل، اليوغا، والعودة للنفس.',
      retreat_dahab26_hotel_link: 'nourboutiquehotel.com ↗',
      retreat_dahab26_arc: 'الريتريت مبني كرحلة كاملة: من الأرض… للماء… للجسد… للحواس… وللقلب.',
      retreat_dahab26_d1_chip: 'اليوم الأول · 19.8',
      retreat_dahab26_d1_title: 'الوصول والافتتاح',
      retreat_dahab26_d1_s1: '10:00 صباحاً — الوصول إلى دهب. استراحة، استلام الغرف، وقت هادئ للتنفس والتأقلم مع المكان.',
      retreat_dahab26_d1_s2: '15:00 — Opening Ceremony. افتتاح خلوة دهب، وضع نية الرحلة، كسر جليد، تعارف بين النساء، ومساحة آمنة نبدأ فيها مع بعض.',
      retreat_dahab26_d1_s3: '19:00 — عشاء. بعد العشاء: سهرة جبلية خفيفة، هدوء، تعارف، واندماج مع أجواء دهب.',
      retreat_dahab26_d2_chip: 'اليوم الثاني · 20.8',
      retreat_dahab26_d2_title: 'عنصر الأرض | الثبات والجذور',
      retreat_dahab26_d2_s1: '07:30 — يوغا صباحية. تأمل، تقنيات تنفس، وحصة يوغا بتركيز على عنصر الأرض: الثبات، الأمان، الجذور، والعودة للجسد.',
      retreat_dahab26_d2_s2: '09:00 — فطور.',
      retreat_dahab26_d2_s3: '10:00 — رحلة إلى Blue Hole – Abu Galum – Blue Lagoon. يوم طبيعي ساحر بين البحر والجبال. منطقة الـ Blue Hole تعتبر من أشهر وأجمل مناطق دهب، معروفة بمياهها الزرقاء العميقة، الشعاب المرجانية، والطاقة الطبيعية النادرة. بعدها أبو جالوم والـ Blue Lagoon، واحدة من أكثر المناطق هدوءاً وجمالاً في سيناء، مكان مثالي للانفصال عن الضجيج والرجوع للبساطة.',
      retreat_dahab26_d2_s4: 'في Blue Lagoon رح نشتغل مع بطاقات القوة: كل امرأة تختار بطاقة، رسالة، ونية تحملها معها لباقي الرحلة.',
      retreat_dahab26_d2_s5: '19:00 — عشاء. وقت حر للمشي، الراحة، أو الجلوس مع البحر.',
      retreat_dahab26_d3_chip: 'اليوم الثالث · 21.8',
      retreat_dahab26_d3_title: 'عنصر الماء | التحرر والانسياب',
      retreat_dahab26_d3_s1: '07:30 — يوغا صباحية. تقنيات تنفس ويوغا بتركيز على عنصر الماء: الانسياب، المرونة، المشاعر، والتحرر من التوتر.',
      retreat_dahab26_d3_s2: '09:00 — فطور.',
      retreat_dahab26_d3_s3: '10:00 – 17:00 — اليوم الأهم والأجمل في الريتريت. يوم خاص جداً للجسد والجهاز العصبي: حمام ثلج + ساونا + وجبة غداء.',
      retreat_dahab26_d3_s4: 'حمام الثلج مش بس تجربة قوية، هو تمرين عميق على التنفس، الحضور، وتنظيم الجهاز العصبي. بيساعد الجسم يطلع من التوتر، يقوي القدرة على التحمل، ينشط الدورة الدموية، ويعطي إحساس عالي بالصفاء والقوة الداخلية. مع السونا، الجسم يدخل رحلة بين الحرارة والبرودة، بين الانقباض والاسترخاء، وبين التحدي والراحة.',
      retreat_dahab26_d3_s5: 'هاد اليوم رح يكون من أقوى لحظات الخلوة — يوم بنحس فيه قديش الجسم ذكي، قوي، وقادر.',
      retreat_dahab26_d3_s6: '19:00 — عشاء. وقت حر وراحة.',
      retreat_dahab26_d4_chip: 'اليوم الرابع · 22.8',
      retreat_dahab26_d4_title: 'الحواس | الحضور والاتصال',
      retreat_dahab26_d4_s1: '07:30 — يوغا صباحية. تأمل وعمل عميق على الحواس: كيف نسمع، نشعر، نلمس، نتنفس، ونرجع للحظة الحالية.',
      retreat_dahab26_d4_s2: '09:00 — فطور.',
      retreat_dahab26_d4_s3: '17:30 — Sound Healing + Acro Yoga. جلسة علاج صوتي عميقة لتهدئة الجهاز العصبي، بعدها Acro Yoga لتقوية الثقة، اللعب، التواصل، والدعم بين النساء.',
      retreat_dahab26_d4_s4: '20:00 — Closing Circle. إغلاق حلقة الريتريت: مشاركة، امتنان، نوايا العودة، وطقس وداع ناعم للرحلة.',
      retreat_dahab26_d5_chip: 'اليوم الخامس · 23.8',
      retreat_dahab26_d5_title: 'المغادرة',
      retreat_dahab26_d5_s1: 'فطور، ترتيب الأغراض، وداع دهب والعودة بطاقة جديدة.',
      retreat_dahab26_includes_title: 'المشمول بالبرنامج',
      retreat_dahab26_inc1: 'الإقامة في Nour Boutique Hotel',
      retreat_dahab26_inc2: 'فطور وعشاء يومياً',
      retreat_dahab26_inc3: 'جميع ورشات اليوغا والتأمل والتنفس',
      retreat_dahab26_inc4: 'Sound Healing',
      retreat_dahab26_inc5: 'Acro Yoga',
      retreat_dahab26_inc6: 'رحلة Blue Hole – Abu Galum – Blue Lagoon',
      retreat_dahab26_inc7: 'الدخول للمحميات الطبيعية',
      retreat_dahab26_inc8: 'حمام الثلج والسونا',
      retreat_dahab26_inc9: 'المواصلات من وإلى إيلات ودهب ذهاباً وإياباً',
      retreat_dahab26_price_title: 'التكلفة',
      retreat_dahab26_price_early: 'أول 5 مشاركات: 3300 شيكل — اكتمل',
      retreat_dahab26_price_regular: 'المشاركات التالية: 3500 شيكل',
      retreat_dahab26_price_note: 'التكلفة شاملة المواصلات، الإقامة، الفطور والعشاء، الورشات، والدخول للمحميات.',
      retreat_dahab26_closing: 'دهب مش بس سفر… دهب مساحة نرجع فيها لنفسنا.',
      retreat_dahab_final_title: '✨ ماذا تشمل خلوة دهب؟ ✨',
      retreat_dahab_final_intro: '5 أيام و4 ليالٍ في واحد من أجمل فنادق دهب.',
      retreat_dahab_final_lead: 'الخلوة تشمل:',
      retreat_dahab_final_inc1: 'إقامة في Nour Boutique Hotel.',
      retreat_dahab_final_inc2: 'فطور وعشاء يومياً.',
      retreat_dahab_final_inc3: 'يوغا صباحية يومية أمام البحر.',
      retreat_dahab_final_inc4: 'تقنيات تنفس وتأملات موجهة.',
      retreat_dahab_final_inc5: 'رحلة إلى Blue Hole - Abu Galum - Blue Lagoon.',
      retreat_dahab_final_inc6: 'بطاقات القوة وتمارين انعكاس وكتابة.',
      retreat_dahab_final_inc7: 'Sound Healing.',
      retreat_dahab_final_inc8: 'Acro Yoga.',
      retreat_dahab_final_inc9: 'جلسات مشاركة ودائرة نسائية آمنة.',
      retreat_dahab_final_inc10: 'الدخول للمحميات الطبيعية.',
      retreat_dahab_final_inc11: 'المواصلات ذهاباً وإياباً من إيلات إلى دهب.',
      retreat_dahab_final_highlight_title: '⭐️ أما التجربة الأبرز في الريتريت فهي يوم الـ Ice Bath & Sauna ⭐️',
      retreat_dahab_final_highlight_lead: 'يوم كامل مخصص للجسد والجهاز العصبي يشمل:',
      retreat_dahab_final_ice: '❄️ حمام ثلج',
      retreat_dahab_final_sauna: '🔥 سونا',
      retreat_dahab_final_lunch: '🥗 وجبة غداء',
      retreat_dahab_final_ice_p1: 'حمام الثلج ليس مجرد تحدٍ جسدي، بل تجربة عميقة لتعلّم التحكم بالتنفس أثناء التوتر، تهدئة الجهاز العصبي، بناء القوة الداخلية، وزيادة الثقة بالنفس.',
      retreat_dahab_final_ice_p2: 'كثير من النساء يكتشفن خلال هذه التجربة أنهن أقوى بكثير مما كن يعتقدن.',
      retreat_dahab_final_ice_p3: 'بين حرارة السونا وبرودة الماء، يعيش الجسم تجربة فريدة تساعد على تنشيط الدورة الدموية، رفع مستويات الطاقة، والشعور بصفاء ذهني عميق.',
      retreat_dahab_final_ice_p4: 'هذا اليوم بالنسبة لي هو قلب الريتريت وأحد أكثر الأيام تأثيراً وتحولاً في التجربة كلها. 🤍',
      retreat_dahab_includes_kicker: 'ريتريت دهب',
      retreat_dahab_includes_title: 'ماذا تشمل الرحلة؟',
      retreat_dahab_includes_yes_title: 'تشمل الرحلة',
      retreat_dahab_includes_no_title: 'لا تشمل الرحلة',
      retreat_dahab_inc1: 'باص من وإلى معبر الحدود المصرية',
      retreat_dahab_inc2: 'إرشاد احترافي: دليل محلي معتمد',
      retreat_dahab_inc3: 'قائدة/مدرّبة يوغا للريتريت',
      retreat_dahab_inc4: 'وجبات يومية حسب البرنامج: فطور + غداء + عشاء',
      retreat_dahab_inc5: 'انتقال من طابا إلى دهب',
      retreat_dahab_inc6: 'انتقالات داخل دهب',
      retreat_dahab_inc7: 'استئجار مساحة اليوغا (Yoga Space)',
      retreat_dahab_exc1: 'تأمين السفر',
      retreat_dahab_exc2: 'المشروبات والمشتريات الشخصية',
      retreat_dahab_exc3: 'تأشيرة الدخول إلى مصر',
      retreat_dahab_price_label: 'التكلفة',
      retreat_dahab_price_value: '3800 شاقل',
      retreat_dahab_price_note: 'يتم تثبيت الحجز بدفعة أولى غير مستردة بقيمة 500 شيكل.',
      retreat_dahab_book_now: 'احجزي الآن',
      retreat_dahab_policy_title: '💳 طريقة الدفع',
      retreat_dahab_policy_1: 'يتم تثبيت الحجز بدفعة أولى غير مستردة بقيمة 500 شيكل.',
      retreat_dahab_policy_2: 'المبلغ المتبقي يُدفع حتى موعد أقصاه 20.4.',
      retreat_dahab_policy_3: 'طرق الدفع المتاحة:',
      retreat_dahab_policy_4: '✔️ העברה בנקאית (تحويل بنكي)',
      retreat_dahab_policy_5: '✔️ Bit',
      retreat_dahab_policy_6: 'بعد إرسال الدفعة، يرجى إرسال صورة عن التحويل لتأكيد الحجز رسميًا.',
      retreat_dahab_policy_7: 'يتم حجز المقعد فقط بعد تحويل الدفعة الأولى.',
      retreat_dahab_policy_8: 'عدد الأماكن محدود، والأولوية لمن تثبّت حجزها أولًا.',
      retreat_dahab_policy_9: '⚖️ سياسة الإلغاء',
      retreat_dahab_policy_10: '• في حال الإلغاء قبل 14 يوم من موعد الريتريت – لا يتم استرجاع أي مبلغ.',
      retreat_dahab_policy_11: '• في حال عدم الحضور لأي سبب – لا يوجد استرجاع.',
      retreat_dahab_policy_12: '• يمكن تحويل الحجز لمشاركة أخرى في حال إيجاد بديلة بنفسك.',
      retreat_dahab_policy_13: '• تثبيت الحجز يتم بدفعة أولى غير مستردة.',
      dahab_book_form_title: 'حجز ريتريت دهب',
      dahab_book_name: 'الاسم الكامل',
      dahab_book_phone: 'رقم الهاتف (يفضل واتساب)',
      dahab_book_confirm: 'تأكيد الحجز',

      audio_question: 'هل ترغبين بتشغيل الصوت للفيديوهات على هذا الجهاز؟',
      audio_later: 'لاحقاً',
      audio_enable: 'تشغيل الصوت',

      retreat_page_label: 'ريتريت زنجبار مع نوال عمر',
      retreat_page_title: '8 أيام | 7 ليالٍ',
      retreat_page_intro: `7/7/2026 - 14/7/2026
ريتريت يوغا وساوند هيلينغ مع اكتشاف جزيرة زنجبار`,
      retreat_from: 'رحلة مصممة للنساء اللواتي يحتجن إلى التوقف',
      retreat_bio1: 'رحلة مصممة للنساء اللواتي يحتجن إلى التوقف، التنفس، العودة إلى الجسد، واستعادة التوازن الداخلي وسط جمال زنجبار الساحر.',
      retreat_bio2: 'هذا الريتريت ليس مجرد عطلة، بل مساحة حقيقية للراحة، التحوّل، الهدوء، والاتصال العميق بالنفس من خلال اليوغا، التنفس، الساوند هيلينغ، والطبيعة.',
      retreat_heading_why: 'لماذا هذا الريتريت مختلف؟',
      retreat_heading_included: 'ماذا تشمل الباقة؟',
      retreat_heading_experience: 'ماذا ستختبرين؟',
      retreat_heading_daily_journey: 'الرحلة اليومية',
      retreat_heading_accommodation: 'الإقامة والطعام',
      retreat_heading_booking_policy: 'سياسة تثبيت الحجز والإلغاء',
      retreat_heading_for_whom: 'لمن يناسب هذا الريتريت؟',
      retreat_heading_closing: 'رسالة ختامية',
      retreat_scroll_down: 'مرر للأسفل',
      retreat_cta_title: 'جاهزة للبدء في رحلتك؟',
      retreat_cta_subtitle: 'خطوة نحو هدوء عميق وممارسة حضور والعودة إلى ذاتك في زنجبار.',
      retreat_cta_button: 'احجزي مكانك',
      retreat_whatsapp_button: 'واتساب',
      retreat_form_name_label: 'الاسم',
      retreat_form_phone_label: 'رقم الهاتف',
      retreat_form_notes_label: 'ملاحظات',
      retreat_form_submit: 'إرسال',
      retreat_form_success: 'شكرًا لك! تم إرسال طلبك بنجاح، وسنتواصل معك بأقرب وقت.',
      retreat_form_error: 'تعذر إرسال الطلب، حاولي مرة أخرى.',
      retreat_share_title: 'لماذا هذا الريتريت مختلف؟',
      retreat_share1: `لماذا هذا الريتريت مختلف؟
برنامج متوازن بين الحركة والراحة والأنشطة البحرية والطبيعة.
فندق واحد مميز في زنجبار تم اختياره لأجواء هادئة ومناسبة للريتريت.
وجبتا فطور وعشاء يوميًا لتخفيف العبء اللوجستي عن المشاركات.
جلستا Sound Healing مع مختصة تأتي بالمعدات إلى الفندق.
مزيج بين التجربة السياحية والمسار الداخلي العميق بقيادة نوال.
إمكانية الانضمام بحسب حاجة كل مشاركة.

ماذا تشمل الباقة؟
• تذكرة طيران مباشر ذهابًا وإيابًا مع Arkia
• حقيبة حتى 20 كغم
• حقيبة يد
• جميع التنقلات الأرضية داخل زنجبار
• 7 ليالٍ في إقامة مختارة بعناية في فندق واحد مميز في زنجبار
• وجبات:
  o فطور يومي
  o عشاء يومي
• جلستان Sound Healing مع مختصة تصل مع معداتها إلى الفندق
• زيارة Salaam Cave
• رحلة Safari Blue
• زيارة Jozani Forest
• زيارة مزرعة التوابل
• رحلة Mnemba snorkeling
• زيارة Prison Island
• جولة في Stone Town

تفاصيل الإقامة المختارة
• 7 ليالٍ في إقامة مختارة بعناية في فندق واحد مميز في زنجبار، يجمع بين الراحة، الطبيعة، والأجواء الهادئة المناسبة لتجربة الريتريت.
• سيتم مشاركة تفاصيل الفندق النهائية بعد تأكيد الحجز.

سياسة تثبيت الحجز والإلغاء
• في حال الإلغاء قبل شهر من موعد الريتريت، لا يتم استرجاع أي مبلغ.
• في حال عدم الحضور لأي سبب، لا يوجد استرجاع.
• يمكن تحويل الحجز لمشاركة أخرى في حال إيجاد بديلة بنفسك.
• تثبيت الحجز يتم بدفعة أولى غير مستردة.`,
      retreat_share2: `البرنامج اليومي النهائي
تمت إعادة ترتيب الأيام وفق الملاحظات التنظيمية حتى يكون تسلسل الرحلة أكثر راحة ومنطقيًا من ناحية الانتقالات، الكلفة، والطاقة العامة للمجموعة.

الثلاثاء 7/7/2026 - الوصول إلى زنجبار
بعد اللقاء مع نوال في مطار بن غوريون، تنطلق المجموعة على رحلة مباشرة مع Arkia إلى زنجبار. عند الوصول، ستكون هناك حافلة مريحة بانتظار المجموعة للانتقال إلى الفندق في جنوب الجزيرة.
الوقت / الفقرة	التفاصيل
الوصول والانتقال	انتقال من المطار إلى الفندق في الجنوب.
العشاء	عشاء خفيف يتم تنسيقه مسبقًا مع الفندق لتجنّب انتظار طويل بعد السفر.
لقاء أولي	لقاء تعارف قصير جدًا مع المجموعة ثم راحة ونوم.
✨ قيمة هذا اليوم
الهدف من هذا اليوم هو الاستقرار بعد السفر، تخفيف الإجهاد، والدخول التدريجي إلى أجواء الريتريت بدون ضغط.
روابط مفيدة مرتبطة بهذا اليوم: تفاصيل الإقامة تُشارك بعد تأكيد الحجز

الأربعاء 8/7/2026 - العودة إلى الجذر
يبدأ اليوم بجلسة يوغا شروق على الشاطئ وسيرموني افتتاحي لنية الرحلة، ثم فطور جماعي، وبعده زيارة Salaam Cave. وبدل جعل الغداء داخل The Rock كخيار أساسي بسبب ارتفاع الأسعار، تم اعتماد توقف تصويري حر بالقرب من المطعم ثم غداء حر في مكان أنسب سعريًا في المنطقة.
الوقت / الفقرة	التفاصيل
07:00	يوغا الشروق + براناياما + تأمل على صوت البحر.
08:30	فطور جماعي في الفندق.
11:00	زيارة Salaam Cave وتجربة تنفّس عميق داخل الكهف.
14:00	توقف تصويري قرب The Rock ثم غداء حر في مطعم أنسب سعريًا.
19:30	عشاء في الفندق.
20:30	جلسة مشاركة قصيرة عن اليوم.
✨ قيمة هذا اليوم
هذا اليوم مهم لكسر الجليد بين المشاركات، خلق شعور الأمان، وتحديد نية شخصية لكل مشاركة حول ما تريد تحريره أو استقباله في حياتها.
روابط مفيدة مرتبطة بهذا اليوم: Salaam Cave

الخميس 9/7/2026 - يوم البحر - Safari Blue
يوم بحري كامل يدمج بين المتعة والحضور. بعد تمرين صباحي خفيف وفطور، تنتقل المجموعة إلى نقطة انطلاق القارب الخاص لرحلة Safari Blue.
الوقت / الفقرة	التفاصيل
07:30	تنفس قصير + يوغا صباحية خفيفة لإيقاظ الحواس.
08:15	فطور.
09:00	الانطلاق إلى موقع القارب.
10:00 - 17:00	رحلة Safari Blue: قارب تقليدي، سنوركلينغ، جزيرة رملية، ووجبة غداء بحرية على الجزيرة.
خلال الرحلة	تأمل على الماء وتركيز على صوت البحر والتنفس والاتساع الداخلي.
20:00	عشاء في الفندق + مشاركة مسائية قصيرة.
✨ قيمة هذا اليوم
القيمة هنا هي تحرير التوتر من الجسد، توسيع الإحساس الداخلي، والسماح للبحر أن يعيد للمشاركات الإيقاع الهادئ والمرن.
روابط مفيدة مرتبطة بهذا اليوم: Safari Blue

الجمعة 10/7/2026 - يوم الطبيعة والثقافة
يوم للطبيعة والثقافة بإيقاع هادئ، مع العودة إلى الفندق نفسه للراحة والمساء.
الوقت / الفقرة	التفاصيل
07:00	يوغا صباحية خفيفة
08:00	فطور
09:30	زيارة غابة Jozani ومشي تأملي وسط الطبيعة ومشاهدة قرود الـ Red Colobus
12:00	زيارة مزرعة التوابل والتعرّف على القرفة، الفانيلا، القرنفل وجوزة الطيب وتأثير الروائح على الجهاز العصبي
بعد الظهر	عودة إلى الفندق ووقت راحة / استرخاء
18:30	يوغا ناعمة عند الغروب
19:30	جلسة Sound Healing أولى
✨ قيمة هذا اليوم
جسر بين الطبيعة والحواس والراحة في مكان الإقامة، مع مساحة للجسد قبل يوغا الغروب وجلسة الصوت.
روابط مفيدة مرتبطة بهذا اليوم: Jozani Forest - Spice Farm

السبت 11/7/2026 - يوم الهدوء والاندماج في Kiwengwa
بعد أربعة أيام مليئة بالتنقل والماء والطبيعة، يأتي هذا اليوم كمساحة أهدأ للاندماج، الهضم، والاستمتاع بجمال المكان الجديد دون عجلة.
الوقت / الفقرة	التفاصيل
07:30	فطور مريح.
صباحًا	وقت حر للبحر/الاسترخاء/السبا بحسب رغبة المشاركة.
17:30	جلسة Acro Yoga تعتمد على الثقة والعمل الجماعي.
18:30	جلسة Sound Healing ثانية.
19:30	عشاء.
20:30	جلسة كتابة تأملية: ما الذي تغيّر داخلي منذ بداية الرحلة؟
✨ قيمة هذا اليوم
هذا اليوم يخلق مساحة لدمج كل ما مرّ سابقًا، ويمنح الجسد فرصة لالتقاط الأنفاس قبل دخول المرحلة الأخيرة من الرحلة.
روابط مفيدة مرتبطة بهذا اليوم: تفاصيل الإقامة تُشارك بعد تأكيد الحجز

الأحد 12/7/2026 - Mnemba Island + خيار ركوب الخيل
يوم بحري جديد في أحد أجمل مواقع السنوركلينغ في زنجبار.
الوقت / الفقرة	التفاصيل
07:00	يوغا صباحية + تنفس.
08:15	فطور.
09:00	التحرك للفعالية.
10:00-14:00	رحلة Mnemba: سنوركلينغ، مشاهدة الشعاب المرجانية، وإمكانية رؤية الدلافين بحسب الظروف البحرية.
مساءً	لعبة/ورشة: القوة وشبح الضعف، مع كتابة ما ترغب كل مشاركة بالتخلي عنه استعدادًا لطقس الختام.
✨ قيمة هذا اليوم
القيمة الأساسية لهذا اليوم هي استعادة الإحساس بالطفولة، الانفتاح العاطفي، والتواصل مع الجمال الطبيعي من مكان حي ومفعم باللون والحركة.
روابط مفيدة مرتبطة بهذا اليوم: Mnemba Island

الاثنين 13/7/2026 - اليوم الختامي الداخلي
تم تخفيف هذا اليوم ليكون أكثر اتزانًا وأقل ازدحامًا، مع تركيز أكبر على الإغلاق الداخلي بدل الحشو اللوجستي.
الوقت / الفقرة	التفاصيل
07:00	جلسة يوغا أخيرة تشمل كتابة تحريرية، تأمل عميق، وتخيلًا موجّهًا.
بعد الفطور	وقت حر للبحر أو الراحة أو المساج/السبا.
قبل الغروب	تحضير شخصي للسيرموني الختامي - لباس أبيض.
من الغروب حتى الليل	Ceremony الختام: دائرة مشتركة، نوايا جديدة، وحرق أوراق "شبح الضعف" تحت السماء المفتوحة.
✨ قيمة هذا اليوم
ننهي الليلة كما بدأنا الرحلة: بنية واضحة، قلب مفتوح، وإحساس داخلي بأن شيئًا تحرّر فعلًا.
روابط مفيدة مرتبطة بهذا اليوم: تفاصيل الإقامة تُشارك بعد تأكيد الحجز

الثلاثاء 14/7/2026 - ستون تاون والعودة إلى إسرائيل
تم اعتماد اليوم الأخير ليجمع بين وقت صباحي هادئ، ثم زيارة Prison Island وجولة في Stone Town قبل العودة إلى المطار.
الوقت / الفقرة	التفاصيل
صباحًا	وقت حر حتى الظهر للسباحة أو الاسترخاء أو التقاط صور أخيرة.
12:00	تسجيل خروج والتحرك باتجاه Stone Town.
13:30	رحلة إلى Prison Island لمشاهدة السلاحف العملاقة وزيارة الجزيرة التاريخية.
15:45	وقت حر للغداء في مركز Stone Town.
17:00	جولة في Stone Town: الأزقة القديمة، الفن المحلي، الأسواق، والهدايا.
19:00	التحرك إلى المطار.
21:25	العودة إلى إسرائيل.
✨ قيمة هذا اليوم
بهذا الترتيب تحصل المشاركات على ختام جميل وعملي في الوقت نفسه، دون ضغط زائد في الليلة السابقة.
روابط مفيدة مرتبطة بهذا اليوم: Prison Island - Stone Town`,
      retreat_share3: `لمن يناسب هذا الريتريت؟
• لمن تريد أن تسافر بطريقة تحمل معنى، وليس فقط كرحلة سياحية.
• لمن تشعر أنها بحاجة لمساحة آمنة تستعيد فيها جسدها، أنفاسها، وهدوءها الداخلي.
• لمن تبحث عن تجربة تجمع بين البحر، الحركة، الأنوثة، الراحة، والمجموعة الداعمة.
• لمن تحب أن تعيش زنجبار من باب الجمال الخارجي والشفاء الداخلي معًا.

رسالة ختامية
هذا الريتريت ليس فقط رحلة إلى مكان جميل، بل دعوة حقيقية للعودة إلى الذات: إلى الجسد، إلى النفس، إلى البحر الداخلي الذي يهدأ حين يجد المساحة المناسبة. زنجبار هنا ليست مجرد وجهة - بل تجربة كاملة تقودها نوال بعناية، حضور، ولمسة أنثوية عميقة تجعل كل مشاركة تشعر أنها جزء من شيء حي، ناعم، ومتحوّل.`,
      retreat_questions: 'للاستفسارات أو الأسئلة:',
      retreat_submit: 'إرسال طلب',

      al_tira_page_label: 'الطيرة',
      al_tira_page_title: 'الطيرة يوغا',
      al_tira_page_intro: 'اختبري الحرية في الهواء. ممارسة معلقة للقوة والمرونة والمرح—مناسبة لجميع المستويات.',
      al_tira_heading: 'يوغا معلقة لكل جسد',
      al_tira_p1: 'الطيرة يوغا تنقل السجادة إلى الهواء. باستخدام تعليق ناعم، نبني القوة، نطلق التوتر، ونستكشف الحركة بطريقة داعمة ومرحة. سواء كنتِ جديدة أو ذات خبرة، الممارسة تلتقيك أينما كنتِ.',
      al_tira_p2: 'انضمي لمجتمع الطيرة للبقاء على تحديث بالجلسات، المشاركة مع الممارسين، والاتصال بنوال والفريق.',
      al_tira_join_title: 'انضمي لمجموعة الطيرة يوغا',
      al_tira_join_text: 'احصلي على الجداول والتحديثات وتواصلي مع الآخرين في مجتمع الطيرة يوغا على واتساب.',
      al_tira_join_btn: 'انضمي لمجموعة الطيرة يوغا على واتساب',

      jiva_page_label: 'حيفا يوغا',
      jiva_page_title: 'حيفا يوغا',
      jiva_page_body:
        'اليوغا ڤينياسا هي أسلوب يوغا ديناميكي يربط بين الحركة والتنفس، بحيث كل حركة بتنتقل للتانية بتناغم ووعي.',
      jiva_page_body_2:
        'هاد النوع من اليوغا بساعد على تقوية الجسم، زيادة المرونة، تهدئة العقل، وتحسين التواصل بين النفس والجسد، ليصير التمرين تجربة متكاملة للحضور والتوازن الداخلي.',
      jiva_page_whatsapp:
        'لمتابعة المواعيد والإلهام والقرب من المجتمع: انضمي إلى مجموعة واتساب حيفا يوغا.',
      jiva_moments_kicker: 'ريلز وصور',
      jiva_moments_title: 'من السجادة والبحر',
      jiva_moments_reels_label: 'ريلز فيديو قصيرة',
      jiva_moments_swipe_hint: 'مرّري أفقيًا لعرض المزيد.',
      jiva_reel_aria_1: 'ريل قصير — يوغا حيفا',
      jiva_reel_aria_2: 'ريل قصير ثانٍ — يوغا حيفا',
      jiva_reel_play: 'تشغيل الفيديو',
      jiva_photo_alt_1: 'يوغا حيفا — لقطة قبال البحر',
      jiva_photo_alt_2: 'يوغا حيفا — لقطة',
      jiva_pricing_greeting: 'سلامات اصدقائي',
      jiva_pricing_title: 'الأسعار',
      jiva_card_trial_title: 'الدرس التجريبي',
      jiva_card_pack4_title: 'باقة 4 دروس',
      jiva_card_single_title: 'درس واحد',
      jiva_price_trial: '65 شيكل',
      jiva_price_pack4: '260 شيكل',
      jiva_price_single: '75 شيكل',
      jiva_card_register: 'سجلي الآن',
      jiva_private_gift_badge: 'بطاقة هدية',
      jiva_private_title: 'درس خصوصي لصبية واحدة أو صبيتين',
      jiva_private_subtitle: 'يوغا مع تأمل موجه',
      jiva_private_price_1: 'صبية واحدة: 200 شيكل',
      jiva_private_price_2: 'صبيتين: 300 شيكل',
      jiva_private_gift_note: 'متاح كبطاقة هدية — اطلبي التاريخ والتفاصيل عبر واتساب.',
      jiva_private_btn_1: 'سجلي — صبية واحدة (200)',
      jiva_private_btn_2: 'سجلي — صبيتين (300)',
      jiva_private_btn_gift: 'بطاقة هدية',
      jiva_payment_title: 'الدفع',
      jiva_payment_methods: '🎟️ الدفع عن طريق Bit أو העברה בנקאית',
      jiva_policy_title: 'سياسة الإلغاء',
      jiva_cancel_rule: 'إلغاء درس قبل ب ١٢ ساعة فقط',
      jiva_meeting_title: 'موعد الحصة',
      jiva_schedule_slot1: 'الثلاثاء · في ستوديو نعيم · الساعة 19:20',
      jiva_schedule_slot2: 'السبت · قبال البحر · الساعة 18:30',
      jiva_join_eyebrow: 'المجتمع',
      jiva_join_title: 'انضمي لمجموعة حيفا يوغا',
      jiva_join_text: 'احصلي على الجداول والتحديثات وتواصلي مع الآخرين في مجتمع حيفا يوغا على واتساب.',
      jiva_join_btn: 'انضمي لمجموعة حيفا يوغا على واتساب',
      haifa_register_title: 'تأكيد التسجيل',
      haifa_register_selected_label: 'الحصة المختارة:',
      haifa_register_name: 'الاسم الكامل',
      haifa_register_phone: 'رقم الهاتف (يفضل واتساب)',
      haifa_register_confirm: 'تأكيد التسجيل',
      haifa_register_success: 'شكرًا لك! تم التسجيل بنجاح، وسيتم التواصل معك بأقرب وقت.',
      haifa_register_error: 'تعذر إرسال التسجيل، حاولي مرة أخرى.',
      haifa_pkg_trial: 'الدرس التجريبي (65 شيكل)',
      haifa_pkg_pack4: 'باقة 4 دروس (260 شيكل)',
      haifa_pkg_single: 'درس واحد (75 شيكل)',
      haifa_pkg_private1: 'درس خصوصي - صبية واحدة (200 شيكل)',
      haifa_pkg_private2: 'درس خصوصي - صبيتين (300 شيكل)',
      haifa_pkg_gift: 'بطاقة هدية',

      nawal_loader: 'تنفسي',
      nawal_tagline: 'مساحة هادئة لنورك الداخلي',
      nawal_register: 'التسجيل للرحلة',
      nawal_quote: '"استنشقي المستقبل، زفري الماضي."',
      nawal_connect: 'تواصلي مع الحضور',
      nawal_footer: 'وعي · يوغا · هدوء',
      nawal_haifa: 'يوغا حيفا'
    }
  };

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getText(lang, key) {
    var t = translations[lang] || translations.en;
    return t[key] != null ? t[key] : (translations.en[key] || key);
  }

  function applyLanguage(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'en';
    var root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    setStoredLang(lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = getText(lang, key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      var parts = spec.split(':');
      var attr = parts[0];
      var key = parts[1];
      if (attr && key) el.setAttribute(attr, getText(lang, key));
    });

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      var l = btn.getAttribute('data-lang-set');
      btn.classList.toggle('font-semibold', l === lang);
      btn.setAttribute('aria-pressed', l === lang ? 'true' : 'false');
    });

    var seoDesc = document.getElementById('seo-meta-description');
    if (seoDesc) {
      document.title = getText(lang, 'seo_title');
      seoDesc.setAttribute('content', getText(lang, 'seo_description'));
      var ogDesc = document.getElementById('og-description');
      if (ogDesc) ogDesc.setAttribute('content', getText(lang, 'seo_description'));
      var ogTitle = document.getElementById('og-title');
      if (ogTitle) ogTitle.setAttribute('content', getText(lang, 'seo_title'));
      var twTitle = document.getElementById('twitter-title');
      if (twTitle) twTitle.setAttribute('content', getText(lang, 'seo_title'));
    }

    window.dispatchEvent(new CustomEvent('nawal-lang-change', { detail: { lang: lang } }));
  }

  function initI18n() {
    var stored = getStoredLang();
    var lang = stored === 'ar' || stored === 'en' ? stored : 'ar';
    applyLanguage(lang);

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = btn.getAttribute('data-lang-set');
        if (l === 'ar' || l === 'en') applyLanguage(l);
      });
    });
  }

  window.nawalI18n = {
    getLang: function () { return getStoredLang() || 'ar'; },
    setLang: applyLanguage,
    t: getText,
    init: initI18n
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})();
