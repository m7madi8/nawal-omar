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
      workshops_heading: 'Al-Tira · Haifa · Retreat',
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
      retreats_page_title: 'Available Retreats',
      retreats_page_intro: 'Choose your next wellness journey.',
      retreats_zanzibar_title: 'Zanzibar Retreat',
      retreats_zanzibar_desc: '8 days | 7 nights of yoga, sound healing, nature, and deep restoration.',
      retreats_dahab_title: 'Dahab Retreat',
      retreats_dahab_desc: 'A calm Red Sea retreat in Dahab with yoga, breathwork, and mindful rest.',
      retreats_view_details: 'View retreat details',
      retreat_dahab_page_label: 'Dahab Retreat with Nawal Omar',
      retreat_dahab_meta_title: 'Dahab Retreat | Nawal Omar',
      retreat_dahab_meta_desc:
        'Dahab & Saint Catherine retreat with Nawal Omar, yoga teacher from Haifa, Israel. Red Sea yoga, breathwork and mountain journey.',
      retreat_dahab_page_title: 'Saint Catherine Mountain Climb & Dahab Retreat',
      retreat_dahab_page_intro: 'To the highest peak in Egypt, plus a special retreat with guide Nawal Omar.',
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
      retreat_form_submit: 'Send to WhatsApp',
      retreat_share_title: 'Retreat Details',
      retreat_share1: `Why this retreat is different?
• A balanced program between movement and rest, plus sea activities and nature.
• Two boutique accommodations chosen for a calm, retreat-friendly atmosphere.
• Daily breakfast and dinner to reduce logistical load.
• Two Sound Healing sessions with a specialist who brings the equipment to both hotels.
• A blend of the travel experience and a deep inner process led by Nawal.
• The option to join according to each participant's needs.

What is included?
• Round-trip direct flight ticket with Arkia
• Baggage up to 20 kg
• Carry-on bag
• All ground transfers within Zanzibar
• 4 nights in carefully selected accommodation in the south of Zanzibar
• 3 nights in carefully selected beachfront accommodation in the north-east of Zanzibar
• Meals:
  o Daily breakfast
  o Daily dinner
• Two Sound Healing sessions with a specialist arriving with equipment to both hotels
• Visit to Salaam Cave
• Safari Blue boat trip
• Visit to Jozani Forest
• Visit to the Spice Farm
• Mnemba snorkeling trip
• Visit to Prison Island
• Tour of Stone Town

Selected accommodation details
• 4 nights in carefully selected accommodation in the south of Zanzibar.
• 3 nights in carefully selected beachfront accommodation in the north-east of Zanzibar.
• Final accommodation details are shared after booking confirmation.

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

Friday 10/7/2026 - From the south to the north-east - Nature & culture
This day was designed as an efficient transfer day from the south to Kiwengwa, making smart use of it by passing through Jozani Forest and the Spice Farm before reaching the second hotel.
Time / Details	Details
07:00	Light morning yoga.
08:00	Breakfast + check-out.
09:30	Visit Jozani Forest: mindful walk in the forest + observation of Red Colobus monkeys.
12:00	Visit Spice Farm: getting to know cinnamon, vanilla, cloves, nutmeg, and how aromas affect the nervous system.
Afternoon	Transfer to the second accommodation in the north-east + check-in.
18:30	Sunset soft yoga.
19:30	First Sound Healing session at the second hotel.
✨ Value of this day
This order keeps the transfer day practical, organized, and rich in experience—not just travel.
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
        'Holistic Vinyasa by the sea: movement, breathwork, and meditation woven into one calm, supportive flow—cultivating awareness on the mat and in daily life.',
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
      jiva_schedule_slot1: 'NAMASTE · Saturday · 18:00 · by the sea ❤️',
      jiva_schedule_slot2: 'Tuesday · 19:20 · by the sea ❤️',
      jiva_join_eyebrow: 'Community',
      jiva_join_title: 'Join the Haifa Yoga group',
      jiva_join_text: 'Get schedules, updates, and connect with others in the Haifa Yoga community on WhatsApp.',
      jiva_join_btn: 'Join Haifa Yoga WhatsApp group',

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
      workshops_heading: 'الطيرة · حيفا · ريتريت',
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
      retreats_page_title: 'الريتريت المتوفر',
      retreats_page_intro: 'اختاري رحلتك القادمة للهدوء والتجدد.',
      retreats_zanzibar_title: 'ريتريت زنجبار',
      retreats_zanzibar_desc: '8 أيام | 7 ليالٍ من اليوغا، الساوند هيلينغ، الطبيعة، والتجدد العميق.',
      retreats_dahab_title: 'ريتريت دهب',
      retreats_dahab_desc: 'ريتريت هادئ في دهب على البحر الأحمر يجمع اليوغا، التنفس، والراحة الواعية.',
      retreats_view_details: 'عرض تفاصيل الريتريت',
      retreat_dahab_page_label: 'ريتريت دهب مع نوال عمر',
      retreat_dahab_meta_title: 'ريتريت دهب | نوال عمر',
      retreat_dahab_meta_desc:
        'ريتريت دهب وجبل سانت كاترين مع نوال عمر، مدربة يوغا من حيفا، إسرائيل. يوغا البحر الأحمر، عمل بالنفس ورحلة جبلية.',
      retreat_dahab_page_title: 'تسلق جبل سانت كاثرين وريتريت دهب',
      retreat_dahab_page_intro: 'الى اعلى قمة في مصر.. وريتريت مميزة مع المرشدة نوال عمر',
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
      retreat_form_submit: 'إرسال إلى واتساب',
      retreat_share_title: 'لماذا هذا الريتريت مختلف؟',
      retreat_share1: `لماذا هذا الريتريت مختلف؟
