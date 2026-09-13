export const LESSON_CATALOG = {
  'haifa-yoga': {
    id: 'haifa-yoga',
    commerceType: 'lesson',
    category: 'yoga-class',
    source: 'yoga-class-registration',
    sources: ['yoga-class-request'],
    title: { en: 'Haifa Yoga Classes', ar: 'دروس يوغا حيفا' },
    description: {
      en: 'Weekly Vinyasa yoga classes in Haifa',
      ar: 'دروس فينياسا يوغا أسبوعية في حيفا',
    },
    images: ['/media/haifa/hero.jpg'],
    location: { en: 'Haifa', ar: 'حيفا' },
    schedule: 'ongoing',
    packages: {
      trial: {
        id: 'trial',
        labelKey: 'haifa_pkg_trial',
        amount: 65,
        currency: 'ILS',
      },
      pack4: {
        id: 'pack4',
        labelKey: 'haifa_pkg_pack4',
        amount: 260,
        currency: 'ILS',
      },
      single: {
        id: 'single',
        labelKey: 'haifa_pkg_single',
        amount: 75,
        currency: 'ILS',
      },
      private1: {
        id: 'private1',
        labelKey: 'haifa_pkg_private1',
        amount: 200,
        currency: 'ILS',
      },
      private2: {
        id: 'private2',
        labelKey: 'haifa_pkg_private2',
        amount: 300,
        currency: 'ILS',
      },
      gift: {
        id: 'gift',
        labelKey: 'haifa_pkg_gift',
        amount: 0,
        currency: 'ILS',
      },
    },
    bookingStatus: 'open',
    metadata: {
      pagePath: '/workshops/haifa',
    },
  },
};

export function getLesson(id) {
  return LESSON_CATALOG[id] || null;
}

export function getLessonPackage(lesson, packageId = 'trial') {
  if (!lesson?.packages) return null;
  return lesson.packages[packageId] || lesson.packages.trial;
}

export function listLessons() {
  return Object.values(LESSON_CATALOG);
}
