/**
 * Shared IA with the Nawal Yoga site.
 * Main-site worlds use plain <a> tags so they leave the shop
 * and land on the parent routes. Shop-internal links stay in Next.
 */
export const SITE = {
  home: "/",
  experiences: "/experiences",
  yoga: "/yoga",
  privateSessions: "/private-sessions",
  retreats: "/retreats",
  wellbeing: "/health-forms",
  shop: "/",
  journal: "/journal",
  whatsapp: "https://wa.me/972522496366",
  instagram: "https://instagram.com/nawal_aom",
} as const;

export const PRIMARY_NAV = [
  { href: SITE.experiences, label: "التجارب", external: true },
  { href: SITE.yoga, label: "اليوغا", external: true },
  { href: SITE.privateSessions, label: "جلسات خاصة", external: true },
  { href: SITE.retreats, label: "الرحلات", external: true },
  { href: SITE.wellbeing, label: "العناية", external: true },
  { href: SITE.shop, label: "المتجر", current: true },
] as const;

export const SHOP_SECTIONS = [
  { href: "/#departments", label: "الأقسام" },
  { href: "/#mat", label: "السجادة" },
  { href: "/#block", label: "البلوك" },
  { href: "/#materials", label: "الخامات" },
  { href: "/#faq", label: "الأسئلة" },
] as const;