برنامج متوازن بين الحركة والراحة والأنشطة البحرية والطبيعة.
إقامتان بوتيك تم اختيارهما لأجواء هادئة ومناسبة للريتريت.
وجبتا فطور وعشاء يوميًا لتخفيف العبء اللوجستي عن المشاركات.
جلستا Sound Healing مع مختصة تأتي بالمعدات إلى الفندقين.
مزيج بين التجربة السياحية والمسار الداخلي العميق بقيادة نوال.
إمكانية الانضمام بحسب حاجة كل مشاركة.

ماذا تشمل الباقة؟
• تذكرة طيران مباشر ذهابًا وإيابًا مع Arkia
• حقيبة حتى 20 كغم
• حقيبة يد
• جميع التنقلات الأرضية داخل زنجبار
• 4 ليالٍ في إقامة مختارة بعناية في جنوب زنجبار
• 3 ليالٍ في إقامة مختارة بعناية على الشاطئ في شمال شرق زنجبار
• وجبات:
  o فطور يومي
  o عشاء يومي
• جلستان Sound Healing مع مختصة تصل مع معداتها إلى الفندقين
• زيارة Salaam Cave
• رحلة Safari Blue
• زيارة Jozani Forest
• زيارة مزرعة التوابل
• رحلة Mnemba snorkeling
• زيارة Prison Island
• جولة في Stone Town

تفاصيل الإقامة المختارة
• 4 ليالٍ في إقامة مختارة بعناية في جنوب زنجبار.
• 3 ليالٍ في إقامة مختارة بعناية على الشاطئ في شمال شرق زنجبار.
• سيتم مشاركة تفاصيل الإقامة النهائية بعد تأكيد الحجز.

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

الجمعة 10/7/2026 - من الجنوب إلى الشمال الشرقي - الطبيعة والثقافة
تم اعتماد هذا اليوم كيوم انتقال من الجنوب إلى Kiwengwa مع الاستفادة منه بذكاء من خلال المرور في Jozani Forest ومزرعة التوابل قبل الوصول إلى الفندق الثاني.
الوقت / الفقرة	التفاصيل
07:00	يوغا صباحية خفيفة.
08:00	فطور وتسجيل خروج.
09:30	زيارة Jozani Forest ومشي تأملي وسط الغابة ومشاهدة قرود الـ Red Colobus.
12:00	زيارة Spice Farm والتعرّف إلى القرفة، الفانيلا، القرنفل وجوزة الطيب وتأثير الروائح على الجهاز العصبي.
بعد الظهر	الانتقال إلى مكان الإقامة الثاني في شمال شرق الجزيرة وتسجيل الدخول.
18:30	يوغا ناعمة عند الغروب.
19:30	جلسة Sound Healing أولى في الفندق الثاني.
✨ قيمة هذا اليوم
بهذا الترتيب نحافظ على يوم انتقال عملي، منظم، وغني بالتجربة بدل أن يكون يوم مواصلات فقط.
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
        'فينشياسا شاملة قرب البحر: ننسج الحركة وعمل النَفَس والتأمل في تدفق واحد هادئ، ونزرع الوعي والحضور—في الحصة وفي اليوم.',
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
      jiva_schedule_slot1: 'NAMASTE · موعدنا يوم السبت · الساعة 18:00 · قبال البحر ❤️',
      jiva_schedule_slot2: 'موعدنا يوم الثلاثاء · الساعة 19:20 · قبال البحر ❤️',
      jiva_join_eyebrow: 'المجتمع',
      jiva_join_title: 'انضمي لمجموعة حيفا يوغا',
      jiva_join_text: 'احصلي على الجداول والتحديثات وتواصلي مع الآخرين في مجتمع حيفا يوغا على واتساب.',
      jiva_join_btn: 'انضمي لمجموعة حيفا يوغا على واتساب',

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
