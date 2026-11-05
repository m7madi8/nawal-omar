const HERO_DESKTOP = '/media/zanzibar/Mvuvi-Boutique-Resort---Kiwengwa.jpg';

export default function RetreatsLayout({ children }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={HERO_DESKTOP}
        media="(min-width: 768px)"
        type="image/jpeg"
      />
      {children}
    </>
  );
}
