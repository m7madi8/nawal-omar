export const SHOP_COLORS = {
  black: { id: 'black', en: 'Black', ar: 'أسود' },
  pink: { id: 'pink', en: 'Soft Pink', ar: 'وردي هادئ' },
};

export const PRODUCT_CATALOG = {
  mat: {
    id: 'mat',
    commerceType: 'product',
    source: 'shop-order',
    title: { en: 'Yoga Mat', ar: 'سجادة اليوغا' },
    description: {
      en: 'Premium cork and rubber yoga mat',
      ar: 'سجادة يوغا فاخرة من الفلين والمطاط',
    },
    images: ['/media/products/pink-matt.png'],
    pricing: {
      currency: 'USD',
      amount: 128,
      amountCents: 12800,
    },
    colors: SHOP_COLORS,
    metadata: {
      pagePath: '/shop',
    },
  },
  block: {
    id: 'block',
    commerceType: 'product',
    source: 'shop-order',
    title: { en: 'Yoga Block', ar: 'بلوك اليوغا' },
    description: {
      en: 'Solid cork yoga block',
      ar: 'بلوك يوغا من الفلين الصلب',
    },
    images: ['/media/products/black-blocks.png'],
    pricing: {
      currency: 'USD',
      amount: 48,
      amountCents: 4800,
    },
    colors: SHOP_COLORS,
    metadata: {
      pagePath: '/shop',
    },
  },
};

export function getProduct(id) {
  return PRODUCT_CATALOG[id] || null;
}

export function getProductColor(id) {
  return SHOP_COLORS[id] || SHOP_COLORS.black;
}

export function listProducts() {
  return Object.values(PRODUCT_CATALOG);
}
